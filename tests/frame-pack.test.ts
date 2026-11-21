import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { scanFrameDirectory } from "@/app/api/frames/scan";
import {
  isHexColor,
  isValidPackId,
  nameFromPackId,
  packFileUrl,
  parseFrameManifest,
  PNG_HEADER_BYTES,
  readPngSize,
  templateArtworkSpecs,
} from "@/shared-tools/catalog/frame-pack";

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
  const root = await mkdtemp(path.join(tmpdir(), "photopip-frames-"));
  temporaryDirectories.push(root);
  return root;
}

interface PackOptions {
  manifest?: string;
  artwork?: Partial<Record<string, [number, number]>>;
  omit?: string[];
}

async function writePack(root: string, id: string, options: PackOptions = {}) {
  const directory = path.join(root, id);
  await mkdir(directory, { recursive: true });
  const omit = new Set(options.omit ?? []);
  if (options.manifest !== undefined) {
    await writeFile(path.join(directory, "frame.json"), options.manifest);
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

describe("frame pack validation", () => {
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
    expect(isValidPackId("frame2")).toBe(true);
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
      parseFrameManifest(
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
    expect(parseFrameManifest("{}")).toEqual({ ok: true, manifest: {} });
    expect(parseFrameManifest("{").ok).toBe(false);
    expect(parseFrameManifest("[]").ok).toBe(false);
    expect(parseFrameManifest(JSON.stringify({ name: "" })).ok).toBe(false);
    expect(parseFrameManifest(JSON.stringify({ textColor: "red" })).ok).toBe(
      false,
    );
    expect(
      parseFrameManifest(JSON.stringify({ backgroundColor: "#fff" })).ok,
    ).toBe(false);
    expect(parseFrameManifest(JSON.stringify({ fontId: "comic" })).ok).toBe(
      false,
    );
    expect(
      parseFrameManifest(JSON.stringify({ createdAt: "2026-11-21" })).ok,
    ).toBe(true);
    expect(
      parseFrameManifest(JSON.stringify({ createdAt: "not-a-date" })).ok,
    ).toBe(false);
  });

  it("builds cache-busted URLs", () => {
    expect(
      packFileUrl("neon-nights", "4x1.png", { mtimeMs: 1000.6, size: 24 }),
    ).toBe("/assets/frame-packs/neon-nights/4x1.png?v=1001-24");
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

describe("frame directory scanner", () => {
  it("returns a valid pack with defaults and cache-busted artwork", async () => {
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

  it("applies manifest fields", async () => {
    const root = await makeRoot();
    await writePack(root, "neon-nights", {
      manifest: JSON.stringify({
        name: "Neon Nights",
        textColor: "#f8fafc",
        fontId: "display",
        backgroundColor: "#0b1020",
      }),
    });

    const result = await scanFrameDirectory(root);
    expect(result.frames[0]).toMatchObject({
      name: "Neon Nights",
      textColor: "#f8fafc",
      fontId: "display",
      backgroundColor: "#0b1020",
    });
    expect(result.diagnostics).toEqual([]);
  });

  it("sorts packs with newest createdAt first", async () => {
    const root = await makeRoot();
    await writePack(root, "older-pack", {
      manifest: JSON.stringify({ createdAt: "2026-01-01" }),
    });
    await writePack(root, "newer-pack", {
      manifest: JSON.stringify({ createdAt: "2026-11-01" }),
    });

    const result = await scanFrameDirectory(root);
    expect(result.frames.map((frame) => frame.id)).toEqual([
      "newer-pack",
      "older-pack",
    ]);
  });

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

  it("rejects reserved, invalid and badly configured packs", async () => {
    const root = await makeRoot();
    await writePack(root, "Bad Frame");
    await writePack(root, "bad-manifest", {
      manifest: JSON.stringify({ fontId: "comic" }),
    });

    const result = await scanFrameDirectory(root);
    expect(result.frames).toEqual([]);
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          folder: "Bad Frame",
          code: "bad-folder-name",
        }),
        expect.objectContaining({
          folder: "bad-manifest",
          code: "bad-manifest",
        }),
      ]),
    );
  });
});
