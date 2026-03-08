/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const config = {
  // Keep build tracing inside this project so globbing won't walk user profile junctions on Windows.
  outputFileTracingRoot: __dirname,
  // Keep lint as a separate step (`pnpm lint`) to avoid build failures caused by environment-specific FS scans.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
