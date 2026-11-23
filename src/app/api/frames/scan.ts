// scanner server buat ngecek dan memuat paket bingkai (frame-pack) dari disk
// tiap folder dicek kelengkapan 5 file PNG, ukuran pikselnya, lalu diekstrak warna temanya
import { open, readdir, stat } from "node:fs/promises";
import path from "node:path";
import defaultFrameDates from "@/shared-tools/catalog/frame-dates.json";
import type { TemplateId } from "@/shared-tools/catalog/templates";
import {
  createFramePackFrame,
  DEFAULT_THEME,
  deriveFrameTheme,
  LARGE_ARTWORK_BYTES,
  packFileUrl,
  packIdFromFolder,
  PNG_HEADER_BYTES,
  readPngSize,
  templateArtworkSpecs,
  type FramePackDiagnostic,
  type FramePackResponse,
  type FramePackFrame,
  type FrameTheme,
} from "@/shared-tools/catalog/frame-pack";

// hasil scan buat satu folder bingkai
interface FolderResult {
  folder: string;
  frame: FramePackFrame | null;
  diagnostics: FramePackDiagnostic[];
  addedAt: number;
}

// cek info file/folder, balikin null kalau memang gak ketemu (ENOENT)
async function statOrNull(file: string) {
  try {
    return await stat(file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

// baca beberapa byte awal file aja biar ngecek dimensi PNG lebih cepat
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

// helper buat nyatet error folder yang gak valid lalu balikin frame null
function failure(
  folder: string,
  diagnostics: FramePackDiagnostic[],
  code: string,
  message: string,
): FolderResult {
  diagnostics.push({ folder, level: "error", code, message });
  return { folder, frame: null, diagnostics, addedAt: 0 };
}

// validasi satu folder paket bingkai dan susun data FramePackFrame-nya
async function scanFrameFolder(
  root: string,
  folder: string,
  dates: Record<string, number>,
): Promise<FolderResult> {
  const diagnostics: FramePackDiagnostic[] = [];
  const directory = path.join(root, folder);
  const id = packIdFromFolder(folder);

  // tolak folder kalau namanya gak punya huruf atau angka sama sekali
  if (!id) {
    return failure(
      folder,
      diagnostics,
      "bad-folder-name",
      "folder name has no usable letters or numbers",
    );
  }

  // ambil waktu pembuatan folder buat cadangan urutan tanggal
  const dirStat = await statOrNull(directory);
  const fsTime = dirStat ? dirStat.birthtimeMs || dirStat.mtimeMs : 0;

  // cek semua 5 file PNG template (4x1, 3x1, 2x3, 2x2, single)
  const artworkEntries: Array<[TemplateId, string]> = [];
  for (const spec of templateArtworkSpecs) {
    const file = path.join(directory, spec.file);
    const fileStat = await statOrNull(file);
    // pastikan file PNG ada dan bukan folder
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
    // baca header PNG buat ngecek valid atau nggak sekalian ambil lebar-tingginya
    const size = readPngSize(await readHeader(file, PNG_HEADER_BYTES));
    if (!size) {
      return failure(
        folder,
        diagnostics,
        "bad-png",
        `${spec.file} is not a valid PNG`,
      );
    }
    // dimensi PNG harus pas sama ukuran template biar pas dipasang ke foto
    if (size.width !== spec.width || size.height !== spec.height) {
      return failure(
        folder,
        diagnostics,
        "bad-dimensions",
        `${spec.file} is ${size.width}x${size.height}, expected ${spec.width}x${spec.height}`,
      );
    }
    // kasih warning kalau ukuran file terlalu gede biar load website gak lemot
    if (fileStat.size > LARGE_ARTWORK_BYTES) {
      diagnostics.push({
        folder,
        level: "warning",
        code: "large-artwork",
        message: `${spec.file} is larger than ${LARGE_ARTWORK_BYTES} bytes`,
      });
    }
    artworkEntries.push([spec.id, packFileUrl(id, spec.file, fileStat)]);
  }

  const artwork = Object.fromEntries(artworkEntries) as Record<
    TemplateId,
    string
  >;

  // ambil warna dominan dari single.png buat tema background dan teks bingkai
  const themeSpec =
    templateArtworkSpecs.find((spec) => spec.file === "single.png") ??
    templateArtworkSpecs[0];
  let theme: FrameTheme = DEFAULT_THEME;
  try {
    theme = await deriveFrameTheme(path.join(directory, themeSpec.file));
  } catch {
    // kalau gagal baca warna gambar, pakai tema warna default aja
    diagnostics.push({
      folder,
      level: "warning",
      code: "theme-fallback",
      message: "could not read artwork colors, using defaults",
    });
  }

  // prioritasin tanggal dari frame-dates.json biar konsisten lintas device
  const addedAt = dates[id] ?? fsTime;

  return {
    folder,
    frame: createFramePackFrame({
      id,
      theme,
      artwork,
    }),
    diagnostics,
    addedAt,
  };
}

// scan seluruh direktori frame-packs, buang yang duplikat/error, lalu urutkan dari terbaru
export async function scanFrameDirectory(
  root: string,
  dates: Record<string, number> = defaultFrameDates,
): Promise<FramePackResponse> {
  const entries = await readdir(root, { withFileTypes: true }).catch(
    () => [] as import("node:fs").Dirent[],
  );

  // ambil subfolder aja dan skip yang depannya underscore kayak _starter
  const folders = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  // scan semua folder secara paralel biar cepat
  const results = await Promise.all(
    folders.map((folder) => scanFrameFolder(root, folder, dates)),
  );

  // deteksi kalau ada dua folder berbeda yang id-nya jadi sama
  const seenIds = new Set<string>();
  for (const result of results) {
    const id = result.frame?.id;
    if (!id) continue;
    if (seenIds.has(id)) {
      result.diagnostics.push({
        folder: result.folder,
        level: "error",
        code: "duplicate-pack-id",
        message: `folder name maps to "${id}", which another pack already uses`,
      });
      result.frame = null;
      continue;
    }
    seenIds.add(id);
  }

  // ambil cuma paket yang lolos validasi lalu urutkan dari yang paling baru ditambahin
  const validResults = results
    .filter(
      (result): result is FolderResult & { frame: FramePackFrame } =>
        result.frame !== null,
    )
    .sort((a, b) => {
      if (b.addedAt !== a.addedAt) {
        return b.addedAt - a.addedAt;
      }
      return a.folder.localeCompare(b.folder);
    });

  const frames = validResults.map((result) => result.frame);
  const diagnostics: FramePackDiagnostic[] = [];

  // gabungin semua log error dan warning dari tiap folder
  for (const result of results) {
    diagnostics.push(...result.diagnostics);
  }

  return { frames, diagnostics };
}
