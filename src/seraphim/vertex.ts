// Seraphim — External LLM pool via Hermes (OpenAI-compatible).
// No Gemini / Vertex. Uses HERMES_BASE_URL + HERMES_API_KEY + HERMES_MODEL.
import { log } from "../protocol/types.js";

const enabled = (): boolean => process.env.SERAPHIM_ENABLED === "true";
const baseUrl = (): string => (process.env.HERMES_BASE_URL ?? "").replace(/\/$/, "");
const apiKey = (): string => process.env.HERMES_API_KEY ?? "";
const modelId = (): string =>
  process.env.SERAPHIM_MODEL ?? process.env.HERMES_MODEL ?? "hermes3:8b";

class SeraphimError extends Error {
  constructor(message: string, public retriable: boolean) {
    super(message);
  }
}

/** Deep-reasoning completion via online Hermes (OpenAI-compatible chat API). */
export async function complete(prompt: string, timeoutMs?: number): Promise<string> {
  if (!enabled()) throw new SeraphimError("seraphim disabled", false);
  const base = baseUrl();
  if (!base) throw new SeraphimError("HERMES_BASE_URL not set", false);

  const timeout = timeoutMs ?? Number(process.env.SERAPHIM_TIMEOUT_MS ?? 30_000);
  const retries = Number(process.env.SERAPHIM_RETRIES ?? 1);
  let lastErr: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeout);
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        const key = apiKey();
        if (key) headers.Authorization = `Bearer ${key}`;

        const res = await fetch(`${base}/chat/completions`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: modelId(),
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
          }),
          signal: ctrl.signal,
        });
        if (res.status === 429 || res.status >= 500) {
          throw new SeraphimError(`http ${res.status}`, true);
        }
        if (!res.ok) throw new SeraphimError(`http ${res.status}`, false);
        const json = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        return json.choices?.[0]?.message?.content ?? "";
      } finally {
        clearTimeout(timer);
      }
    } catch (e) {
      lastErr = e;
      const retriable = e instanceof SeraphimError ? e.retriable : true;
      if (!retriable) break;
    }
  }

  log("warn", "seraphim", "hermes_external_failed", { error: String(lastErr) });
  throw lastErr ?? new SeraphimError("unknown failure", false);
}
