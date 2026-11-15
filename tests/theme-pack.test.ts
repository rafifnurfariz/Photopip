import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { scanThemeDirectory } from "@/app/api/themes/scan";
import {
  isHexColor,
  isValidPackId,
  nameFromPackId,
  packFileUrl,
  parseThemeManifest,
  PNG_HEADER_BYTES,
  readPngSize,
  templateArtworkSpecs,
  validatePreviewSize,
} from "@/shared-tools/catalog/theme-pack";

const temporaryDirectories: string[] = [];

function pngHeader(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(PNG_HEADER_BYTES);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buffer, 0);
  buffer.writeUInt32BE(13, 8);
  buffer.write("IHDR", 12, "ascii");
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
}

async function makeRoot() {
  const root = await mkdtemp(path.join(tmpdir(), "photopip-themes-"));
  temporaryDirectories.push(root);
  return root;
}

interface PackOptions {
  manifest?: string;
  preview?: [number, number];
  artwork?: Partial<Record<string, [number, number]>>;
  omit?: string[];
}

async function writePack(root: string, id: string, options: PackOptions = {}) {
  const directory = path.join(root, id);
  await mkdir(directory, { recursive: true });
  const omit = new Set(options.omit ?? []);
  if (options.manifest !== undefined) {
    await writeFile(path.join(directory, "theme.json"), options.manifest);
  }
  if (!omit.has("preview.png")) {
    const [width, height] = options.preview ?? [240, 240];
    await writeFile(
      path.join(directory, "preview.png"),
      pngHeader(width, height),
    );
  }
  for (const spec of templateArtworkSpecs) {
    if (omit.has(spec.file)) continue;
    const [width, height] = options.artwork?.[spec.id] ?? [
      spec.width,
      spec.height,
    ];
    await writeFile(path.join(directory, spec.file), pngHeader(width, height));
  }
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("theme pack validation", () => {
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

  it("accepts lowercase hyphenated folder ids only", () => {
    expect(isValidPackId("neon-nights")).toBe(true);
    expect(isValidPackId("theme2")).toBe(true);
    for (const value of ["Neon", "-neon", "neon--nights", "neon_nights", ""]) {
      expect(isValidPackId(value)).toBe(false);
    }
    expect(isValidPackId("a".repeat(41))).toBe(false);
  });

  it("humanizes folder ids and validates colors", () => {
    expect(nameFromPackId("neon-nights")).toBe("Neon Nights");
    expect(nameFromPackId("plain")).toBe("Plain");
    expect(isHexColor("#0b1020")).toBe(true);
    expect(isHexColor("#fff")).toBe(false);
    expect(isHexColor("blue")).toBe(false);
  });

  it("parses optional manifest fields and rejects bad values", () => {
    expect(
      parseThemeManifest(
        JSON.stringify({
          name: "  Neon Nights  ",
          textColor: "#F8FAFC",
          fontId: "display",
          backgroundColor: "#0b1020",
          ignored: true,
        }),
      ),
    ).toEqual({
      ok: true,
      manifest: {
        name: "Neon Nights",
        textColor: "#F8FAFC",
        fontId: "display",
        backgroundColor: "#0b1020",
      },
    });
    expect(parseThemeManifest("{}")).toEqual({ ok: true, manifest: {} });
    expect(parseThemeManifest("{").ok).toBe(false);
    expect(parseThemeManifest("[]").ok).toBe(false);
    expect(parseThemeManifest(JSON.stringify({ name: "" })).ok).toBe(false);
    expect(parseThemeManifest(JSON.stringify({ textColor: "red" })).ok).toBe(
      false,
    );
    expect(
      parseThemeManifest(JSON.stringify({ backgroundColor: "#fff" })).ok,
    ).toBe(false);
    expect(parseThemeManifest(JSON.stringify({ fontId: "comic" })).ok).toBe(
      false,
    );
  });

  it("validates preview dimensions and builds cache-busted URLs", () => {
    expect(validatePreviewSize({ width: 240, height: 240 })).toBeNull();
    expect(validatePreviewSize({ width: 63, height: 240 })).not.toBeNull();
    expect(validatePreviewSize({ width: 2049, height: 2049 })).not.toBeNull();
    expect(
      packFileUrl("neon-nights", "4x1.png", { mtimeMs: 1000.6, size: 24 }),
    ).toBe("/assets/theme-packs/neon-nights/4x1.png?v=1001-24");
  });

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

describe("theme directory scanner", () => {
  it("returns a valid pack with defaults and cache-busted artwork", async () => {
    const root = await makeRoot();
    await writePack(root, "neon-nights");

    const result = await scanThemeDirectory(root);
    expect(result.diagnostics).toEqual([]);
    expect(result.themes).toHaveLength(1);
    const theme = result.themes[0];
    expect(theme).toMatchObject({
      id: "neon-nights",
      name: "Neon Nights",
      textColor: "#20231f",
      fontId: "app",
      backgroundColor: "#ffffff",
    });
    expect(theme.preview).toMatch(
      /^\/assets\/theme-packs\/neon-nights\/preview\.png\?v=\d+-\d+$/,
    );
    expect(Object.keys(theme.artwork).sort()).toEqual(
      templateArtworkSpecs.map((spec) => spec.id).sort(),
    );
    expect(theme.artwork["4x1"]).toMatch(
      /^\/assets\/theme-packs\/neon-nights\/4x1\.png\?v=\d+-\d+$/,
    );
    expect(theme.artwork["1x1"]).toMatch(
      /^\/assets\/theme-packs\/neon-nights\/single\.png\?v=\d+-\d+$/,
    );
  });

  it("accepts a pack without preview.png", async () => {
    const root = await makeRoot();
    await writePack(root, "no-preview", { omit: ["preview.png"] });

    const result = await scanThemeDirectory(root);
    expect(result.diagnostics).toEqual([]);
    expect(result.themes).toHaveLength(1);
    expect(result.themes[0].preview).toBeUndefined();
    expect(result.themes[0].artwork["4x1"]).toMatch(
      /^\/assets\/theme-packs\/no-preview\/4x1\.png\?v=\d+-\d+$/,
    );
  });

  it("applies manifest fields and warns about a non-square preview", async () => {
    const root = await makeRoot();
    await writePack(root, "neon-nights", {
      manifest: JSON.stringify({
        name: "Neon Nights",
        textColor: "#f8fafc",
        fontId: "display",
        backgroundColor: "#0b1020",
      }),
      preview: [240, 200],
    });

    const result = await scanThemeDirectory(root);
    expect(result.themes[0]).toMatchObject({
      name: "Neon Nights",
      textColor: "#f8fafc",
      fontId: "display",
      backgroundColor: "#0b1020",
    });
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        folder: "neon-nights",
        level: "warning",
        code: "non-square-preview",
      }),
    ]);
  });

  it("ignores underscore folders and missing roots", async () => {
    const root = await makeRoot();
    await writePack(root, "_starter");
    expect(await scanThemeDirectory(root)).toEqual({
      themes: [],
      diagnostics: [],
    });
    expect(await scanThemeDirectory(path.join(root, "does-not-exist"))).toEqual(
      { themes: [], diagnostics: [] },
    );
  });

  it("rejects missing and incorrectly sized artwork", async () => {
    const root = await makeRoot();
    await writePack(root, "missing-art", { omit: ["4x1.png"] });
    await writePack(root, "wrong-size", {
      artwork: { "3x1": [600, 600] },
    });

    const result = await scanThemeDirectory(root);
    expect(result.themes).toEqual([]);
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          folder: "missing-art",
          code: "missing-file",
        }),
        expect.objectContaining({
          folder: "wrong-size",
          code: "wrong-size",
        }),
      ]),
    );
  });

  it("rejects reserved, invalid and badly configured packs", async () => {
    const root = await makeRoot();
    await writePack(root, "Bad Theme");
    await writePack(root, "bad-manifest", {
      manifest: JSON.stringify({ fontId: "comic" }),
    });

    const result = await scanThemeDirectory(root);
    expect(result.themes).toEqual([]);
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ folder: "Bad Theme", code: "invalid-id" }),
        expect.objectContaining({
          folder: "bad-manifest",
          code: "bad-manifest",
        }),
      ]),
    );
  });
});
