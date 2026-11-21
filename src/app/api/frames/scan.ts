/**
 * PEMINDAI FOLDER PAKET BINGKAI
 * Memindai public/assets/frame-packs/: memvalidasi manifest frame.json,
 * mengecek dimensi artwork PNG per template, dan menyusun katalog bingkai siap pakai.
 */

import { open, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import type { TemplateId } from "@/shared-tools/catalog/templates";
import {
  createFramePackFrame,
  isValidPackId,
  LARGE_ARTWORK_BYTES,
  MAX_MANIFEST_BYTES,
  MAX_PACK_ID_LENGTH,
  packFileUrl,
  parseFrameManifest,
  PNG_HEADER_BYTES,
  readPngSize,
  templateArtworkSpecs,
  type FrameManifest,
  type FramePackDiagnostic,
  type FramePackResponse,
  type FramePackFrame,
} from "@/shared-tools/catalog/frame-pack";

interface FolderResult {
  frame: FramePackFrame | null;
  diagnostics: FramePackDiagnostic[];
}

async function statOrNull(file: string) {
  try {
    return await stat(file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function readHeader(file: string, bytes: number): Promise<Uint8Array> {
  const handle = await open(file, "r");
  try {
    const buffer = new Uint8Array(bytes);
    const { bytesRead } = await handle.read(buffer, 0, bytes, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

function failure(
  folder: string,
  diagnostics: FramePackDiagnostic[],
  code: string,
  message: string,
): FolderResult {
  diagnostics.push({ folder, level: "error", code, message });
  return { frame: null, diagnostics };
}

async function scanFrameFolder(
  root: string,
  folder: string,
): Promise<FolderResult> {
  const diagnostics: FramePackDiagnostic[] = [];
  const directory = path.join(root, folder);

  if (!isValidPackId(folder)) {
    return failure(
      folder,
      diagnostics,
      "bad-folder-name",
      `folder name must be kebab-case and at most ${MAX_PACK_ID_LENGTH} characters`,
    );
  }

  let manifest: FrameManifest = {};
  const manifestStat = await statOrNull(path.join(directory, "frame.json"));
  if (manifestStat) {
    if (!manifestStat.isFile()) {
      return failure(
        folder,
        diagnostics,
        "bad-manifest",
        "frame.json must be a file",
      );
    }
    if (manifestStat.size > MAX_MANIFEST_BYTES) {
      return failure(
        folder,
        diagnostics,
        "bad-manifest",
        `frame.json must be at most ${MAX_MANIFEST_BYTES} bytes`,
      );
    }
    const parsed = parseFrameManifest(
      await readFile(path.join(directory, "frame.json"), "utf8"),
    );
    if (!parsed.ok) {
      return failure(folder, diagnostics, "bad-manifest", parsed.message);
    }
    manifest = parsed.manifest;
  }

  const artworkEntries: Array<[TemplateId, string]> = [];
  for (const spec of templateArtworkSpecs) {
    const file = path.join(directory, spec.file);
    const fileStat = await statOrNull(file);
    if (!fileStat) {
      return failure(
        folder,
        diagnostics,
        "missing-artwork",
        `missing ${spec.file}`,
      );
    }
    if (!fileStat.isFile()) {
      return failure(
        folder,
        diagnostics,
        "bad-png",
        `${spec.file} must be a file`,
      );
    }
    const size = readPngSize(await readHeader(file, PNG_HEADER_BYTES));
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
        "bad-dimensions",
        `${spec.file} is ${size.width}x${size.height}, expected ${spec.width}x${spec.height}`,
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

  const artwork = Object.fromEntries(artworkEntries) as Record<
    TemplateId,
    string
  >;

  return {
    frame: createFramePackFrame({
      id: folder,
      manifest,
      artwork,
    }),
    diagnostics,
  };
}

/**
 * Scans a frames directory and returns valid packs sorted alphabetically,
 * plus diagnostic messages for any broken or non-conforming folders.
 */
export async function scanFrameDirectory(
  root: string,
): Promise<FramePackResponse> {
  const entries = await readdir(root, { withFileTypes: true }).catch(
    () => [] as import("node:fs").Dirent[],
  );

  const folders = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort((first, second) => first.localeCompare(second));

  const results = await Promise.all(
    folders.map((folder) => scanFrameFolder(root, folder)),
  );

  const frames: FramePackFrame[] = [];
  const diagnostics: FramePackDiagnostic[] = [];

  for (const result of results) {
    if (result.frame) frames.push(result.frame);
    diagnostics.push(...result.diagnostics);
  }

  return { frames, diagnostics };
}
