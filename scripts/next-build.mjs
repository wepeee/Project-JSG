import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const env = { ...process.env };
const originalHome = env.USERPROFILE || env.HOME || os.homedir();
const buildHome = path.join(process.cwd(), ".build-home");
const buildAppData = path.join(buildHome, "AppData", "Roaming");
const buildLocalAppData = path.join(buildHome, "AppData", "Local");

fs.mkdirSync(buildAppData, { recursive: true });
fs.mkdirSync(buildLocalAppData, { recursive: true });

env.USERPROFILE = buildHome;
env.HOME = buildHome;
env.APPDATA = buildAppData;
env.LOCALAPPDATA = buildLocalAppData;
env.HOMEDRIVE = path.parse(buildHome).root.replace(/[\\/]/g, "");
env.HOMEPATH = buildHome.slice(env.HOMEDRIVE.length) || "\\";

const spawnEnv = {};
for (const [key, value] of Object.entries(env)) {
  // Windows process env may contain pseudo keys like "=C:"; skip invalid names.
  if (!key || key.startsWith("=") || key.includes("=")) continue;
  if (value == null) continue;
  spawnEnv[key] = String(value);
}

if (process.env.DEBUG_NEXT_BUILD_ENV === "1") {
  console.log("[next-build] original home:", originalHome);
  console.log("[next-build] HOME:", spawnEnv.HOME);
  console.log("[next-build] USERPROFILE:", spawnEnv.USERPROFILE);
  console.log("[next-build] APPDATA:", spawnEnv.APPDATA);
  console.log("[next-build] LOCALAPPDATA:", spawnEnv.LOCALAPPDATA);
}

const nextBin = require.resolve("next/dist/bin/next");
const child = spawn(process.execPath, [nextBin, "build"], {
  stdio: "inherit",
  env: spawnEnv,
  cwd: process.cwd(),
});

child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
