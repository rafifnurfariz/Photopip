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
