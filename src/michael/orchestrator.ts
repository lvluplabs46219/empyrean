// Michael — Orchestrator Core.
// State machine coordinator: receives directives from YHWH, resolves the task
// DAG, dispatches to Raphael (work) or Gabriel (events), routes llm.reason via Metatron.
import {
  AgentName, Directive, Envelope, ExecutionTree, TaskNode, TaskResult, TaskState,
  envelope, log, newId,
} from "../protocol/types.js";
import { StateStore, DirectiveRecord } from "../state/store.js";
import { Gabriel } from "../gabriel/messenger.js";
import { Raphael } from "../raphael/worker.js";
import * as metatron from "../metatron/gateway.js";
import * as yhwh from "../yhwh/core.js";

const LLM_KINDS = new Set(["llm.reason"]);
const GABRIEL_KINDS = new Set(["notify", "deliver_payload"]);

export class Michael {
  public store = new StateStore();
  private gabriel = new Gabriel(this.store);
  private raphael = new Raphael();
  private results = new Map<string, TaskResult>();
  private workers = new Map<string, { name: string; pid?: number; hostname?: string; lastSeen: string }>();

  getStore(): StateStore {
    return this.store;
  }

  getResults(): TaskResult[] {
    return [...this.results.values()];
  }

  /** Entry point for a raw directive: plan with YHWH, then execute the DAG. */
  async handleDirective(directive: Directive): Promise<{ directiveId: string; tree: ExecutionTree; results: TaskResult[] }> {
    const directiveId = "dir-" + newId().slice(0, 8);
    const receivedAt = new Date().toISOString();

    const tree = await yhwh.plan(directive);

    const directiveRecord: DirectiveRecord = {
      id: directiveId,
      text: directive.text,
      context: directive.context,
      planned_by: "yhwh",
      tree,
      status: "running",
      received_at: receivedAt,
    };
    this.store.saveDirective(directiveRecord);

    for (const node of tree.nodes) {
      let routedTo: AgentName = "raphael";
      if (LLM_KINDS.has(node.kind)) routedTo = "metatron";
      else if (GABRIEL_KINDS.has(node.kind)) routedTo = "gabriel";

      this.store.upsertTask({
        id: node.id,
        directive_id: directiveId,
        kind: node.kind,
        state: "pending",
        depends_on: node.dependsOn,
        routed_to: routedTo,
        payload: node.payload,
      });
    }

    const order = this.topoSort(tree);
    for (const node of order) {
      await this.execute(node, directiveId);
    }

    const settledAt = new Date().toISOString();
    const finalResults = tree.nodes.map((n) => this.results.get(n.id)!).filter(Boolean);
    const anyFailed = finalResults.some((r) => r.state === "failed");

    directiveRecord.status = anyFailed ? "failed" : "succeeded";
    directiveRecord.settled_at = settledAt;
    this.store.saveDirective(directiveRecord);

    this.store.appendEvent(
      "directive.settled",
      { directiveId, totalNodes: tree.nodes.length, status: directiveRecord.status, text: directive.text },
      "michael"
    );

    return { directiveId, tree, results: finalResults };
  }

  private async execute(node: TaskNode, directiveId?: string): Promise<void> {
    const depsOk = node.dependsOn.every((d) => {
      const state = this.results.get(d)?.state;
      return state === "succeeded" || state === "fallback";
    });

    if (!depsOk) {
      this.settle(node.id, "failed", undefined, "dependency not satisfied");
      return;
    }

    let targetAgent: AgentName = "raphael";
    if (LLM_KINDS.has(node.kind)) targetAgent = "metatron";
    else if (GABRIEL_KINDS.has(node.kind)) targetAgent = "gabriel";

    this.store.upsertTask({
      id: node.id,
      directive_id: directiveId,
      kind: node.kind,
      state: "running",
      depends_on: node.dependsOn,
      routed_to: targetAgent,
      payload: node.payload,
    });

    this.store.recordEnvelope(
      envelope("task", "michael", targetAgent, { taskId: node.id, kind: node.kind, payload: node.payload })
    );

    try {
      let output: unknown;
      let finalState: TaskState = "succeeded";

      if (LLM_KINDS.has(node.kind)) {
        const prompt = typeof node.payload === "string"
          ? node.payload
          : JSON.stringify(node.payload);
        const res = await metatron.complete(prompt);
        output = res;
        if (res.decision?.tier === "seraphim->yhwh") {
          finalState = "fallback";
        }
      } else if (GABRIEL_KINDS.has(node.kind)) {
        output = await this.gabriel.emit({ topic: node.kind, data: { task: node.id, payload: node.payload } });
      } else {
        output = await this.raphael.run(node);
      }

      this.settle(node.id, finalState, output);

      this.store.recordEnvelope(
        envelope("task_result", targetAgent, "michael", { taskId: node.id, state: finalState, output })
      );
    } catch (e) {
      this.settle(node.id, "failed", undefined, String(e));
      await this.gabriel.emit({ topic: "task.failed", data: { task: node.id, error: String(e) } });

      this.store.recordEnvelope(
        envelope("task_result", targetAgent, "michael", { taskId: node.id, state: "failed", error: String(e) })
      );
    }
  }

  private settle(taskId: string, state: TaskState, output?: unknown, error?: string) {
    const r: TaskResult = { taskId, state, output, error };
    this.results.set(taskId, r);
    this.store.completeTask(taskId, state, output, error);
    log(state === "succeeded" || state === "fallback" ? "info" : "error", "michael", "task_settled", { taskId, state, error });
  }

  private topoSort(tree: ExecutionTree): TaskNode[] {
    const byId = new Map(tree.nodes.map((n) => [n.id, n]));
    const indeg = new Map(tree.nodes.map((n) => [n.id, n.dependsOn.filter((d) => byId.has(d)).length]));
    const queue = tree.nodes.filter((n) => (indeg.get(n.id) ?? 0) === 0);
    const out: TaskNode[] = [];
    const seen = new Set<string>();
    while (queue.length) {
      const n = queue.shift()!;
      out.push(n);
      seen.add(n.id);
      for (const m of tree.nodes) {
        if (m.dependsOn.includes(n.id)) {
          const d = (indeg.get(m.id) ?? 1) - 1;
          indeg.set(m.id, d);
          if (d === 0) queue.push(m);
        }
      }
    }
    for (const n of tree.nodes) if (!seen.has(n.id)) out.push(n);
    return out;
  }

  async onEnvelope(env: Envelope): Promise<Envelope | null> {
    log("info", "michael", "envelope_received", { type: env.type, from: env.from });
    this.store.recordEnvelope(env);

    let reply: Envelope | null = null;

    switch (env.type) {
      case "directive": {
        const { results } = await this.handleDirective(env.payload as Directive);
        reply = envelope("task_result", "michael", env.from, results, env.correlationId);
        break;
      }
      case "task": {
        reply = this.gabriel.handle(env);
        break;
      }
      case "query": {
        const payload = (env.payload ?? {}) as {
          action?: string;
          worker?: string;
          pid?: number;
          hostname?: string;
          register?: string;
        };
        const action = payload.action ?? (payload.register ? "register" : "status");

        if (action === "register" || action === "heartbeat") {
          const name = payload.worker ?? payload.register ?? "worker";
          this.workers.set(name, {
            name,
            pid: payload.pid,
            hostname: payload.hostname,
            lastSeen: new Date().toISOString(),
          });
          const agent = this.store.getAgent("raphael");
          if (agent) {
            agent.last_heartbeat = new Date().toISOString();
            agent.status = "active";
          }
          reply = envelope(
            "task_result",
            "michael",
            env.from,
            { ok: true, action, worker: name, workers: [...this.workers.values()] },
            env.correlationId,
          );
        } else {
          reply = envelope(
            "task_result",
            "michael",
            env.from,
            {
              ok: true,
              agent: "michael" as AgentName,
              workers: [...this.workers.values()],
              metrics: this.store.getMetrics(),
            },
            env.correlationId,
          );
        }
        break;
      }
      default:
        reply = null;
    }

    if (reply) {
      this.store.recordEnvelope(reply);
    }
    return reply;
  }
}
