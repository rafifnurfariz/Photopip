// scanner folder font di sisi server buat deteksi file .ttf otomatis
// dipakai oleh route /api/fonts supaya user cukup taruh file font tanpa edit kode
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import type { TextFont } from "@/shared-tools/catalog/fonts";

// bentuk data balikan dari hasil scan font
export interface FontScanResponse {
  fonts: TextFont[];
}

// rapihin nama file jadi judul font, misal roboto-black.ttf jadi Roboto Black
function formatFontName(fileName: string): string {
  const baseName = path.parse(fileName).name;
  return baseName
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// ubah teks jadi id slug huruf kecil yang aman buat URL dan nama font family
function sanitizeId(str: string): string {
  return (
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "font"
  );
}

// tambahin angka di belakang kalau id font-nya kebetulan ada yang kembar
function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  let suffix = 2;
  while (used.has(id)) id = `${base}-${suffix++}`;
  used.add(id);
  return id;
}

// baca isi folder font lalu kumpulin semua file .ttf jadi daftar TextFont
export async function scanFontsDirectory(
  root: string,
): Promise<FontScanResponse> {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    // kalau foldernya belum ada, balikin list kosong aja
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { fonts: [] };
    }
    throw error;
  }

  const fonts: TextFont[] = [];
  const usedIds = new Set<string>();

  for (const entry of entries) {
    // abaikan file tersembunyi, folder, atau yang diawali underscore
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    if (!entry.isFile()) continue;

    // cuma terima file font berekstensi .ttf
    const ext = path.extname(entry.name).toLowerCase();
    if (ext !== ".ttf") continue;

    // ambil metadata file buat bikin query versi biar cache browser ke-refresh pas file diubah
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

  // urutin daftar font sesuai abjad nama
  fonts.sort((a, b) => a.name.localeCompare(b.name));
  return { fonts };
}
