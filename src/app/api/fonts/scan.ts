import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import type { TextFont } from "@/shared-tools/catalog/fonts";

export interface FontScanResponse {
  fonts: TextFont[];
}

function formatFontName(fileName: string): string {
  const baseName = path.parse(fileName).name;
  return baseName
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function sanitizeId(str: string): string {
  return (
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "font"
  );
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  let suffix = 2;
  while (used.has(id)) id = `${base}-${suffix++}`;
  used.add(id);
  return id;
}

export async function scanFontsDirectory(
  root: string,
): Promise<FontScanResponse> {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { fonts: [] };
    }
    throw error;
  }

  const fonts: TextFont[] = [];
  const usedIds = new Set<string>();

  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (ext !== ".ttf") continue;

    const filePath = path.join(root, entry.name);
    let fileStat;
    try {
      fileStat = await stat(filePath);
    } catch {
      continue;
    }

    const name = formatFontName(entry.name);
    const id = uniqueId(sanitizeId(name), usedIds);
    const version = `${Math.round(fileStat.mtimeMs)}-${fileStat.size}`;
    const src = `/assets/fonts/${encodeURIComponent(entry.name)}?v=${version}`;
    const family = `UserFont_${id}`;

    fonts.push({
      id,
      name,
      src,
      family,
    });
  }

  fonts.sort((a, b) => a.name.localeCompare(b.name));
  return { fonts };
}
