// unit test buat validasi header PNG, ekstraksi warna tema bingkai, sama scanner direktori frame-packs
// bikin folder sementara di tmp OS dan file PNG asli pakai sharp biar tesnya mirip kondisi nyata
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";
import { scanFrameDirectory } from "@/app/api/frames/scan";
import {
  DEFAULT_THEME,
  deriveFrameTheme,
  nameFromPackId,
  packIdFromFolder,
  packFileUrl,
  PNG_HEADER_BYTES,
  readPngSize,
  templateArtworkSpecs,
} from "@/shared-tools/catalog/frame-pack";

// daftar folder sementara yang bakal otomatis dihapus habis tes selesai
const temporaryDirectories: string[] = [];

interface PackColor {
  r: number;
  g: number;
  b: number;
  alpha: number;
}

const WHITE: PackColor = { r: 255, g: 255, b: 255, alpha: 1 };
const GREEN: PackColor = { r: 0, g: 255, b: 0, alpha: 1 };
const DARK: PackColor = { r: 13, g: 6, b: 20, alpha: 1 };

// susun 24 byte header PNG valid dengan lebar dan tinggi yang diminta
function pngHeader(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(PNG_HEADER_BYTES);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buffer, 0);
  buffer.writeUInt32BE(13, 8);
  buffer.write("IHDR", 12, "ascii");
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
}

// tulis file PNG beneran pakai sharp dengan ukuran dan warna solid tertentu
async function writePng(
  file: string,
  width: number,
  height: number,
  color: PackColor,
) {
  await sharp({ create: { width, height, channels: 4, background: color } })
    .png()
    .toFile(file);
}

// buat folder root sementara di temp OS buat simulasi public/assets/frame-packs
async function makeRoot() {
  const root = await mkdtemp(path.join(tmpdir(), "photopip-frames-"));
  temporaryDirectories.push(root);
  return root;
}

interface PackOptions {
  artwork?: Partial<Record<string, [number, number]>>;
  omit?: string[];
  color?: PackColor;
}

// bikin satu folder paket bingkai lengkap 5 file PNG (bisa diatur buat sengaja hilang/salah ukuran)
async function writePack(root: string, id: string, options: PackOptions = {}) {
  const directory = path.join(root, id);
  await mkdir(directory, { recursive: true });
  const omit = new Set(options.omit ?? []);
  const color = options.color ?? WHITE;
  for (const spec of templateArtworkSpecs) {
    if (omit.has(spec.file)) continue;
    const [width, height] = options.artwork?.[spec.id] ?? [
      spec.width,
      spec.height,
    ];
    await writePng(path.join(directory, spec.file), width, height, color);
  }
}

// bersihin semua folder sementara tiap selesai satu kasus tes
afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("frame pack validation", () => {
  // cek pembacaan lebar-tinggi PNG dan penolakan header yang rusak
  it("reads PNG dimensions from the IHDR chunk", () => {
    expect(readPngSize(pngHeader(600, 1800))).toEqual({
      width: 600,
      height: 1800,
    });
    expect(readPngSize(Buffer.alloc(PNG_HEADER_BYTES))).toBeNull();
    const wrongType = pngHeader(600, 1800);
    wrongType.write("JHDR", 12, "ascii");
    expect(readPngSize(wrongType)).toBeNull();
    expect(readPngSize(pngHeader(0, 1800))).toBeNull();
  });

  // cek pembersihan nama folder jadi slug id yang aman
  it("turns any folder name into a url-safe id", () => {
    expect(packIdFromFolder("neon-nights")).toBe("neon-nights");
    expect(packIdFromFolder("GTA 6")).toBe("gta-6");
    expect(packIdFromFolder("  My Cool Frame!!! ")).toBe("my-cool-frame");
    expect(packIdFromFolder("frame_baru")).toBe("frame-baru");
    expect(packIdFromFolder("!!!")).toBeNull();
    expect(packIdFromFolder("   ")).toBeNull();
    expect(packIdFromFolder("a".repeat(61))).toBeNull();
  });

  it("humanizes folder ids", () => {
    expect(nameFromPackId("neon-nights")).toBe("Neon Nights");
    expect(nameFromPackId("plain")).toBe("Plain");
  });

  it("builds cache-busted URLs", () => {
    expect(
      packFileUrl("neon-nights", "4x1.png", { mtimeMs: 1000.6, size: 24 }),
    ).toBe("/assets/frame-packs/neon-nights/4x1.png?v=1001-24");
  });

  // cek daftar 5 nama file wajib dan ukuran piksel targetnya
  it("derives one artwork file per template from print geometry", () => {
    expect(templateArtworkSpecs.map((spec) => spec.file)).toEqual([
      "4x1.png",
      "3x1.png",
      "2x3.png",
      "2x2.png",
      "single.png",
    ]);
    expect(templateArtworkSpecs[0]).toMatchObject({
      width: 600,
      height: 1800,
    });
    expect(templateArtworkSpecs[2]).toMatchObject({
      width: 1200,
      height: 1800,
    });
  });
});

describe("frame theme derivation", () => {
  // cek pengambilan warna dominan dan kontras warna teks (putih di gelap, gelap di terang)
  it("uses the dominant opaque color as background", async () => {
    const root = await makeRoot();
    const file = path.join(root, "single.png");
    await writePng(file, 600, 1800, GREEN);

    await expect(deriveFrameTheme(file)).resolves.toEqual({
      backgroundColor: "#00ff00",
      textColor: "#20231f",
      fontId: "app",
    });
  });

  it("picks white text on a dark background", async () => {
    const root = await makeRoot();
    const file = path.join(root, "single.png");
    await writePng(file, 600, 1800, DARK);

    await expect(deriveFrameTheme(file)).resolves.toEqual({
      backgroundColor: "#0d0614",
      textColor: "#ffffff",
      fontId: "app",
    });
  });

  it("picks dark text on a light background", async () => {
    const root = await makeRoot();
    const file = path.join(root, "single.png");
    await writePng(file, 600, 1800, { r: 245, g: 240, b: 225, alpha: 1 });

    await expect(deriveFrameTheme(file)).resolves.toEqual({
      backgroundColor: "#f5f0e1",
      textColor: "#20231f",
      fontId: "app",
    });
  });

  // kalau gambar transparan penuh, balik ke warna tema default
  it("falls back to defaults when every pixel is transparent", async () => {
    const root = await makeRoot();
    const file = path.join(root, "single.png");
    await writePng(file, 600, 1800, { r: 0, g: 0, b: 0, alpha: 0 });

    await expect(deriveFrameTheme(file)).resolves.toEqual(DEFAULT_THEME);
  });
});

describe("frame directory scanner", () => {
  // cek paket bingkai lengkap lolos scan tanpa diagnostic error
  it("returns a valid pack with derived theme and cache-busted artwork", async () => {
    const root = await makeRoot();
    await writePack(root, "neon-nights");

    const result = await scanFrameDirectory(root);
    expect(result.diagnostics).toEqual([]);
    expect(result.frames).toHaveLength(1);
    const frame = result.frames[0];
    expect(frame).toMatchObject({
      id: "neon-nights",
      name: "Neon Nights",
      textColor: "#20231f",
      fontId: "app",
      backgroundColor: "#ffffff",
    });
    expect(Object.keys(frame.artwork).sort()).toEqual(
      templateArtworkSpecs.map((spec) => spec.id).sort(),
    );
    expect(frame.artwork["4x1"]).toMatch(
      /^\/assets\/frame-packs\/neon-nights\/4x1\.png\?v=\d+-\d+$/,
    );
    expect(frame.artwork["1x1"]).toMatch(
      /^\/assets\/frame-packs\/neon-nights\/single\.png\?v=\d+-\d+$/,
    );
  });

  it("derives the pack theme from its artwork", async () => {
    const root = await makeRoot();
    await writePack(root, "neon-nights", { color: GREEN });

    const result = await scanFrameDirectory(root);
    expect(result.frames[0]).toMatchObject({
      name: "Neon Nights",
      backgroundColor: "#00ff00",
      textColor: "#20231f",
      fontId: "app",
    });
    expect(result.diagnostics).toEqual([]);
  });

  // kalau single.png gak bisa dibaca warnanya oleh sharp, tetap diterima pakai warna default + warning
  it("falls back to defaults when artwork colors cannot be read", async () => {
    const root = await makeRoot();
    await writePack(root, "neon-nights");
    await writeFile(
      path.join(root, "neon-nights", "single.png"),
      Buffer.concat([pngHeader(1200, 1800), Buffer.alloc(32)]),
    );

    const result = await scanFrameDirectory(root);
    expect(result.frames[0]).toMatchObject(DEFAULT_THEME);
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          folder: "neon-nights",
          code: "theme-fallback",
          level: "warning",
        }),
      ]),
    );
  });

  // cek pengurutan paket dari timestamp paling baru di peta dates
  it("sorts packs using dates index map", async () => {
    const root = await makeRoot();
    await writePack(root, "alpha");
    await writePack(root, "beta");

    const result = await scanFrameDirectory(root, {
      alpha: 1000,
      beta: 2000,
    });
    expect(result.frames.map((frame) => frame.id)).toEqual(["beta", "alpha"]);
  });

  it("ignores underscore folders and missing roots", async () => {
    const root = await makeRoot();
    await writePack(root, "_starter");
    expect(await scanFrameDirectory(root)).toEqual({
      frames: [],
      diagnostics: [],
    });
    expect(await scanFrameDirectory(path.join(root, "does-not-exist"))).toEqual(
      { frames: [], diagnostics: [] },
    );
  });

  // cek penolakan folder yang kurang file PNG atau salah dimensi piksel
  it("rejects missing and incorrectly sized artwork", async () => {
    const root = await makeRoot();
    await writePack(root, "missing-art", { omit: ["4x1.png"] });
    await writePack(root, "wrong-size", {
      artwork: { "3x1": [600, 600] },
    });

    const result = await scanFrameDirectory(root);
    expect(result.frames).toEqual([]);
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          folder: "missing-art",
          code: "missing-artwork",
        }),
        expect.objectContaining({
          folder: "wrong-size",
          code: "bad-dimensions",
        }),
      ]),
    );
  });

  it("accepts a free-form folder name and keeps the url safe", async () => {
    const root = await makeRoot();
    await writePack(root, "Neon Nights");

    const result = await scanFrameDirectory(root);
    expect(result.diagnostics).toEqual([]);
    expect(result.frames[0]).toMatchObject({
      id: "neon-nights",
      name: "Neon Nights",
    });
    expect(result.frames[0].artwork["4x1"]).toMatch(
      /^\/assets\/frame-packs\/neon-nights\/4x1\.png\?v=\d+-\d+$/,
    );
  });

  it("rejects a folder name with nothing usable", async () => {
    const root = await makeRoot();
    await writePack(root, "!!!");

    const result = await scanFrameDirectory(root);
    expect(result.frames).toEqual([]);
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ folder: "!!!", code: "bad-folder-name" }),
      ]),
    );
  });

  // cek folder kedua yang slug id-nya tabrakan langsung ditolak pakai kode duplicate-pack-id
  it("rejects a second folder that maps to the same id", async () => {
    const root = await makeRoot();
    await writePack(root, "GTA 6");
    await writePack(root, "gta-6");

    const result = await scanFrameDirectory(root);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].id).toBe("gta-6");
    expect(result.diagnostics).toEqual([
      expect.objectContaining({ code: "duplicate-pack-id" }),
    ]);
  });
});
