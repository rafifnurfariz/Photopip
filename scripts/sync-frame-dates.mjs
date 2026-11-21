import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public", "assets", "frame-packs");
const targetFile = path.join(
  process.cwd(),
  "src",
  "shared-tools",
  "catalog",
  "frame-dates.json",
);

let existing = {};
try {
  existing = JSON.parse(readFileSync(targetFile, "utf8"));
} catch {
  existing = {};
}

let folders = [];
try {
  folders = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort();
} catch {
  folders = [];
}

const updated = {};

for (const folder of folders) {
  const dirPath = `public/assets/frame-packs/${folder}`;
  let time = null;

  try {
    const out = execFileSync(
      "git",
      ["log", "--diff-filter=A", "--format=%ct", "-n", "1", "--", dirPath],
      { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] },
    ).trim();
    if (out) {
      const parsed = parseInt(out, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        time = parsed * 1000;
      }
    }
  } catch {
    // Git might not be available in environment
  }

  if (!time) {
    try {
      const out = execFileSync(
        "git",
        ["log", "--format=%ct", "-n", "1", "--reverse", "--", dirPath],
        { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] },
      ).trim();
      if (out) {
        const parsed = parseInt(out, 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
          time = parsed * 1000;
        }
      }
    } catch {
      // Ignore git log fallback error
    }
  }

  if (!time && existing[folder] && typeof existing[folder] === "number") {
    time = existing[folder];
  }

  if (!time) {
    try {
      const s = statSync(path.join(root, folder));
      time = Math.round(s.birthtimeMs || s.mtimeMs || Date.now());
    } catch {
      time = Date.now();
    }
  }

  updated[folder] = time;
}

const outputJson = JSON.stringify(updated, null, 2) + "\n";
const currentJson = JSON.stringify(existing, null, 2) + "\n";

if (outputJson !== currentJson) {
  writeFileSync(targetFile, outputJson, "utf8");
  console.log(`[sync-frame-dates] Updated ${targetFile}`);
}
