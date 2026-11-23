// scanner server buat baca folder stiker di public/assets/stickers
// tiap subfolder otomatis jadi kategori stiker dan file gambarnya jadi item stiker
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import type { Sticker } from "@/shared-tools/catalog/stickers";

// ekstensi gambar yang dibolehin masuk katalog stiker
const VALID_IMAGE_EXTENSIONS = new Set([".png", ".webp", ".jpg", ".jpeg"]);

// tipe balikan data hasil scan stiker
export interface StickerScanResponse {
  stickers: Sticker[];
  categories: string[];
}

// ubah nama file kayak nyan_cat.png jadi Nyan Cat biar enak dibaca user
function formatStickerName(fileName: string): string {
  const baseName = path.parse(fileName).name;
  return baseName
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// bikin slug huruf kecil buat id stiker yang aman
function sanitizeId(str: string): string {
  return (
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "sticker"
  );
}

// kasih nomor urut di belakang kalau ada id stiker yang sama
function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  let suffix = 2;
  while (used.has(id)) id = `${base}-${suffix++}`;
  used.add(id);
  return id;
}

// telusuri folder stiker dan subfolder kategorinya lalu kumpulin jadi array Sticker
export async function scanStickersDirectory(
  root: string,
): Promise<StickerScanResponse> {
  const stickers: Sticker[] = [];
  const categoriesSet = new Set<string>();
  const usedIds = new Set<string>();

  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    // kalau folder stiker gak ada, balikin kosong aja
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { stickers: [], categories: [] };
    }
    throw error;
  }

  for (const entry of entries) {
    // skip file/folder tersembunyi atau yang diawali underscore
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;

    // kalau ketemu subfolder, anggap nama foldernya sebagai kategori stiker
    if (entry.isDirectory()) {
      const category = entry.name;
      categoriesSet.add(category);
      const categoryDir = path.join(root, category);

      let files;
      try {
        files = await readdir(categoryDir, { withFileTypes: true });
      } catch {
        continue;
      }

      for (const file of files) {
        if (!file.isFile()) continue;
        const ext = path.extname(file.name).toLowerCase();
        if (!VALID_IMAGE_EXTENSIONS.has(ext)) continue;

        const filePath = path.join(categoryDir, file.name);
        let fileStat;
        try {
          fileStat = await stat(filePath);
        } catch {
          continue;
        }

        // pecah nama file buat dijadiin tag pencarian stiker
        const baseName = path.parse(file.name).name;
        const name = formatStickerName(file.name);
        const id = uniqueId(sanitizeId(`${category}-${baseName}`), usedIds);
        const words = baseName.toLowerCase().split(/[-_]+/).filter(Boolean);

        // tambahin query versi dari mtime sama ukuran biar browser gak pakai gambar lama
        const version = `${Math.round(fileStat.mtimeMs)}-${fileStat.size}`;
        const src = `/assets/stickers/${encodeURIComponent(category)}/${encodeURIComponent(file.name)}?v=${version}`;

        stickers.push({
          id,
          name,
          category,
          src,
          tags: Array.from(new Set([category, ...words])),
        });
      }
    } else if (entry.isFile()) {
      // gambar yang langsung ditaruh di root stickers masuk ke kategori "all"
      const ext = path.extname(entry.name).toLowerCase();
      if (!VALID_IMAGE_EXTENSIONS.has(ext)) continue;

      const filePath = path.join(root, entry.name);
      let fileStat;
      try {
        fileStat = await stat(filePath);
      } catch {
        continue;
      }

      const baseName = path.parse(entry.name).name;
      const name = formatStickerName(entry.name);
      const id = uniqueId(sanitizeId(baseName), usedIds);
      const words = baseName.toLowerCase().split(/[-_]+/).filter(Boolean);

      const version = `${Math.round(fileStat.mtimeMs)}-${fileStat.size}`;
      const src = `/assets/stickers/${encodeURIComponent(entry.name)}?v=${version}`;

      stickers.push({
        id,
        name,
        category: "all",
        src,
        tags: words,
      });
    }
  }

  // urutkan stiker dan kategori sesuai abjad
  stickers.sort((a, b) => a.name.localeCompare(b.name));

  return {
    stickers,
    categories: Array.from(categoriesSet).sort(),
  };
}
