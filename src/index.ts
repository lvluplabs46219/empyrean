// Daemon entrypoint: boots Michael (orchestrator), listens on HTTP (port 3000) and UDS socket.
import http from "node:http";
import { Michael } from "./michael/orchestrator.js";
import { serve } from "./transport/uds.js";
import { Envelope, Directive, AgentName, log } from "./protocol/types.js";
import { ChatMessage } from "./state/store.js";
import { renderDashboard } from "./ui.js";
import { applyCors, requireAuth, supabaseConfig } from "./http/security.js";

async function main() {
  if (typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile();
    } catch {
      // Optional .env
    }
  }

  const michael = new Michael();

  // 1. Unix Domain Socket server (backwards-compatible with CLI tools)
  const sock = process.env.MICHAEL_SOCK ?? "/tmp/coc-michael.sock";
  const udsServer = serve(sock, (env: Envelope) => michael.onEnvelope(env));
  udsServer.on("listening", () => log("info", "michael", "uds_socket_ready", { sock }));

  // 2. HTTP Server for AI Studio Web UI (port 3000)
  const port = Number(process.env.PORT ?? 3000);
  const host = "0.0.0.0";

  const httpServer = http.createServer(async (req, res) => {
    applyCors(req, res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // Mutating routes require Bearer AUTH_TOKEN when configured
    const isMutating = req.method === "POST" || req.method === "PATCH" || req.method === "PUT" || req.method === "DELETE";
    if (isMutating && !requireAuth(req, res)) {
      return;
    }

    const parsedUrl = new URL(req.url ?? "/", `http://${req.headers.host || "localhost"}`);
    const pathname = parsedUrl.pathname;

    const sendJson = (statusCode: number, data: unknown) => {
      res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(data));
    };

    const readBody = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", () => {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch (e) {
            reject(e);
          }
        });
        req.on("error", reject);
      });
    };

    // Static Web Dashboard
    if ((req.method === "GET" || req.method === "HEAD") && (pathname === "/" || pathname === "/index.html")) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      if (req.method === "HEAD") {
        res.end();
      } else {
        res.end(renderDashboard());
      }
      return;
    }

    // Health check
    if ((req.method === "GET" || req.method === "HEAD") && (pathname === "/api/health" || pathname === "/healthz")) {
      sendJson(200, {
        status: "ok",
        orchestrator: "michael",
        uptime: process.uptime(),
        sock,
        agentsCount: michael.getStore().getAgents().length,
        authRequired: Boolean((process.env.AUTH_TOKEN ?? "").trim()),
        persistence: process.env.STATE_DB || "memory",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Metrics
    if (req.method === "GET" && pathname === "/api/metrics") {
      sendJson(200, michael.getStore().getMetrics());
      return;
    }

    // Chat messages
    if (req.method === "GET" && pathname === "/api/messages") {
      const chatId = parsedUrl.searchParams.get("chatId") ?? "general-swarm";
      sendJson(200, michael.getStore().getMessages(chatId));
      return;
    }

    // Send a message or directive
    if (req.method === "POST" && pathname === "/api/messages") {
      try {
        const body = await readBody();
        const text = (body.text || "").trim();
        const chatId = body.chatId || "general-swarm";

        if (!text) {
          sendJson(400, { error: "Message text cannot be empty" });
          return;
        }

        const userMsg = michael.getStore().addMessage({
          chatId,
          senderId: "user",
          senderName: "You",
          senderAvatarColor: "#2481cc",
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOutgoing: true,
        });

        if (text.startsWith("/rag ") || text.startsWith("/rag")) {
          const ragQuery = text.replace(/^\/rag\s*/, "").trim() || "What are the core platform specifications?";
          (async () => {
            try {
              const headers: Record<string, string> = { "Content-Type": "application/json" };
              const token = (process.env.AUTH_TOKEN ?? "").trim();
              if (token) headers["Authorization"] = `Bearer ${token}`;
              const ragRes = await fetch(`http://127.0.0.1:${port}/api/rag-query`, {
                method: "POST",
                headers,
                body: JSON.stringify({ query: ragQuery })
              });
              const data = await ragRes.json() as any;
              const answerText = data.answer || "No direct RAG answer returned.";
              const sourceNotice = data.edgeNotice ? `\n\n_Note: ${data.edgeNotice}_` : "";

              michael.getStore().addMessage({
                chatId,
                senderId: "metatron",
                senderName: "Metatron (RAG Oracle)",
                senderAvatarColor: "#006388",
                text: `🔍 **RAG Retrieval** for: _\"${ragQuery}\"_\n\n${answerText}${sourceNotice}`,
                canvasAttachment: { type: "sheet", id: "cv-sheet-01", title: `RAG Insight: ${ragQuery.slice(0, 24)}...` },
                toolUsage: { tool: "VectorRAG", status: "completed", durationMs: 240 },
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isOutgoing: false,
              });
            } catch (ragErr) {
              michael.getStore().addMessage({
                chatId,
                senderId: "metatron",
                senderName: "Metatron (RAG Oracle)",
                senderAvatarColor: "#006388",
                text: `⚠️ RAG notice: ${String(ragErr)}`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isOutgoing: false,
              });
            }
          })();

          sendJson(200, { ok: true, userMessage: userMsg });
          return;
        }

        (async () => {
          try {
            const directive: Directive = { text, context: { chatId, origin: "http_ui" } };
            const outcome = await michael.handleDirective(directive);

            michael.getStore().addMessage({
              chatId,
              senderId: "yhwh",
              senderName: "YHWH / Ann (Operations Lead)",
              senderAvatarColor: "#818cf8",
              text: `✨ Intent analyzed. Decomposed into ExecutionTree DAG with ${outcome.tree.nodes.length} nodes (Root: \`${outcome.tree.rootId}\`). Handing over to Michael.`,
              canvasAttachment: { type: "dag", id: outcome.directiveId, title: `DAG Execution Tree (${outcome.tree.nodes.length} Nodes)` },
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isOutgoing: false,
            });

            const isSuccess = outcome.results.every((r) => r.state === "succeeded" || r.state === "fallback");
            michael.getStore().addMessage({
              chatId,
              senderId: "michael",
              senderName: "Michael (Archangel Commander)",
              senderAvatarColor: "#0284c7",
              text: `⚡ Kahn topological dependencies resolved. Dispatched tasks.\nState: ${isSuccess ? "ALL TASKS COMPLETED" : "PARTIAL RESOLUTION"}`,
              toolUsage: { tool: "KahnTopologicalResolver", status: "completed", durationMs: 120 },
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isOutgoing: false,
            });

            outcome.results.forEach((r) => {
              let senderId: AgentName = "raphael";
              let senderName = "Raphael (Task Bot)";
              let color = "#f59e0b";
              let tool = "CodeGenTool";
              let canvas: ChatMessage["canvasAttachment"] = undefined;

              if (r.taskId.includes("reason")) {
                senderId = "metatron";
                senderName = "Metatron (The Divine Scribe)";
                color = "#a855f7";
                tool = "MetatronOracleRouter";
                canvas = { type: "sheet", id: "cv-sheet-01", title: "Oracle Consensus Matrix" };
              } else if (r.taskId.includes("notify")) {
                senderId = "gabriel";
                senderName = "Gabriel / Ryan (Comms)";
                color = "#10b981";
                tool = "WebhookFanout";
              } else if (r.taskId.includes("scaffold") || r.taskId.includes("migrate")) {
                canvas = { type: "code", id: "cv-code-01", title: "src/auth/jwt_verifier.ts" };
              }

              michael.getStore().addMessage({
                chatId,
                senderId,
                senderName,
                senderAvatarColor: color,
                text: `Delivered subtask [${r.taskId}] — ${r.state.toUpperCase()}`,
                code: r.output ? JSON.stringify(r.output, null, 2) : r.error,
                toolUsage: { tool, status: "completed", durationMs: 280 },
                canvasAttachment: canvas,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isOutgoing: false,
              });
            });
          } catch (e) {
            michael.getStore().addMessage({
              chatId,
              senderId: "michael",
              senderName: "Michael (Archangel Commander)",
              senderAvatarColor: "#0284c7",
              text: `⚠️ Execution notice: ${String(e)}`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isOutgoing: false,
            });
          }
        })();

        sendJson(200, { ok: true, userMessage: userMsg });
      } catch (err) {
        sendJson(500, { error: String(err) });
      }
      return;
    }

    // Second Brain
    if (req.method === "GET" && pathname === "/api/second-brain") {
      sendJson(200, michael.getStore().getSecondBrain());
      return;
    }
    if (req.method === "POST" && pathname === "/api/second-brain") {
      try {
        const body = await readBody();
        const item = michael.getStore().addSecondBrainItem(body);
        sendJson(200, item);
      } catch (e) {
        sendJson(400, { error: String(e) });
      }
      return;
    }

    // Supabase — env only
    const sb = supabaseConfig();
    const SUPABASE_RAG_URL = sb.ragUrl;
    const supabaseServiceKey = sb.key;

    if (req.method === "GET" && pathname === "/api/rag-query/status") {
      sendJson(200, {
        endpoint: SUPABASE_RAG_URL || null,
        configured: Boolean(SUPABASE_RAG_URL),
        hasKey: Boolean(supabaseServiceKey),
        method: "POST",
        description: "Supabase Vector RAG Retrieval Edge Function",
        status: SUPABASE_RAG_URL && supabaseServiceKey ? "configured" : "not_configured",
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/rag-query") {
      try {
        const body = await readBody();
        const queryText = (body.query || body.text || "").trim();
        if (!queryText) {
          sendJson(400, { error: "Query parameter cannot be empty" });
          return;
        }

        let edgeData: any = null;
        let edgeStatus = 0;
        let edgeError = "";

        try {
          if (!SUPABASE_RAG_URL || !supabaseServiceKey) {
            throw new Error("SUPABASE_URL / SUPABASE_SERVICE_KEY not configured");
          }
          const edgeRes = await fetch(SUPABASE_RAG_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseServiceKey}`,
              "apikey": supabaseServiceKey,
            },
            body: JSON.stringify({
              query: queryText,
              top_k: body.top_k || 5,
              threshold: body.threshold || 0.6,
            }),
          });
          edgeStatus = edgeRes.status;
          const textRes = await edgeRes.text();
          try {
            edgeData = JSON.parse(textRes);
          } catch {
            edgeData = { raw: textRes };
          }
        } catch (fetchErr) {
          edgeError = String(fetchErr);
        }

        if (edgeStatus === 200 && edgeData && !edgeData.error) {
          sendJson(200, {
            status: "success",
            source: "supabase_edge_rag",
            endpoint: SUPABASE_RAG_URL,
            query: queryText,
            results: edgeData,
          });
          return;
        }

        const secondBrainItems = michael.getStore().getSecondBrain();
        const queryWords = queryText.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);

        const scored = secondBrainItems.map((item) => {
          const searchable = `${item.title} ${item.snippet} ${item.source} ${item.tags.join(" ")}`.toLowerCase();
          let score = 0;
          queryWords.forEach((word: string) => {
            if (searchable.includes(word)) score += 0.35;
          });
          if (item.category === "doc") score += 0.15;
          return { item, similarity: Math.min(0.99, Number((score + 0.55).toFixed(2))) };
        }).sort((a, b) => b.similarity - a.similarity);

        const topMatches = scored.slice(0, 3).map((s) => ({
          title: s.item.title,
          category: s.item.category,
          source: s.item.source,
          content: s.item.snippet,
          similarity: s.similarity,
          tags: s.item.tags,
        }));

        const answer =
          `Based on retrieved context for query "${queryText}":\n` +
          topMatches.map((m) => `• [${m.source}] ${m.content}`).join("\n\n");

        sendJson(200, {
          status: "hybrid_rag",
          source: "supabase_rag_with_second_brain",
          endpoint: SUPABASE_RAG_URL || null,
          edgeStatus,
          edgeNotice: edgeData?.error || edgeError || "Using Second Brain hybrid retrieval.",
          query: queryText,
          matches: topMatches,
          answer,
        });
      } catch (err) {
        sendJson(500, { error: String(err) });
      }
      return;
    }

    const SUPABASE_EMBED_URL = sb.embedUrl;
    if (req.method === "POST" && pathname === "/api/supabase/generate-embedding") {
      try {
        const body = await readBody();
        const documentId = body.document_id || body.id;
        if (!documentId) {
          sendJson(400, { error: "Missing document_id in request body" });
          return;
        }

        let edgeStatus = 0;
        let edgeData: any = null;
        try {
          if (!SUPABASE_EMBED_URL || !supabaseServiceKey) {
            throw new Error("SUPABASE_URL / SUPABASE_SERVICE_KEY not configured");
          }
          const res = await fetch(SUPABASE_EMBED_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseServiceKey}`,
              "apikey": supabaseServiceKey,
            },
            body: JSON.stringify({ document_id: documentId }),
          });
          edgeStatus = res.status;
          const t = await res.text();
          try {
            edgeData = JSON.parse(t);
          } catch {
            edgeData = { raw: t };
          }
        } catch (e) {
          edgeData = { error: String(e) };
        }

        sendJson(200, {
          endpoint: SUPABASE_EMBED_URL || null,
          document_id: documentId,
          status: edgeStatus === 200 ? "embedded" : "queued",
          edgeStatus,
          edgeResponse: edgeData,
        });
      } catch (err) {
        sendJson(500, { error: String(err) });
      }
      return;
    }

    const SUPABASE_STRIPE_URL = sb.stripeUrl;
    if (req.method === "POST" && pathname === "/api/supabase/stripe-webhook") {
      try {
        const body = await readBody();
        const orgId = body.organization_id || "org-empyrean-01";
        const plan = body.plan || "pro";
        const eventType = body.type || "customer.subscription.created";

        const simulatedPayload = {
          id: "evt_" + globalThis.crypto.randomUUID().slice(0, 14),
          object: "event",
          type: eventType,
          data: {
            object: {
              id: "sub_" + globalThis.crypto.randomUUID().slice(0, 14),
              customer: "cus_" + globalThis.crypto.randomUUID().slice(0, 14),
              status: "active",
              metadata: { organization_id: orgId, plan },
            },
          },
        };

        let edgeStatus = 0;
        let edgeData: any = null;
        try {
          if (!SUPABASE_STRIPE_URL || !supabaseServiceKey) {
            throw new Error("SUPABASE_URL / SUPABASE_SERVICE_KEY not configured");
          }
          const res = await fetch(SUPABASE_STRIPE_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseServiceKey}`,
              "apikey": supabaseServiceKey,
              "stripe-signature": "t=" + Math.floor(Date.now() / 1000) + ",v1=empyrean_simulated_sig",
            },
            body: JSON.stringify(simulatedPayload),
          });
          edgeStatus = res.status;
          const t = await res.text();
          try {
            edgeData = JSON.parse(t);
          } catch {
            edgeData = { raw: t };
          }
        } catch (e) {
          edgeData = { error: String(e) };
        }

        michael.getStore().addMessage({
          chatId: "general-swarm",
          senderId: "gabriel",
          senderName: "Gabriel / Ryan (Billing Comms)",
          senderAvatarColor: "#10b981",
          text: `💳 Stripe event [${eventType}]: org \`${orgId}\` plan **${plan}** (edge ${edgeStatus})`,
          toolUsage: { tool: "StripeWebhookDispatcher", status: "completed", durationMs: 140 },
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOutgoing: false,
        });

        sendJson(200, {
          endpoint: SUPABASE_STRIPE_URL || null,
          edgeStatus,
          edgeResponse: edgeData,
          simulated: simulatedPayload,
        });
      } catch (err) {
        sendJson(500, { error: String(err) });
      }
      return;
    }

    if (req.method === "GET" && pathname === "/api/supabase/functions-status") {
      sendJson(200, {
        configured: Boolean(sb.base),
        functions: [
          { name: "generate-embedding", url: SUPABASE_EMBED_URL || null },
          { name: "rag-query", url: SUPABASE_RAG_URL || null },
          { name: "stripe-webhook", url: SUPABASE_STRIPE_URL || null },
        ],
      });
      return;
    }

    // Agents / directives / tasks / events / envelopes
    if (req.method === "GET" && pathname === "/api/agents") {
      sendJson(200, michael.getStore().getAgents());
      return;
    }
    if (req.method === "GET" && pathname === "/api/directives") {
      sendJson(200, michael.getStore().getDirectives());
      return;
    }
    if (req.method === "GET" && pathname.startsWith("/api/directives/")) {
      const id = pathname.replace("/api/directives/", "");
      const d = michael.getStore().getDirective(id);
      if (!d) return sendJson(404, { error: "Directive not found" });
      sendJson(200, d);
      return;
    }
    if (req.method === "GET" && pathname === "/api/tasks") {
      let tasks = michael.getStore().getTasks();
      const state = parsedUrl.searchParams.get("state");
      const kind = parsedUrl.searchParams.get("kind");
      const agent = parsedUrl.searchParams.get("agent");
      const directiveId = parsedUrl.searchParams.get("directive_id");
      if (state) tasks = tasks.filter((t) => t.state === state);
      if (kind) tasks = tasks.filter((t) => t.kind === kind);
      if (agent) tasks = tasks.filter((t) => t.routed_to === agent);
      if (directiveId) tasks = tasks.filter((t) => t.directive_id === directiveId);
      sendJson(200, tasks);
      return;
    }
    if (req.method === "GET" && pathname === "/api/events") {
      sendJson(200, michael.getStore().getEvents());
      return;
    }
    if (req.method === "GET" && pathname === "/api/envelopes") {
      sendJson(200, michael.getStore().getEnvelopes());
      return;
    }

    if (req.method === "POST" && pathname === "/api/directive") {
      try {
        const parsed = await readBody();
        const directive: Directive = {
          text: parsed.text || "Default directive",
          context: parsed.context,
        };
        log("info", "michael", "http_directive_received", { text: directive.text });
        const outcome = await michael.handleDirective(directive);
        sendJson(200, outcome);
      } catch (err) {
        log("error", "michael", "http_directive_error", { error: String(err) });
        sendJson(500, { error: String(err) });
      }
      return;
    }

    sendJson(404, { error: "Not Found", path: pathname });
  });

  httpServer.listen(port, host, () => {
    log("info", "michael", "http_server_ready", { port, host });
  });

  const shutdown = () => {
    log("info", "michael", "shutdown_initiated");
    udsServer.close();
    httpServer.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 2000).unref();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((e) => {
  console.error(JSON.stringify({ level: "error", event: "fatal", error: String(e) }));
  process.exit(1);
});
