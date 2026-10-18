// Empyrean multi-agent workspace UI
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function renderDashboard(): string {
  return readFileSync(join(__dirname, "dashboard.html"), "utf8");
}
