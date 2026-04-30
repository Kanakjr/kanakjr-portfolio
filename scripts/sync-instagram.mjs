/**
 * Build-time Instagram sync wrapper.
 *
 * Shells out to `python3 scripts/sync-instagram.py` so the build pipeline can
 * stay `npm run build`-driven. Designed to be non-fatal: if Python or
 * instaloader isn't available, or Instagram blocks the request, the build
 * continues with whatever JSON is already on disk (the stub if nothing else).
 *
 * Run:
 *   node scripts/sync-instagram.mjs
 *   STRICT=1 node scripts/sync-instagram.mjs   # exit 1 on sync failure
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const SCRIPT_PATH = resolve(process.cwd(), "scripts", "sync-instagram.py");
const STRICT = process.env.STRICT === "1";

/**
 * Light .env.local loader so this wrapper picks up INSTAGRAM_* vars without
 * requiring `dotenv` (mirrors the inline loader in scripts/generate-captions.ts).
 * Existing process.env values win.
 */
function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvLocal();

if (!existsSync(SCRIPT_PATH)) {
  console.warn(`[instagram] sync script missing at ${SCRIPT_PATH}; skipping.`);
  process.exit(0);
}

const candidates = ["python3", "python"];
let interpreter = null;
for (const c of candidates) {
  const probe = spawnSync(c, ["--version"], { stdio: "ignore" });
  if (probe.status === 0) {
    interpreter = c;
    break;
  }
}

if (!interpreter) {
  console.warn(
    "[instagram] no Python interpreter found (tried python3, python); skipping sync.\n" +
      "           Install Python and `pip install instaloader` to enable IG sync."
  );
  process.exit(0);
}

console.log(`[instagram] running ${interpreter} ${SCRIPT_PATH}`);
const res = spawnSync(interpreter, [SCRIPT_PATH], {
  stdio: "inherit",
  env: process.env,
});

if (res.error) {
  console.warn(`[instagram] sync invocation failed: ${res.error.message}`);
  process.exit(STRICT ? 1 : 0);
}

if (res.status !== 0) {
  console.warn(
    `[instagram] sync exited with code ${res.status}; continuing with existing data/instagram.json.`
  );
  process.exit(STRICT ? res.status ?? 1 : 0);
}

console.log("[instagram] sync complete.");
