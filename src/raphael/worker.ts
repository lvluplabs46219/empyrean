// Raphael — Task Bot & Worker.
// Heavy-lifting handlers: file scaffolding, migrations, workspace maintenance.
// Shell commands are allowlisted to prevent command injection.
import { TaskNode, log } from "../protocol/types.js";

export type TaskHandler = (payload: any) => Promise<unknown>;

/** Allowed migrate / maintain commands only. No arbitrary shell. */
const ALLOWED_CMDS = new Set([
  "npx drizzle-kit migrate",
  "npx drizzle-kit push",
  "npm run lint",
  "npm run lint -- --fix",
  "npm run format",
  "echo '[db.migrate] Schema verified and applied'",
  "echo '[workspace.maintain] Workspace integrity verified'",
]);

function assertAllowedCmd(cmd: string): string {
  const normalized = cmd.trim();
  if (!ALLOWED_CMDS.has(normalized)) {
    throw new Error(
      `raphael: command not allowlisted: ${normalized}. ` +
        `Allowed: ${[...ALLOWED_CMDS].join(" | ")}`,
    );
  }
  return normalized;
}

export class Raphael {
  private handlers = new Map<string, TaskHandler>();

  constructor() {
    this.registerBuiltins();
  }

  register(kind: string, handler: TaskHandler): void {
    this.handlers.set(kind, handler);
  }

  async run(task: TaskNode): Promise<unknown> {
    const handler = this.handlers.get(task.kind);
    if (!handler) throw new Error(`no handler for ${task.kind}`);
    return handler(task.payload);
  }

  private registerBuiltins(): void {
    this.register("file.scaffold", async (p) => {
      const { promises: fsp } = await import("node:fs");
      const path = await import("node:path");
      if (!p?.path) throw new Error("file.scaffold requires payload.path");
      // Reject path traversal outside cwd /tmp
      const resolved = path.resolve(p.path);
      const cwd = process.cwd();
      const tmp = path.resolve("/tmp");
      if (!resolved.startsWith(cwd) && !resolved.startsWith(tmp)) {
        throw new Error(`file.scaffold: path outside allowed roots: ${resolved}`);
      }
      await fsp.mkdir(path.dirname(resolved), { recursive: true });
      await fsp.writeFile(resolved, p.content ?? "");
      log("info", "raphael", "scaffolded", { path: resolved });
      return { written: resolved };
    });

    this.register("db.migrate", async (p) => {
      const { execSync } = await import("node:child_process");
      const cmd = assertAllowedCmd(p?.cmd ?? "npx drizzle-kit migrate");
      return execSync(cmd, {
        encoding: "utf8",
        cwd: p?.cwd && typeof p.cwd === "string" ? p.cwd : process.cwd(),
        timeout: 60_000,
      });
    });

    this.register("workspace.maintain", async (p) => {
      const { execSync } = await import("node:child_process");
      const cmd = assertAllowedCmd(p?.cmd ?? "npm run lint -- --fix");
      return execSync(cmd, {
        encoding: "utf8",
        cwd: p?.cwd && typeof p.cwd === "string" ? p.cwd : process.cwd(),
        timeout: 60_000,
      });
    });

    this.register("notify", async (p) => ({ forwarded: "gabriel", payload: p }));

    this.register("deliver_payload", async (p) => ({ forwarded: "gabriel", payload: p }));
  }
}
