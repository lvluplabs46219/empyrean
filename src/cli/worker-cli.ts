// Raphael worker CLI: register / heartbeat against the Michael daemon over UDS.
import { call, sockPath } from "../transport/uds.js";
import { envelope, AgentName } from "../protocol/types.js";

async function main() {
  const workerName = process.argv[2] ?? "raphael-1";
  const action = process.argv[3] ?? "register";

  if (action === "heartbeat" || action === "register") {
    const res = await call(
      envelope("query", "raphael" as AgentName, "michael", {
        action,
        worker: workerName,
        pid: process.pid,
        hostname: process.env.HOSTNAME ?? "local",
        ts: new Date().toISOString(),
      }),
      15_000,
    );
    console.log(JSON.stringify({ ok: true, sock: sockPath(), response: res }, null, 2));
    return;
  }

  if (action === "status") {
    const res = await call(
      envelope("query", "raphael" as AgentName, "michael", { action: "status" }),
      10_000,
    );
    console.log(JSON.stringify(res, null, 2));
    return;
  }

  console.error(`usage: npm run worker -- [name] [register|heartbeat|status]`);
  process.exit(1);
}

main().catch((e) => {
  console.error(JSON.stringify({ error: String(e), sock: sockPath() }));
  process.exit(1);
});
