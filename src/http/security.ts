// HTTP security helpers: CORS allowlist + optional Bearer auth.
import type { IncomingMessage, ServerResponse } from "node:http";

export function applyCors(req: IncomingMessage, res: ServerResponse): boolean {
  const raw = (process.env.CORS_ORIGIN ?? "").trim();
  const origin = req.headers.origin;

  if (!raw) {
    // Same-origin only: do not emit ACAO for cross-origin browsers.
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return true;
  }

  const allowed = raw.split(",").map((s) => s.trim()).filter(Boolean);
  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (allowed.includes("*")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return true;
}

/** Returns true if request is authorized (or auth is disabled). */
export function requireAuth(req: IncomingMessage, res: ServerResponse): boolean {
  const token = (process.env.AUTH_TOKEN ?? "").trim();
  if (!token) return true; // auth disabled when unset (dev mode)

  const header = req.headers.authorization ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (match && match[1] === token) return true;

  res.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "unauthorized", hint: "Send Authorization: Bearer <AUTH_TOKEN>" }));
  return false;
}

export function supabaseConfig() {
  const base = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  const key = (process.env.SUPABASE_SERVICE_KEY ?? "").replace(/^"|"$/g, "");
  const ragPath = process.env.SUPABASE_RAG_PATH ?? "/functions/v1/rag-query";
  const embedPath = process.env.SUPABASE_EMBED_PATH ?? "/functions/v1/generate-embedding";
  const stripePath = process.env.SUPABASE_STRIPE_PATH ?? "/functions/v1/stripe-webhook";
  return {
    base,
    key,
    ragUrl: base ? `${base}${ragPath.startsWith("/") ? ragPath : "/" + ragPath}` : "",
    embedUrl: base ? `${base}${embedPath.startsWith("/") ? embedPath : "/" + embedPath}` : "",
    stripeUrl: base ? `${base}${stripePath.startsWith("/") ? stripePath : "/" + stripePath}` : "",
  };
}
