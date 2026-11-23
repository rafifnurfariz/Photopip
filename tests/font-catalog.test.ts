// unit test buat scanner folder font di /api/fonts/scan.ts
// nguji baca file .ttf, abaikan file non-ttf/tersembunyi, dan bikin id unik kalau nama kembar
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { scanFontsDirectory } from "@/app/api/fonts/scan";

// folder sementara khusus buat simulasi file font pas tes jalan
const root = path.join(process.cwd(), "tests", "fixtures", "fonts-scan");

describe("scanFontsDirectory", () => {
  // siapin folder kosong baru sebelum tiap kasus tes
  beforeEach(async () => {
    await rm(root, { recursive: true, force: true });
    await mkdir(root, { recursive: true });
  });

  // hapus folder sementara setelah tes kelar biar repo tetap bersih
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it("returns empty list if directory is empty", async () => {
    const result = await scanFontsDirectory(root);
    expect(result.fonts).toEqual([]);
  });

  // cek cuma file .ttf biasa yang diambil, sedangkan .txt, _hidden, dan .dotfile dilewati
  it("scans .ttf files and ignores non-ttf or hidden files", async () => {
    await writeFile(path.join(root, "Bebas_Neue.ttf"), "fake-ttf-content");
    await writeFile(path.join(root, "lobster.ttf"), "fake-ttf-content-2");
    await writeFile(path.join(root, "notes.txt"), "some notes");
    await writeFile(path.join(root, "_hidden.ttf"), "ignored");
    await writeFile(path.join(root, ".dotfile.ttf"), "ignored");

    const result = await scanFontsDirectory(root);
    expect(result.fonts).toHaveLength(2);

    expect(result.fonts[0].name).toBe("Bebas Neue");
    expect(result.fonts[0].id).toBe("bebas-neue");
    expect(result.fonts[0].family).toBe("UserFont_bebas-neue");
    expect(result.fonts[0].src).toContain("/assets/fonts/Bebas_Neue.ttf?v=");

    expect(result.fonts[1].name).toBe("Lobster");
    expect(result.fonts[1].id).toBe("lobster");
  });

  // cek dua file berbeda yang slug-nya jadi sama dikasih akhiran angka -2
  it("handles duplicate sanitized names by adding a suffix", async () => {
    await writeFile(path.join(root, "Cool-Font.ttf"), "1");
    await writeFile(path.join(root, "cool_font.ttf"), "2");

    const result = await scanFontsDirectory(root);
    expect(result.fonts).toHaveLength(2);
    const ids = result.fonts.map((f) => f.id);
    expect(ids).toContain("cool-font");
    expect(ids).toContain("cool-font-2");
  });
});
