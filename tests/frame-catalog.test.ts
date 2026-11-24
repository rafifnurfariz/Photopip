// unit test buat konversi paket bingkai dari API ke FramePreset dan pencariannya
// ngecek mergeFramePacks, frameById fallback ke plain, activeFrame, dan applyFrame
import { describe, expect, it } from "vitest";
import { templates, type TemplateId } from "@/shared-tools/catalog/templates";
import {
  templateArtworkSpecs,
  type FramePackFrame,
} from "@/shared-tools/catalog/frame-pack";
import {
  mergeFramePacks,
  packToFramePreset,
} from "@/shared-tools/catalog/frame-packs";
import {
  activeFrame,
  applyFrame,
  frameById,
  framePresets,
} from "@/shared-tools/catalog/frames";
import type { Composition } from "@/shared-tools/composition/types";

// contoh paket bingkai buatan buat bahan uji
const pack: FramePackFrame = {
  id: "neon-nights",
  name: "Neon Nights",
  textColor: "#f8fafc",
  fontId: "display",
  backgroundColor: "#0b1020",
  artwork: Object.fromEntries(
    templateArtworkSpecs.map((spec) => [
      spec.id,
      `/assets/frame-packs/neon-nights/${spec.file}?v=1-2`,
    ]),
  ) as Record<TemplateId, string>,
};

const composition: Composition = {
  template: templates[0],
  photos: [],
  frameId: "neon-nights",
  stickers: [],
  texts: [],
  photoFilters: [],
};

describe("frame pack catalog", () => {
  // cek hasil ubahan FramePackFrame jadi FramePreset lengkap dengan background dan artwork
  it("converts a pack into a frame preset", () => {
    const preset = packToFramePreset(pack);
    expect(preset).toMatchObject({
      id: "neon-nights",
      name: "Neon Nights",
      textColor: "#f8fafc",
      fontId: "display",
      artwork: pack.artwork,
      background: {
        type: "color",
        value: "#0b1020",
        preview: "#0b1020",
      },
    });
  });

  // cek bingkai bawaan tetap di depan dan paket dinamis ditambah di belakangnya
  it("keeps built-in presets first and appends packs", () => {
    const merged = mergeFramePacks(framePresets, [pack]);
    expect(merged).toHaveLength(framePresets.length + 1);
    expect(merged.slice(0, framePresets.length)).toEqual(framePresets);
    expect(merged[merged.length - 1].id).toBe("neon-nights");
  });

  // cek pencarian id bingkai, kalau gak ketemu harus jatuh ke bingkai plain
  it("resolves a pack by id and falls back to plain", () => {
    const merged = mergeFramePacks(framePresets, [pack]);
    expect(frameById("neon-nights", merged).name).toBe("Neon Nights");
    expect(frameById("missing", merged).id).toBe("plain");
    expect(frameById("missing")).toEqual({
      id: "plain",
      name: "Plain",
      background: { type: "color", value: "#ffffff", preview: "#ffffff" },
      textColor: "#20231f",
      fontId: "app",
    });
  });

  // cek activeFrame tetap aktif berdasarkan frameId walau warna atau font teks udah diedit user
  it("keeps a pack active by frameId even when captions are customized", () => {
    const merged = mergeFramePacks(framePresets, [pack]);
    const applied = applyFrame(composition, merged[merged.length - 1]);
    expect(activeFrame(applied, merged)?.id).toBe("neon-nights");
    expect(
      activeFrame(
        {
          ...applied,
          texts: [
            {
              id: "caption",
              text: "Hello",
              x: 300,
              y: 900,
              size: 32,
              rotation: 0,
              color: "#123456",
              fontId: "app",
              align: "center",
              bold: false,
              italic: false,
              opacity: 1,
            },
          ],
        },
        merged,
      )?.id,
    ).toBe("neon-nights");
  });

  // cek applyFrame cuma ganti frameId tanpa mereset warna dan font teks yang sudah ada
  it("applies a pack id while preserving existing text color and font", () => {
    const result = applyFrame(
      {
        ...composition,
        texts: [
          {
            id: "caption",
            text: "Hello",
            x: 300,
            y: 900,
            size: 32,
            rotation: 0,
            color: "#123456",
            fontId: "app",
            align: "center",
            bold: false,
            italic: false,
            opacity: 1,
          },
        ],
      },
      packToFramePreset(pack),
    );
    expect(result.frameId).toBe("neon-nights");
    expect(result.texts[0].color).toBe("#123456");
    expect(result.texts[0].fontId).toBe("app");
  });
});
