// Workspace agent registry (deployable agents with name/avatar/role/model/skills/runtime).
import {
  WorkspaceAgent,
  RuntimeEnvironment,
  SKILLS_CATALOG,
  slugifyAgentName,
  pickAvatarColor,
} from "./catalog.js";
import { complete as yhwhComplete } from "../yhwh/core.js";
import {
  buildMemoryContext,
  systemPromptFor,
  stripMentions,
} from "./messaging.js";
import type { ChatMessage } from "../state/store.js";

export class WorkspaceAgentRegistry {
  private agents = new Map<string, WorkspaceAgent>();

  list(): WorkspaceAgent[] {
    return [...this.agents.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  get(id: string): WorkspaceAgent | undefined {
    return this.agents.get(id);
  }

  ids(): Set<string> {
    return new Set(this.agents.keys());
  }

  deploy(input: {
    name: string;
    role: string;
    model?: string;
    skills?: string[];
    runtime?: RuntimeEnvironment;
    avatarUrl?: string;
    avatarColor?: string;
    id?: string;
  }): WorkspaceAgent {
    const base = slugifyAgentName(input.name);
    let id = input.id ?? base;
    if (this.agents.has(id)) id = `${base}-${globalThis.crypto.randomUUID().slice(0, 6)}`;

    const skillIds = (input.skills ?? []).filter((s) =>
      SKILLS_CATALOG.some((c) => c.id === s),
    );

    const agent: WorkspaceAgent = {
      id,
      name: input.name.trim() || "Agent",
      avatarUrl: input.avatarUrl,
      avatarColor: input.avatarColor ?? pickAvatarColor(id),
      role: input.role.trim() || "Helpful workspace agent.",
      model: input.model ?? process.env.YHWH_MODEL ?? "hermes3:8b",
      skills: skillIds,
      runtime: input.runtime ?? "local_machine",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.agents.set(id, agent);
    return agent;
  }

  update(id: string, patch: Partial<WorkspaceAgent>): WorkspaceAgent | undefined {
    const cur = this.agents.get(id);
    if (!cur) return undefined;
    const next: WorkspaceAgent = {
      ...cur,
      ...patch,
      id: cur.id,
      updatedAt: new Date().toISOString(),
    };
    this.agents.set(id, next);
    return next;
  }

  remove(id: string): boolean {
    return this.agents.delete(id);
  }

  loadMany(list: WorkspaceAgent[]): void {
    for (const a of list) this.agents.set(a.id, a);
  }

  toJSON(): WorkspaceAgent[] {
    return this.list();
  }

  /** Run one agent turn with role system prompt + chat memory + skill narration. */
  async runTurn(
    agent: WorkspaceAgent,
    userText: string,
    history: ChatMessage[],
  ): Promise<{ text: string; skillNotes: string[] }> {
    const memory = buildMemoryContext(history);
    const prompt = [
      systemPromptFor(agent),
      "",
      "Recent conversation:",
      memory || "(no prior messages)",
      "",
      `User: ${stripMentions(userText)}`,
      "",
      "Reply as the agent. If you would use skills, list them briefly and describe what you did.",
    ].join("\n");

    const skillNotes: string[] = [];
    for (const sid of agent.skills) {
      const def = SKILLS_CATALOG.find((s) => s.id === sid);
      if (!def) continue;
      // Lightweight structured execution summary (no unrestricted side effects here)
      skillNotes.push(
        `Skill "${def.name}" (${def.id}): prepared for this turn — ${def.description}`,
      );
    }

    let text: string;
    try {
      text = await yhwhComplete(prompt, systemPromptFor(agent));
    } catch {
      text = `${agent.name} received: "${stripMentions(userText)}". (Model unavailable; acknowledging with role constraints applied.)`;
    }

    if (skillNotes.length) {
      text = `${text}\n\n—\n${skillNotes.map((s) => `• ${s}`).join("\n")}`;
    }
    return { text, skillNotes };
  }
}

export const workspaceAgents = new WorkspaceAgentRegistry();
