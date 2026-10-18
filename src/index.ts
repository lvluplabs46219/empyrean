// Empyrean daemon: Michael orchestrator + HTTP workspace + UDS.
import http from "node:http";
import { Michael } from "./michael/orchestrator.js";
import { serve } from "./transport/uds.js";
import { Envelope, Directive, AgentName, log } from "./protocol/types.js";
import { ChatMessage } from "./state/store.js";
import { renderDashboard } from "./ui.js";
import { applyCors, requireAuth, supabaseConfig } from "./http/security.js";
import {
  SKILLS_CATALOG,
  MODEL_OPTIONS,
  RUNTIME_OPTIONS,
  type RuntimeEnvironment,
} from "./agents/catalog.js";
import { workspaceAgents } from "./agents/workspace.js";
import {
  classifyChat,
  shouldRespondInChannel,
} from "./agents/messaging.js";

async function main() {
  const michael = new Michael();

  const sock = process.env.MICHAEL_SOCK ?? "/tmp/coc-michael.sock";
  const udsServer = serve(sock, (env: Envelope) => michael.onEnvelope(env));
  udsServer.on("listening", () => log("info", "michael", "uds_socket_ready", { sock }));

  const port = Number(process.env.PORT ?? 3000);
  const host = "0.0.0.0";

  const httpServer = http.createServer(async (req, res) => {
    applyCors(req, res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const isMutating =
      req.method === "POST" || req.method === "PATCH" || req.method === "PUT" || req.method === "DELETE";
    if (isMutating && !requireAuth(req, res)) return;

    const parsedUrl = new URL(req.url ?? "/", `http://${req.headers.host || "localhost"}`);
    const pathname = parsedUrl.pathname;

    const sendJson = (statusCode: number, data: unknown) => {
      res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(data));
    };

    const readBody = (): Promise<any> =>
      new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch (e) {
            reject(e);
          }
        });
        req.on("error", reject);
      });

    if ((req.method === "GET" || req.method === "HEAD") && (pathname === "/" || pathname === "/index.html")) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      if (req.method === "HEAD") res.end();
      else res.end(renderDashboard());
      return;
    }

    if ((req.method === "GET" || req.method === "HEAD") && (pathname === "/api/health" || pathname === "/healthz")) {
      sendJson(200, {
        status: "ok",
        orchestrator: "michael",
        uptime: process.uptime(),
        sock,
        agentsCount: michael.getStore().getAgents().length + workspaceAgents.list().length,
        workspaceAgents: workspaceAgents.list().length,
        authRequired: Boolean((process.env.AUTH_TOKEN ?? "").trim()),
        persistence: process.env.STATE_DB || "memory",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/metrics") {
      sendJson(200, {
        ...michael.getStore().getMetrics(),
        workspaceAgents: workspaceAgents.list().length,
      });
      return;
    }

    // Catalogs for Deploy Agent UI
    if (req.method === "GET" && pathname === "/api/skills") {
      sendJson(200, SKILLS_CATALOG);
      return;
    }
    if (req.method === "GET" && pathname === "/api/models") {
      sendJson(200, MODEL_OPTIONS);
      return;
    }
    if (req.method === "GET" && pathname === "/api/runtimes") {
      sendJson(200, RUNTIME_OPTIONS);
      return;
    }

    // Workspace agents CRUD
    if (req.method === "GET" && pathname === "/api/workspace-agents") {
      sendJson(200, workspaceAgents.list());
      return;
    }
    if (req.method === "POST" && pathname === "/api/workspace-agents") {
      try {
        const body = await readBody();
        if (!body.name || !body.role) {
          sendJson(400, { error: "name and role are required" });
          return;
        }
        const agent = workspaceAgents.deploy({
          name: String(body.name),
          role: String(body.role),
          model: body.model,
          skills: Array.isArray(body.skills) ? body.skills.map(String) : [],
          runtime: body.runtime as RuntimeEnvironment | undefined,
          avatarUrl: body.avatarUrl ? String(body.avatarUrl) : undefined,
          avatarColor: body.avatarColor ? String(body.avatarColor) : undefined,
        });
        michael.getStore().addMessage({
          chatId: "general-swarm",
          senderId: "michael",
          senderName: "Michael (Archangel Commander)",
          senderAvatarColor: "#0284c7",
          text: `Deployed agent **${agent.name}** (\`${agent.id}\`) · model ${agent.model} · runtime ${agent.runtime} · skills: ${agent.skills.join(", ") || "none"}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOutgoing: false,
        });
        sendJson(201, agent);
      } catch (e) {
        sendJson(400, { error: String(e) });
      }
      return;
    }
    if (req.method === "PATCH" && pathname.startsWith("/api/workspace-agents/")) {
      const id = pathname.replace("/api/workspace-agents/", "");
      try {
        const body = await readBody();
        const updated = workspaceAgents.update(id, body);
        if (!updated) return sendJson(404, { error: "agent not found" });
        sendJson(200, updated);
      } catch (e) {
        sendJson(400, { error: String(e) });
      }
      return;
    }
    if (req.method === "DELETE" && pathname.startsWith("/api/workspace-agents/")) {
      const id = pathname.replace("/api/workspace-agents/", "");
      const ok = workspaceAgents.remove(id);
      sendJson(ok ? 200 : 404, ok ? { ok: true } : { error: "agent not found" });
      return;
    }

    // Core system agents (read-only list)
    if (req.method === "GET" && pathname === "/api/agents") {
      sendJson(200, {
        system: michael.getStore().getAgents(),
        workspace: workspaceAgents.list(),
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/messages") {
      const chatId = parsedUrl.searchParams.get("chatId") ?? "general-swarm";
      sendJson(200, michael.getStore().getMessages(chatId));
      return;
    }

    // Messaging: channels require @mention; DMs always respond; multi-turn memory
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

        const kind = classifyChat(chatId, workspaceAgents.ids());
        const allWorkspace = workspaceAgents.list();

        // Channel: only respond when @mentioned
        if (kind === "channel") {
          const targets = shouldRespondInChannel(text, allWorkspace);
          if (targets.length === 0) {
            // No mention → listening only (optional soft ack for swarm ops commands)
            if (/\b(scaffold|migrate|maintain|notify)\b/i.test(text)) {
              // Fall through to classic swarm orchestration without requiring @
            } else {
              sendJson(200, {
                ok: true,
                userMessage: userMsg,
                note: "Channel is in listening mode. @mention an agent to invoke them.",
                listening: true,
              });
              return;
            }
          } else {
            const history = michael.getStore().getMessages(chatId);
            (async () => {
              for (const agent of targets) {
                try {
                  const { text: reply } = await workspaceAgents.runTurn(agent, text, history);
                  michael.getStore().addMessage({
                    chatId,
                    senderId: agent.id,
                    senderName: agent.name,
                    senderAvatarColor: agent.avatarColor,
                    text: reply,
                    toolUsage: agent.skills.length
                      ? { tool: agent.skills.join(","), status: "completed", durationMs: 200 }
                      : undefined,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    isOutgoing: false,
                  });
                } catch (e) {
                  michael.getStore().addMessage({
                    chatId,
                    senderId: agent.id,
                    senderName: agent.name,
                    senderAvatarColor: agent.avatarColor,
                    text: `⚠️ ${String(e)}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    isOutgoing: false,
                  });
                }
              }
            })();
            sendJson(200, { ok: true, userMessage: userMsg, invoked: targets.map((t) => t.id) });
            return;
          }
        }

        // DM: always treat as direct prompt to that agent
        if (kind === "dm") {
          const agent = workspaceAgents.get(chatId);
          if (agent) {
            const history = michael.getStore().getMessages(chatId);
            (async () => {
              try {
                const { text: reply } = await workspaceAgents.runTurn(agent, text, history);
                michael.getStore().addMessage({
                  chatId,
                  senderId: agent.id,
                  senderName: agent.name,
                  senderAvatarColor: agent.avatarColor,
                  text: reply,
                  toolUsage: agent.skills.length
                    ? { tool: agent.skills.join(","), status: "completed", durationMs: 200 }
                    : undefined,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  isOutgoing: false,
                });
              } catch (e) {
                michael.getStore().addMessage({
                  chatId,
                  senderId: agent.id,
                  senderName: agent.name,
                  senderAvatarColor: agent.avatarColor,
                  text: `⚠️ ${String(e)}`,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  isOutgoing: false,
                });
              }
            })();
            sendJson(200, { ok: true, userMessage: userMsg, dm: agent.id });
            return;
          }
        }

        // Classic swarm orchestration (Michael / YHWH pipeline)
        (async () => {
          try {
            const directive: Directive = { text, context: { chatId, origin: "http_ui" } };
            const outcome = await michael.handleDirective(directive);

            michael.getStore().addMessage({
              chatId,
              senderId: "yhwh",
              senderName: "YHWH / Ann (Operations Lead)",
              senderAvatarColor: "#818cf8",
              text: `✨ Intent analyzed. DAG with ${outcome.tree.nodes.length} nodes (Root: \`${outcome.tree.rootId}\`).`,
              canvasAttachment: {
                type: "dag",
                id: outcome.directiveId,
                title: `DAG (${outcome.tree.nodes.length} nodes)`,
              },
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isOutgoing: false,
            });

            const isSuccess = outcome.results.every((r) => r.state === "succeeded" || r.state === "fallback");
            michael.getStore().addMessage({
              chatId,
              senderId: "michael",
              senderName: "Michael (Archangel Commander)",
              senderAvatarColor: "#0284c7",
              text: `⚡ Tasks dispatched. State: ${isSuccess ? "ALL TASKS COMPLETED" : "PARTIAL"}`,
              toolUsage: { tool: "KahnTopologicalResolver", status: "completed", durationMs: 120 },
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isOutgoing: false,
            });

            for (const r of outcome.results) {
              let senderId: AgentName = "raphael";
              let senderName = "Raphael (Task Bot)";
              let color = "#f59e0b";
              let tool = "Worker";
              if (r.taskId.includes("reason")) {
                senderId = "metatron";
                senderName = "Metatron";
                color = "#a855f7";
                tool = "Router";
              } else if (r.taskId.includes("notify")) {
                senderId = "gabriel";
                senderName = "Gabriel";
                color = "#10b981";
                tool = "Notify";
              }
              michael.getStore().addMessage({
                chatId,
                senderId,
                senderName,
                senderAvatarColor: color,
                text: `Subtask [${r.taskId}] — ${r.state.toUpperCase()}`,
                code: r.output ? JSON.stringify(r.output, null, 2) : r.error,
                toolUsage: { tool, status: "completed", durationMs: 200 },
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isOutgoing: false,
              });
            }
          } catch (e) {
            michael.getStore().addMessage({
              chatId,
              senderId: "michael",
              senderName: "Michael",
              senderAvatarColor: "#0284c7",
              text: `⚠️ ${String(e)}`,
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

    if (req.method === "GET" && pathname === "/api/second-brain") {
      sendJson(200, michael.getStore().getSecondBrain());
      return;
    }
    if (req.method === "POST" && pathname === "/api/second-brain") {
      try {
        const body = await readBody();
        sendJson(200, michael.getStore().addSecondBrainItem(body));
      } catch (e) {
        sendJson(400, { error: String(e) });
      }
      return;
    }

    if (req.method === "GET" && pathname === "/api/directives") {
      sendJson(200, michael.getStore().getDirectives());
      return;
    }
    if (req.method === "GET" && pathname === "/api/tasks") {
      sendJson(200, michael.getStore().getTasks());
      return;
    }
    if (req.method === "GET" && pathname === "/api/events") {
      sendJson(200, michael.getStore().getEvents());
      return;
    }

    if (req.method === "POST" && pathname === "/api/directive") {
      try {
        const parsed = await readBody();
        const directive: Directive = {
          text: parsed.text || "Default directive",
          context: parsed.context,
        };
        const outcome = await michael.handleDirective(directive);
        sendJson(200, outcome);
      } catch (err) {
        sendJson(500, { error: String(err) });
      }
      return;
    }

    // Optional Supabase RAG (env-configured)
    const sb = supabaseConfig();
    if (req.method === "POST" && pathname === "/api/rag-query") {
      try {
        const body = await readBody();
        const queryText = (body.query || body.text || "").trim();
        if (!queryText) return sendJson(400, { error: "empty query" });
        const items = michael.getStore().getSecondBrain();
        const words = queryText.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
        const scored = items
          .map((item) => {
            const hay = `${item.title} ${item.snippet} ${item.source}`.toLowerCase();
            let score = 0.5;
            for (const w of words) if (hay.includes(w)) score += 0.2;
            return { item, similarity: Math.min(0.99, score) };
          })
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 3);
        sendJson(200, {
          status: "hybrid_rag",
          answer: scored.map((s) => `• ${s.item.snippet}`).join("\n") || "No matches",
          matches: scored,
          supabaseConfigured: Boolean(sb.ragUrl && sb.key),
        });
      } catch (e) {
        sendJson(500, { error: String(e) });
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
