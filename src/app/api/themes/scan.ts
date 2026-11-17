/**
 * PEMINDAI FOLDER PAKET BINGKAI
 * Memindai public/assets/theme-packs/: memvalidasi manifest theme.json,
 * mengecek dimensi artwork PNG per template, dan menyusun katalog tema siap pakai.
 */

import { open, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import type { TemplateId } from "@/shared-tools/catalog/templates";
import {
  createThemePackTheme,
  isValidPackId,
  LARGE_ARTWORK_BYTES,
  LARGE_PREVIEW_BYTES,
  MAX_MANIFEST_BYTES,
  MAX_PACK_ID_LENGTH,
  packFileUrl,
  parseThemeManifest,
  PNG_HEADER_BYTES,
  readPngSize,
  templateArtworkSpecs,
  validatePreviewSize,
  type PngSize,
  type ThemeManifest,
  type ThemePackDiagnostic,
  type ThemePackResponse,
  type ThemePackTheme,
} from "@/shared-tools/catalog/theme-pack";

interface FolderResult {
  theme: ThemePackTheme | null;
  diagnostics: ThemePackDiagnostic[];
}

async function statOrNull(file: string) {
  try {
    return await stat(file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function readPngHeader(file: string): Promise<PngSize | null> {
  const handle = await open(file, "r");
  try {
    const buffer = Buffer.alloc(PNG_HEADER_BYTES);
    const { bytesRead } = await handle.read(buffer, 0, PNG_HEADER_BYTES, 0);
    return readPngSize(buffer.subarray(0, bytesRead));
  } finally {
    await handle.close();
  }
}

function failure(
  folder: string,
  diagnostics: ThemePackDiagnostic[],
  code: string,
  message: string,
): FolderResult {
  diagnostics.push({ folder, level: "error", code, message });
  return { theme: null, diagnostics };
}

async function scanThemeFolder(
  directory: string,
  folder: string,
): Promise<FolderResult> {
  const diagnostics: ThemePackDiagnostic[] = [];

  if (!isValidPackId(folder)) {
    return failure(
      folder,
      diagnostics,
      "invalid-id",
      `Folder id must be lowercase letters, digits and single hyphens, at most ${MAX_PACK_ID_LENGTH} characters`,
    );
  }

  let manifest: ThemeManifest = {};
  const manifestStat = await statOrNull(path.join(directory, "theme.json"));
  if (manifestStat) {
    if (!manifestStat.isFile()) {
      return failure(
        folder,
        diagnostics,
        "manifest-not-file",
        "theme.json must be a file",
      );
    }
    if (manifestStat.size > MAX_MANIFEST_BYTES) {
      return failure(
        folder,
        diagnostics,
        "manifest-too-large",
        `theme.json must be at most ${MAX_MANIFEST_BYTES} bytes`,
      );
    }
    const parsed = parseThemeManifest(
      await readFile(path.join(directory, "theme.json"), "utf8"),
    );
    if (!parsed.ok) {
      return failure(folder, diagnostics, "bad-manifest", parsed.message);
    }
    manifest = parsed.manifest;
  }

  let preview: string | undefined;
  const previewStat = await statOrNull(path.join(directory, "preview.png"));
  if (previewStat) {
    if (!previewStat.isFile()) {
      return failure(
        folder,
        diagnostics,
        "preview-not-file",
        "preview.png must be a file",
      );
    }
    const previewSize = await readPngHeader(
      path.join(directory, "preview.png"),
    );
    if (!previewSize) {
      return failure(
        folder,
        diagnostics,
        "bad-png",
        "preview.png is not a valid PNG",
      );
    }
    const previewError = validatePreviewSize(previewSize);
    if (previewError) {
      return failure(folder, diagnostics, "bad-preview-size", previewError);
    }
    if (previewSize.width !== previewSize.height) {
      diagnostics.push({
        folder,
        level: "warning",
        code: "non-square-preview",
        message: "preview.png is not square; the cover will be cropped",
      });
    }
    if (previewStat.size > LARGE_PREVIEW_BYTES) {
      diagnostics.push({
        folder,
        level: "warning",
        code: "large-preview",
        message: `preview.png is larger than ${LARGE_PREVIEW_BYTES} bytes`,
      });
    }
    preview = packFileUrl(folder, "preview.png", previewStat);
  }

  const artworkEntries: Array<[TemplateId, string]> = [];
  for (const spec of templateArtworkSpecs) {
    const file = path.join(directory, spec.file);
    const fileStat = await statOrNull(file);
    if (!fileStat?.isFile()) {
      return failure(
        folder,
        diagnostics,
        "missing-file",
        `${spec.file} is missing`,
      );
    }
    const size = await readPngHeader(file);
    if (!size) {
      return failure(
        folder,
        diagnostics,
        "bad-png",
        `${spec.file} is not a valid PNG`,
      );
    }
    if (size.width !== spec.width || size.height !== spec.height) {
      return failure(
        folder,
        diagnostics,
        "wrong-size",
        `${spec.file} must be ${spec.width}x${spec.height}, got ${size.width}x${size.height}`,
      );
    }
    if (fileStat.size > LARGE_ARTWORK_BYTES) {
      diagnostics.push({
        folder,
        level: "warning",
        code: "large-artwork",
        message: `${spec.file} is larger than ${LARGE_ARTWORK_BYTES} bytes`,
      });
    }
    artworkEntries.push([spec.id, packFileUrl(folder, spec.file, fileStat)]);
  }

  return {
    theme: createThemePackTheme({
      id: folder,
      manifest,
      preview,
      artwork: Object.fromEntries(artworkEntries) as Record<TemplateId, string>,
    }),
    diagnostics,
  };
}

/**
 * Scans a themes directory and returns valid packs plus developer-facing
 * diagnostics. Invalid packs are omitted instead of surfacing broken cards.
 */
export async function scanThemeDirectory(
  root: string,
): Promise<ThemePackResponse> {
  const themes: ThemePackTheme[] = [];
  const diagnostics: ThemePackDiagnostic[] = [];

  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { themes, diagnostics };
    }
    diagnostics.push({
      folder: "<root>",
      level: "error",
      code: "unreadable",
      message: "Could not read the themes directory",
    });
    return { themes, diagnostics };
  }

  const folders = entries
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith("_") &&
        !entry.name.startsWith("."),
    )
    .map((entry) => entry.name)
    .sort();

  for (const folder of folders) {
    try {
      const result = await scanThemeFolder(path.join(root, folder), folder);
      diagnostics.push(...result.diagnostics);
      if (result.theme) themes.push(result.theme);
    } catch (error) {
      console.warn(`[themes] could not read ${folder}`, error);
      diagnostics.push({
        folder,
        level: "error",
        code: "unreadable",
        message: "Could not read the theme folder",
      });
    }
  }

  return { themes, diagnostics };
}
