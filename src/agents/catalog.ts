// Skills catalog, models, and runtime environments for workspace agents.
// Product copy uses Empyrean terms only.

export type RuntimeEnvironment = "cloud_sandbox" | "local_machine" | "advanced_runtime";

export interface SkillDef {
  id: string;
  name: string;
  description: string;
  category: "web" | "code" | "data" | "comms" | "files" | "system";
}

export interface ModelOption {
  id: string;
  label: string;
  provider: "ollama" | "hermes_online" | "internal";
}

export interface RuntimeOption {
  id: RuntimeEnvironment;
  label: string;
  description: string;
}

/** Modular tools attachable to a workspace agent. */
export const SKILLS_CATALOG: SkillDef[] = [
  { id: "web.fetch", name: "Web fetch", description: "Retrieve and summarize public web pages.", category: "web" },
  { id: "web.search", name: "Web search", description: "Search the public web for sources.", category: "web" },
  { id: "code.scaffold", name: "Code scaffold", description: "Generate files and project stubs.", category: "code" },
  { id: "code.review", name: "Code review", description: "Review diffs and suggest fixes.", category: "code" },
  { id: "data.query", name: "Data query", description: "Query structured stores and summarize rows.", category: "data" },
  { id: "data.rag", name: "Knowledge retrieval", description: "Search Second Brain / document embeddings.", category: "data" },
  { id: "comms.notify", name: "Notify", description: "Send webhook or channel notifications.", category: "comms" },
  { id: "files.read", name: "Read files", description: "Read workspace files within allowlisted roots.", category: "files" },
  { id: "files.write", name: "Write files", description: "Write scaffolded content within allowlisted roots.", category: "files" },
  { id: "system.shell", name: "Allowlisted shell", description: "Run pre-approved maintenance commands.", category: "system" },
];

export const MODEL_OPTIONS: ModelOption[] = [
  { id: "hermes3:8b", label: "Hermes 3 8B (Ollama local)", provider: "ollama" },
  { id: "hermes3:latest", label: "Hermes 3 latest (Ollama)", provider: "ollama" },
  { id: "hermes-online", label: "Hermes online (OpenAI-compatible)", provider: "hermes_online" },
  { id: "internal-planner", label: "Built-in planner (heuristic)", provider: "internal" },
];

export const RUNTIME_OPTIONS: RuntimeOption[] = [
  {
    id: "cloud_sandbox",
    label: "Managed cloud sandbox",
    description: "Serverless managed environment with built-in web tools; no local hardware required.",
  },
  {
    id: "local_machine",
    label: "This computer",
    description: "Run on local or regional infrastructure you control.",
  },
  {
    id: "advanced_runtime",
    label: "Advanced concurrent runtime",
    description: "Optimized for concurrent operations and custom environment handling.",
  },
];

export interface WorkspaceAgent {
  id: string;
  /** Display name in channels and DMs. */
  name: string;
  /** Optional avatar URL or data-URI. */
  avatarUrl?: string;
  avatarColor: string;
  /** Role text = foundational system prompt / behavioral boundary. */
  role: string;
  model: string;
  skills: string[];
  runtime: RuntimeEnvironment;
  status: "active" | "paused" | "deploying";
  createdAt: string;
  updatedAt: string;
}

export function slugifyAgentName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "agent"
  );
}

const AVATAR_COLORS = ["#af0a78", "#0284c7", "#10b981", "#a855f7", "#f59e0b", "#ef4444", "#6366f1"];

export function pickAvatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h]!;
}
