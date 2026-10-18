// Channel vs DM interaction logic and multi-turn memory.
import type { WorkspaceAgent } from "./catalog.js";
import type { ChatMessage } from "../state/store.js";

export type ChatKind = "channel" | "dm";

export function classifyChat(chatId: string, knownAgentIds: Set<string>): ChatKind {
  if (knownAgentIds.has(chatId)) return "dm";
  // channel ids look like general-swarm, #ops, team-*
  return "channel";
}

/** Extract @mentions: @name or @"Display Name" */
export function parseMentions(text: string): string[] {
  const found: string[] = [];
  const re = /@(?:"([^"]+)"|([A-Za-z0-9_\-./]+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    found.push((m[1] || m[2] || "").trim());
  }
  return found;
}

export function resolveMentionedAgents(
  mentions: string[],
  agents: WorkspaceAgent[],
): WorkspaceAgent[] {
  const out: WorkspaceAgent[] = [];
  for (const raw of mentions) {
    const key = raw.toLowerCase();
    const hit = agents.find(
      (a) =>
        a.id.toLowerCase() === key ||
        a.name.toLowerCase() === key ||
        a.name.toLowerCase().replace(/\s+/g, "-") === key,
    );
    if (hit && !out.some((x) => x.id === hit.id)) out.push(hit);
  }
  return out;
}

/** In channels, only act when at least one agent is @mentioned (unless forceAll). */
export function shouldRespondInChannel(text: string, agents: WorkspaceAgent[]): WorkspaceAgent[] {
  const mentions = parseMentions(text);
  if (mentions.length === 0) return [];
  return resolveMentionedAgents(mentions, agents);
}

/** Build multi-turn transcript context for an agent. */
export function buildMemoryContext(
  messages: ChatMessage[],
  limit = 24,
): string {
  const slice = messages.slice(-limit);
  return slice
    .map((m) => {
      const who = m.isOutgoing ? "User" : m.senderName || m.senderId;
      return `${who}: ${m.text}`;
    })
    .join("\n");
}

/** Compose system prompt from agent role + optional constraints already in role text. */
export function systemPromptFor(agent: WorkspaceAgent): string {
  return [
    `You are ${agent.name}, an Empyrean workspace agent.`,
    `Role: ${agent.role}`,
    agent.skills.length
      ? `Skills available: ${agent.skills.join(", ")}. When using a skill, narrate progress in plain language and summarize structural results.`
      : "No extra skills attached; reason and reply in natural language.",
    `Runtime: ${agent.runtime}. Model preference: ${agent.model}.`,
    "Respect any length, format, or style constraints stated in your role.",
  ].join("\n");
}

export function stripMentions(text: string): string {
  return text.replace(/@(?:"[^"]+"|[A-Za-z0-9_\-./]+)\s*/g, "").trim() || text.trim();
}
