import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { scanStickersDirectory } from "@/app/api/stickers/scan";

const temporaryDirectories: string[] = [];

async function makeRoot() {
  const root = await mkdtemp(path.join(tmpdir(), "photopip-stickers-"));
  temporaryDirectories.push(root);
  return root;
}

afterEach(async () => {
  while (temporaryDirectories.length > 0) {
    const dir = temporaryDirectories.pop();
    if (dir) await rm(dir, { recursive: true, force: true });
  }
});

describe("scanStickersDirectory", () => {
  it("returns empty arrays if folder does not exist", async () => {
    const result = await scanStickersDirectory("non-existent-directory-12345");
    expect(result.stickers).toEqual([]);
    expect(result.categories).toEqual([]);
  });

  it("scans category folders and formats sticker names", async () => {
    const root = await makeRoot();
    const cuteDir = path.join(root, "cute");
    await mkdir(cuteDir, { recursive: true });
    await writeFile(path.join(cuteDir, "teddy-bear.png"), "dummy-png");
    await writeFile(path.join(cuteDir, "happy_cat.webp"), "dummy-webp");
    await writeFile(path.join(cuteDir, "notes.txt"), "ignored-file");

    const result = await scanStickersDirectory(root);
    expect(result.categories).toEqual(["cute"]);
    expect(result.stickers).toHaveLength(2);

    const bear = result.stickers.find((s) => s.id === "cute-teddy-bear");
    expect(bear).toBeDefined();
    expect(bear?.name).toBe("Teddy Bear");
    expect(bear?.category).toBe("cute");
    expect(bear?.tags).toContain("cute");
    expect(bear?.tags).toContain("teddy");
    expect(bear?.tags).toContain("bear");
    expect(bear?.src).toContain("/assets/stickers/cute/teddy-bear.png?v=");
  });

  it("skips folders starting with dot or underscore", async () => {
    const root = await makeRoot();
    const hiddenDir = path.join(root, ".hidden");
    const starterDir = path.join(root, "_starter");
    await mkdir(hiddenDir, { recursive: true });
    await mkdir(starterDir, { recursive: true });
    await writeFile(path.join(hiddenDir, "test.png"), "dummy");
    await writeFile(path.join(starterDir, "test.png"), "dummy");

    const result = await scanStickersDirectory(root);
    expect(result.stickers).toEqual([]);
    expect(result.categories).toEqual([]);
  });

  it("handles stickers placed directly in root directory", async () => {
    const root = await makeRoot();
    await writeFile(path.join(root, "sparkle-star.png"), "dummy");

    const result = await scanStickersDirectory(root);
    expect(result.stickers).toHaveLength(1);
    expect(result.stickers[0].id).toBe("sparkle-star");
    expect(result.stickers[0].name).toBe("Sparkle Star");
    expect(result.stickers[0].category).toBe("all");
    expect(result.stickers[0].src).toContain(
      "/assets/stickers/sparkle-star.png?v=",
    );
  });

  it("keeps ids unique when two file names sanitize alike", async () => {
    const root = await makeRoot();
    const y2k = path.join(root, "y2k");
    await mkdir(y2k, { recursive: true });
    await writeFile(path.join(y2k, "what!.png"), "first");
    await writeFile(path.join(y2k, "what.png"), "second");

    const result = await scanStickersDirectory(root);
    const ids = result.stickers.map((sticker) => sticker.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it("ignores svg files", async () => {
    const root = await makeRoot();
    const cute = path.join(root, "cute");
    await mkdir(cute, { recursive: true });
    await writeFile(path.join(cute, "icon.svg"), "<svg />");

    const result = await scanStickersDirectory(root);
    expect(result.stickers).toEqual([]);
  });
});
