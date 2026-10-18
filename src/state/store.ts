// State store with optional JSON file persistence (STATE_DB).
// Models: Agents, Directives, Tasks, Events, Envelopes, Telegram Chats, Second Brain, Canvases, Triggers, and Calls.
// Demo seed data is gated by SEED_DEMO_DATA=true.
import { createRequire } from "node:module";
import { log, AgentName, TaskKind, TaskState, ExecutionTree, Envelope } from "../protocol/types.js";

const require = createRequire(import.meta.url);

export interface AgentRecord {
  id: AgentName;
  display_name: string;
  role_title: string;
  tier: "reason" | "control" | "work" | "comms" | "gateway" | "external";
  description: string;
  provider: "ollama" | "lemonade" | "vertex" | "internal" | "external" | "none";
  model: string;
  target_kinds: TaskKind[];
  status: "idle" | "active" | "degraded" | "down";
  last_heartbeat: string;
  notes: string;
  sort_order: number;
}

export interface DirectiveRecord {
  id: string;
  text: string;
  context?: Record<string, unknown>;
  planned_by: "yhwh" | "fallback";
  tree: ExecutionTree;
  status: "pending" | "running" | "succeeded" | "failed";
  received_at: string;
  settled_at?: string;
}

export interface TaskRecord {
  id: string;
  directive_id: string;
  kind: TaskKind;
  depends_on: string[];
  routed_to: AgentName;
  state: TaskState;
  tool_used?: string;
  progress?: number;
  payload?: unknown;
  output?: unknown;
  error?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface EventRecord {
  id: string;
  topic: string;
  from_agent: AgentName;
  task_id?: string;
  data: Record<string, unknown>;
  webhooks: number;
  occurred_at: string;
}

export interface EnvelopeRecord {
  id: string;
  type: Envelope["type"];
  from_agent: AgentName;
  to_agent: AgentName;
  correlation_id?: string;
  payload: unknown;
  received_at: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatarColor: string;
  text: string;
  code?: string;
  toolUsage?: { tool: string; status: "executing" | "completed"; durationMs?: number };
  canvasAttachment?: { type: "sheet" | "code" | "call" | "dag"; id: string; title: string };
  inlineButtons?: { text: string; action: string }[];
  timestamp: string;
  isOutgoing: boolean;
}

export interface SecondBrainItem {
  id: string;
  title: string;
  category: "doc" | "email" | "call" | "memory";
  source: string;
  snippet: string;
  tags: string[];
  updatedAt: string;
}

export interface CanvasItem {
  id: string;
  type: "sheet" | "code" | "deck";
  title: string;
  content: string;
  lastModifiedBy: string;
  updatedAt: string;
}

export interface WorkflowTrigger {
  id: string;
  name: string;
  type: "interval" | "webhook" | "email";
  schedule: string;
  targetDirective: string;
  enabled: boolean;
  lastRun?: string;
  status: "idle" | "running" | "success" | "error";
}

export interface CallRecap {
  id: string;
  vendorName: string;
  phoneNumber: string;
  duration: string;
  status: "completed" | "scheduled" | "failed";
  audioUrl?: string;
  summary: string;
  transcript: { speaker: string; text: string; timestamp: string }[];
  actionItems: string[];
  createdAt: string;
}

export interface LemonadeModelSlot {
  id: string;
  name: string;
  backend: "ollama" | "lemonade" | "vllm" | "vertex";
  status: "active" | "standby" | "unloaded";
  vramUsageGb: number;
  contextWindow: number;
  tokensPerSec: number;
}

export interface LemonadeStatus {
  version: string;
  listeningPort: number;
  socketPath: string;
  hardware: {
    cpuLoad: number;
    gpuMemoryUsedGb: number;
    gpuMemoryTotalGb: number;
    npuAcceleration: boolean;
    npuDevice: string;
  };
  parameters: {
    temperature: number;
    topP: number;
    repeatPenalty: number;
    contextSize: number;
  };
  slots: LemonadeModelSlot[];
}

export class StateStore {
  private agents = new Map<string, AgentRecord>();
  private directives = new Map<string, DirectiveRecord>();
  private tasks = new Map<string, TaskRecord>();
  private events: EventRecord[] = [];
  private envelopes: EnvelopeRecord[] = [];
  private messages: ChatMessage[] = [];
  private secondBrain: SecondBrainItem[] = [];
  private canvases: CanvasItem[] = [];
  private triggers: WorkflowTrigger[] = [];
  private calls: CallRecap[] = [];
  private lemonade: LemonadeStatus = {
    version: "2.4.0",
    listeningPort: 3000,
    socketPath: "/tmp/coc-michael.sock",
    hardware: {
      cpuLoad: 0,
      gpuMemoryUsedGb: 0,
      gpuMemoryTotalGb: 0,
      npuAcceleration: false,
      npuDevice: "",
    },
    parameters: {
      temperature: 0.7,
      topP: 0.9,
      repeatPenalty: 1.1,
      contextSize: 8192,
    },
    slots: [
      { id: "slot-01", name: "qwen2.5:7b (Primary Local)", backend: "ollama", status: "active", vramUsageGb: 0, contextWindow: 8192, tokensPerSec: 0 },
    ],
  };

  private persistPath: string | null = null;
  private persistTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.seedAgents();
    const seedDemo = (process.env.SEED_DEMO_DATA ?? "false").toLowerCase() === "true";
    if (seedDemo) {
      this.seedDemoData();
      this.seedSecondBrain();
      this.seedCanvases();
      this.seedTriggers();
      this.seedCalls();
      this.seedTelegramMessages();
    }
    const db = (process.env.STATE_DB ?? "").trim();
    if (db) {
      this.persistPath = db;
      this.loadFromDisk();
    }
  }

  private schedulePersist(): void {
    if (!this.persistPath) return;
    if (this.persistTimer) clearTimeout(this.persistTimer);
    this.persistTimer = setTimeout(() => this.saveToDisk(), 250);
  }

  private loadFromDisk(): void {
    if (!this.persistPath) return;
    try {
      const { readFileSync, existsSync } = require("node:fs") as typeof import("node:fs");
      if (!existsSync(this.persistPath)) return;
      const raw = readFileSync(this.persistPath, "utf8");
      const data = JSON.parse(raw) as Record<string, unknown>;
      if (Array.isArray(data.messages)) this.messages = data.messages as ChatMessage[];
      if (Array.isArray(data.secondBrain)) this.secondBrain = data.secondBrain as SecondBrainItem[];
      if (Array.isArray(data.events)) this.events = data.events as EventRecord[];
      if (Array.isArray(data.envelopes)) this.envelopes = data.envelopes as EnvelopeRecord[];
      if (Array.isArray(data.canvases)) this.canvases = data.canvases as CanvasItem[];
      if (Array.isArray(data.triggers)) this.triggers = data.triggers as WorkflowTrigger[];
      if (Array.isArray(data.calls)) this.calls = data.calls as CallRecap[];
      if (data.directives && typeof data.directives === "object") {
        this.directives = new Map(Object.entries(data.directives as Record<string, DirectiveRecord>));
      }
      if (data.tasks && typeof data.tasks === "object") {
        this.tasks = new Map(Object.entries(data.tasks as Record<string, TaskRecord>));
      }
      log("info", "michael", "state_loaded", { path: this.persistPath });
    } catch (e) {
      log("warn", "michael", "state_load_failed", { path: this.persistPath, error: String(e) });
    }
  }

  private saveToDisk(): void {
    if (!this.persistPath) return;
    try {
      const { writeFileSync, renameSync, mkdirSync } = require("node:fs") as typeof import("node:fs");
      const { dirname } = require("node:path") as typeof import("node:path");
      mkdirSync(dirname(this.persistPath), { recursive: true });
      const payload = {
        version: 1,
        savedAt: new Date().toISOString(),
        messages: this.messages,
        secondBrain: this.secondBrain,
        events: this.events,
        envelopes: this.envelopes,
        canvases: this.canvases,
        triggers: this.triggers,
        calls: this.calls,
        directives: Object.fromEntries(this.directives),
        tasks: Object.fromEntries(this.tasks),
      };
      const tmp = this.persistPath + ".tmp";
      writeFileSync(tmp, JSON.stringify(payload, null, 2));
      renameSync(tmp, this.persistPath);
    } catch (e) {
      log("warn", "michael", "state_save_failed", { path: this.persistPath, error: String(e) });
    }
  }

  getLemonadeStatus(): LemonadeStatus {
    return { ...this.lemonade };
  }

  updateLemonadeParams(patch: Partial<LemonadeStatus["parameters"]>): LemonadeStatus {
    Object.assign(this.lemonade.parameters, patch);
    return { ...this.lemonade };
  }

  loadModelSlot(slotId: string): LemonadeStatus {
    this.lemonade.slots.forEach((s) => {
      if (s.id === slotId) s.status = "active";
      else if (s.status === "active") s.status = "standby";
    });
    return { ...this.lemonade };
  }

  private seedAgents() {
    const list: AgentRecord[] = [
      {
        id: "yhwh",
        display_name: "YHWH / Ann (Operations Lead)",
        role_title: "Chief Reasoning & Planning Kernel",
        tier: "reason",
        description: "Triage coordinator and reasoning engine. Analyzes user intent into executable DAG trees.",
        provider: "ollama",
        model: process.env.YHWH_MODEL ?? "qwen2.5:7b",
        target_kinds: ["llm.reason"],
        status: "active",
        last_heartbeat: new Date().toISOString(),
        notes: "Primary planning intelligence",
        sort_order: 1,
      },
      {
        id: "michael",
        display_name: "Michael (Archangel Commander)",
        role_title: "Workflow Coordinator & State Machine",
        tier: "control",
        description: "Orchestration commander. Resolves task dependencies via Kahn topological sort.",
        provider: "internal",
        model: "state-machine-v2",
        target_kinds: [],
        status: "active",
        last_heartbeat: new Date().toISOString(),
        notes: "Master daemon",
        sort_order: 2,
      },
      {
        id: "metatron",
        display_name: "Metatron (The Divine Scribe)",
        role_title: "LLM Router & Multi-Model Gateway",
        tier: "gateway",
        description: "Routes llm.reason tasks to local or external models with fallback.",
        provider: "internal",
        model: "heuristic-classifier",
        target_kinds: ["llm.reason"],
        status: "active",
        last_heartbeat: new Date().toISOString(),
        notes: "Gateway",
        sort_order: 3,
      },
      {
        id: "raphael",
        display_name: "Raphael (Task Bot & Worker)",
        role_title: "Full-Stack Engineer & Automation Bot",
        tier: "work",
        description: "Scaffolds files, runs allowlisted migrations and workspace checks.",
        provider: "internal",
        model: "worker-pool-v1",
        target_kinds: ["file.scaffold", "db.migrate", "workspace.maintain"],
        status: "active",
        last_heartbeat: new Date().toISOString(),
        notes: "Worker",
        sort_order: 4,
      },
      {
        id: "gabriel",
        display_name: "Gabriel / Ryan (Comms)",
        role_title: "Event Dispatcher & Webhook Messenger",
        tier: "comms",
        description: "Webhook fanout and event log.",
        provider: "internal",
        model: "fanout-engine",
        target_kinds: ["notify", "deliver_payload"],
        status: "active",
        last_heartbeat: new Date().toISOString(),
        notes: "Messenger",
        sort_order: 5,
      },
      {
        id: "seraphim",
        display_name: "Seraphim (Strategic Oracles)",
        role_title: "External Cloud LLM Pool",
        tier: "external",
        description: "Vertex AI / Gemini external reasoning pool.",
        provider: "vertex",
        model: process.env.SERAPHIM_MODEL ?? "gemini-2.0-flash",
        target_kinds: ["llm.reason"],
        status: "active",
        last_heartbeat: new Date().toISOString(),
        notes: "External pool",
        sort_order: 6,
      },
    ];
    for (const a of list) this.agents.set(a.id, a);
  }

  private seedSecondBrain() {
    this.secondBrain = [
      {
        id: "sb-01",
        title: "Platform Core Architecture",
        category: "doc",
        source: "Architecture Blueprint",
        snippet: "Six-agent assembly with DAG execution and LLM routing.",
        tags: ["architecture", "spec"],
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private seedCanvases() {
    this.canvases = [];
  }

  private seedTriggers() {
    this.triggers = [];
  }

  private seedCalls() {
    this.calls = [];
  }

  public seedDemoData() {
    // Minimal demo directive for SEED_DEMO_DATA mode only
  }

  private seedTelegramMessages() {
    this.messages = [];
  }

  getMessages(chatId?: string): ChatMessage[] {
    if (!chatId) return [...this.messages];
    return this.messages.filter((m) => m.chatId === chatId);
  }

  addMessage(partial: Omit<ChatMessage, "id"> & { id?: string }): ChatMessage {
    const msg: ChatMessage = {
      id: partial.id ?? globalThis.crypto.randomUUID(),
      ...partial,
    };
    this.messages.push(msg);
    if (this.messages.length > 2000) this.messages.splice(0, this.messages.length - 2000);
    this.schedulePersist();
    return msg;
  }

  getSecondBrain(): SecondBrainItem[] {
    return [...this.secondBrain];
  }

  addSecondBrainItem(body: Partial<SecondBrainItem>): SecondBrainItem {
    const item: SecondBrainItem = {
      id: body.id ?? globalThis.crypto.randomUUID(),
      title: body.title ?? "Untitled",
      category: body.category ?? "memory",
      source: body.source ?? "manual",
      snippet: body.snippet ?? "",
      tags: body.tags ?? [],
      updatedAt: new Date().toISOString(),
    };
    this.secondBrain.push(item);
    this.schedulePersist();
    return item;
  }

  getCanvases(): CanvasItem[] {
    return [...this.canvases];
  }

  getCanvas(id: string): CanvasItem | undefined {
    return this.canvases.find((c) => c.id === id);
  }

  updateCanvas(id: string, patch: Partial<CanvasItem>): CanvasItem | undefined {
    const c = this.canvases.find((x) => x.id === id);
    if (!c) return undefined;
    Object.assign(c, patch, { updatedAt: new Date().toISOString() });
    this.schedulePersist();
    return c;
  }

  getTriggers(): WorkflowTrigger[] {
    return [...this.triggers];
  }

  toggleTrigger(id: string, enabled?: boolean): WorkflowTrigger | undefined {
    const t = this.triggers.find((x) => x.id === id);
    if (!t) return undefined;
    t.enabled = enabled ?? !t.enabled;
    this.schedulePersist();
    return t;
  }

  getCalls(): CallRecap[] {
    return [...this.calls];
  }

  getAgents(): AgentRecord[] {
    return Array.from(this.agents.values()).sort((a, b) => a.sort_order - b.sort_order);
  }

  getAgent(id: string): AgentRecord | undefined {
    return this.agents.get(id);
  }

  addAgent(agent: AgentRecord): AgentRecord {
    this.agents.set(agent.id, agent);
    return agent;
  }

  addCall(call: CallRecap): CallRecap {
    this.calls.push(call);
    this.schedulePersist();
    return call;
  }

  addCanvas(canvas: CanvasItem): CanvasItem {
    this.canvases.push(canvas);
    this.schedulePersist();
    return canvas;
  }

  saveDirective(d: DirectiveRecord): void {
    this.directives.set(d.id, d);
    this.schedulePersist();
  }

  getDirectives(): DirectiveRecord[] {
    return Array.from(this.directives.values());
  }

  getDirective(id: string): DirectiveRecord | undefined {
    return this.directives.get(id);
  }

  getTasks(): TaskRecord[] {
    return Array.from(this.tasks.values());
  }

  getTask(id: string): TaskRecord | undefined {
    return this.tasks.get(id);
  }

  upsertTask(partial: Partial<TaskRecord> & { id: string }): TaskRecord {
    const existing = this.tasks.get(partial.id);
    const now = new Date().toISOString();
    const record: TaskRecord = {
      id: partial.id,
      directive_id: partial.directive_id ?? existing?.directive_id ?? "",
      kind: partial.kind ?? existing?.kind ?? "llm.reason",
      depends_on: partial.depends_on ?? existing?.depends_on ?? [],
      routed_to: partial.routed_to ?? existing?.routed_to ?? "raphael",
      state: partial.state ?? existing?.state ?? "pending",
      tool_used: partial.tool_used ?? existing?.tool_used,
      progress: partial.progress ?? existing?.progress,
      payload: partial.payload ?? existing?.payload,
      output: partial.output ?? existing?.output,
      error: partial.error ?? existing?.error,
      created_at: existing?.created_at ?? now,
      started_at: partial.state === "running" ? now : existing?.started_at,
      completed_at: existing?.completed_at,
    };
    this.tasks.set(record.id, record);
    this.schedulePersist();
    return record;
  }

  completeTask(id: string, state: TaskState, output?: unknown, error?: string): void {
    const t = this.tasks.get(id);
    if (!t) return;
    t.state = state;
    t.output = output;
    t.error = error;
    t.completed_at = new Date().toISOString();
    this.tasks.set(id, t);
    this.schedulePersist();
  }

  getEvents(): EventRecord[] {
    return [...this.events];
  }

  appendEvent(topic: string, data: Record<string, unknown>, fromAgent: AgentName = "michael"): EventRecord {
    const record: EventRecord = {
      id: globalThis.crypto.randomUUID(),
      topic,
      from_agent: fromAgent,
      data,
      webhooks: 0,
      occurred_at: new Date().toISOString(),
    };
    this.events.push(record);
    if (this.events.length > 500) this.events.shift();
    this.schedulePersist();
    return record;
  }

  getEnvelopes(): EnvelopeRecord[] {
    return [...this.envelopes];
  }

  recordEnvelope(env: Envelope): void {
    const record: EnvelopeRecord = {
      id: env.id,
      type: env.type,
      from_agent: env.from,
      to_agent: env.to,
      correlation_id: env.correlationId,
      payload: env.payload,
      received_at: env.createdAt ?? new Date().toISOString(),
    };
    this.envelopes.push(record);
    if (this.envelopes.length > 500) this.envelopes.shift();
    this.schedulePersist();
  }

  getMetrics() {
    const tasks = Array.from(this.tasks.values());
    const succeeded = tasks.filter((t) => t.state === "succeeded").length;
    const failed = tasks.filter((t) => t.state === "failed").length;
    const running = tasks.filter((t) => t.state === "running").length;
    const pending = tasks.filter((t) => t.state === "pending").length;
    const fallback = tasks.filter((t) => t.state === "fallback").length;

    return {
      totalDirectives: this.directives.size,
      totalTasks: tasks.length,
      taskThroughput: {
        succeeded,
        failed,
        running,
        pending,
        fallback,
        successRate: tasks.length > 0 ? Math.round(((succeeded + fallback) / tasks.length) * 100) : 100,
      },
      totalEvents: this.events.length,
      totalEnvelopes: this.envelopes.length,
      activeAgents: Array.from(this.agents.values()).filter((a) => a.status === "active").length,
      secondBrainItems: this.secondBrain.length,
      activeTriggers: this.triggers.filter((t) => t.enabled).length,
      persistence: this.persistPath ?? "memory",
    };
  }

  private async syncSupabase(table: string, row: Record<string, unknown>) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return;
    try {
      await fetch(`${url}/rest/v1/${table}`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(row),
      });
    } catch (e) {
      log("warn", "michael", "supabase_sync_failed", { table, error: String(e) });
    }
  }
}
