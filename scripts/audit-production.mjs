// Runs the production dependency audit.
//
// npm 11 rejects a user-level `allow-scripts` setting during project-scoped
// commands (EALLOWSCRIPTS). Audit installs nothing, so the setting is cleared
// through the environment for this invocation only.
import { spawnSync } from "node:child_process";

const result = spawnSync("npm audit --omit=dev", {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, npm_config_allow_scripts: "" },
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
