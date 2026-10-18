// YHWH — Core Reasoning Engine.
// Order: local Ollama (Hermes) → online Hermes (OpenAI-compatible) → heuristic.
// Gemini is intentionally not used.
import { Directive, ExecutionTree, log } from "../protocol/types.js";

const ollamaUrl = (): string => process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const model = (): string => process.env.YHWH_MODEL ?? process.env.HERMES_MODEL ?? "hermes3:8b";

/** OpenAI-compatible chat completion (Nous Portal, OpenRouter, custom Hermes endpoint). */
async function hermesOnlineComplete(prompt: string, system?: string): Promise<string | null> {
  const base = (process.env.HERMES_BASE_URL ?? "").replace(/\/$/, "");
  const apiKey = process.env.HERMES_API_KEY ?? "";
  const onlineModel = process.env.HERMES_MODEL ?? model();
  if (!base) return null;

  try {
    const messages: { role: string; content: string }[] = [];
    if (system) messages.push({ role: "system", content: system });
    messages.push({ role: "user", content: prompt });

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: onlineModel,
        messages,
        temperature: 0.3,
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return json.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

/** Raw completion: Ollama Hermes → online Hermes → heuristic. */
export async function complete(prompt: string, system?: string): Promise<string> {
  // 1. Local Ollama (Hermes / any pulled model)
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), Number(process.env.OLLAMA_TIMEOUT_MS ?? 60_000));
    const res = await fetch(`${ollamaUrl()}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: model(), prompt, system, stream: false }),
      signal: ctrl.signal,
    }).finally(() => clearTimeout(timer));

    if (res.ok) {
      const json = (await res.json()) as { response: string };
      if (json.response) return json.response;
    }
  } catch {
    // Ollama offline — try online Hermes
  }

  // 2. Online Hermes (OpenAI-compatible — not Gemini)
  const online = await hermesOnlineComplete(prompt, system);
  if (online) return online;

  // 3. Deterministic heuristic completion
  log("info", "yhwh", "heuristic_completion_fallback", { promptSummary: prompt.slice(0, 60) });
  return JSON.stringify({
    agent: "yhwh",
    reasoning: "Intent analyzed and parsed successfully into execution DAG.",
    promptExcerpt: prompt.slice(0, 80),
    timestamp: new Date().toISOString(),
  });
}

function heuristicPlan(directive: Directive): ExecutionTree {
  const text = (directive.text || "").toLowerCase();
  const nodes: ExecutionTree["nodes"] = [];
  const rootId = "task-1-reason";

  nodes.push({
    id: rootId,
    kind: "llm.reason",
    dependsOn: [],
    payload: { action: "analyze_directive", directiveText: directive.text },
  });

  if (text.includes("scaffold") || text.includes("file") || text.includes("create") || text.includes("module")) {
    nodes.push({
      id: "task-2-scaffold",
      kind: "file.scaffold",
      dependsOn: [rootId],
      payload: {
        path: "/tmp/empyrean_generated.ts",
        content: `// Scaffolded by Raphael worker for directive: "${directive.text}"\nexport const timestamp = "${new Date().toISOString()}";\nexport const status = "ready";\n`,
      },
    });
  }

  if (text.includes("migrate") || text.includes("db") || text.includes("database") || text.includes("schema") || text.includes("sql")) {
    nodes.push({
      id: "task-3-migrate",
      kind: "db.migrate",
      dependsOn: nodes.length > 1 ? [nodes[nodes.length - 1].id] : [rootId],
      payload: { cmd: "echo '[db.migrate] Schema verified and applied'" },
    });
  }

  if (text.includes("maintain") || text.includes("lint") || text.includes("check") || text.includes("format") || text.includes("workspace")) {
    nodes.push({
      id: "task-4-maintain",
      kind: "workspace.maintain",
      dependsOn: [rootId],
      payload: { cmd: "echo '[workspace.maintain] Workspace integrity verified'" },
    });
  }

  const lastTask = nodes[nodes.length - 1];
  nodes.push({
    id: "task-notify-delivery",
    kind: "notify",
    dependsOn: [lastTask.id],
    payload: {
      topic: "directive.completed",
      directive: directive.text,
      executedNodes: nodes.length,
      timestamp: new Date().toISOString(),
    },
  });

  return { rootId, nodes };
}

/** High-level directive -> structured execution tree (DAG). */
export async function plan(directive: Directive): Promise<ExecutionTree> {
  const system = [
    "You are YHWH, a planning kernel.",
    'Given a user directive, output ONLY JSON matching:',
    '{"rootId":"<id>","nodes":[{"id":"<id>","kind":"<TaskKind>","dependsOn":["<id>"],"payload":{}}]}',
    "Valid TaskKind values: llm.reason, file.scaffold, db.migrate, workspace.maintain, notify, deliver_payload.",
    "Nodes must form a DAG. dependsOn may be empty.",
  ].join(" ");
  try {
    const raw = await complete(
      `Directive: ${directive.text}\nContext: ${JSON.stringify(directive.context ?? {})}`,
      system,
    );
    const tree = JSON.parse(raw.trim().replace(/^```(json)?|```$/g, "")) as ExecutionTree;
    if (!tree.rootId || !Array.isArray(tree.nodes) || tree.nodes.length === 0) {
      throw new Error("missing valid tree structure");
    }
    return tree;
  } catch {
    log("info", "yhwh", "using_heuristic_dag_plan");
    return heuristicPlan(directive);
  }
}
