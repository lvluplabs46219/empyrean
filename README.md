# Empyrean

Multi-agent orchestration kernel for directive → plan → DAG → execute workflows.

| Agent | Role |
|-------|------|
| **YHWH** | Planning / reasoning (Ollama → Gemini → heuristic) |
| **Michael** | Orchestrator & state machine (Kahn topological sort) |
| **Metatron** | LLM gateway / router |
| **Raphael** | Worker (scaffold, migrate, maintain) |
| **Gabriel** | Messenger / webhook fan-out |
| **Seraphim** | External Vertex AI / Gemini pool |

## Quick start

```bash
cp .env.example .env
# edit .env — set AUTH_TOKEN, CORS_ORIGIN, optional API keys
npm install   # or: bun install
npm run dev   # http://0.0.0.0:3000 + UDS /tmp/coc-michael.sock
```

Send a directive over UDS:

```bash
npm run send -- "scaffold a jwt module and notify"
```

## Configuration

See `.env.example`. Important production knobs:

| Variable | Purpose |
|----------|---------|
| `AUTH_TOKEN` | Required for mutating HTTP API routes when set |
| `CORS_ORIGIN` | Comma-separated allowed origins (default: empty = same-origin only) |
| `STATE_DB` | Path to JSON persistence file (e.g. `./data/state.json`) |
| `SEED_DEMO_DATA` | `true` to load demo agents/messages (default: `false` in production-minded runs) |
| `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` | RAG / edge functions |
| `GABRIEL_WEBHOOKS` | Comma-separated webhook URLs |
| `GEMINI_API_KEY` / `OLLAMA_URL` / Seraphim vars | LLM backends |

## Architecture

1. Client posts a **directive** (HTTP `/api/messages` or UDS envelope).
2. **YHWH** builds an `ExecutionTree` (DAG of `TaskNode`s).
3. **Michael** topologically sorts and dispatches:
   - `llm.reason` → Metatron → YHWH or Seraphim
   - `notify` / `deliver_payload` → Gabriel
   - file/db/workspace → Raphael
4. Results and chat messages are stored (memory + optional `STATE_DB` file).

Wire format: newline-delimited JSON `Envelope` over Unix domain socket; REST JSON over HTTP.

## Security notes

- Set `AUTH_TOKEN` and send `Authorization: Bearer <token>` on POST/PATCH routes.
- Restrict `CORS_ORIGIN`.
- Raphael only runs **allowlisted** shell commands for migrate/maintain.
- Never commit real service keys.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run daemon with tsx |
| `npm run build` / `start` | Compile and run |
| `npm run send -- "..."` | Dispatch directive via UDS |
| `npm run worker` | Register / heartbeat worker against Michael |
| `npm run lint` | Typecheck |

## Docker

```bash
docker build -t empyrean .
docker run --rm -p 3000:3000 -e AUTH_TOKEN=secret -e STATE_DB=/data/state.json -v empyrean-data:/data empyrean
```

## License

GPL-3.0
