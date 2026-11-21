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

  it("keeps built-in presets first and appends packs", () => {
    const merged = mergeFramePacks(framePresets, [pack]);
    expect(merged).toHaveLength(framePresets.length + 1);
    expect(merged.slice(0, framePresets.length)).toEqual(framePresets);
    expect(merged[merged.length - 1].id).toBe("neon-nights");
  });

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

  it("marks a pack active only while captions still match", () => {
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
      ),
    ).toBeNull();
  });

  it("applies a pack id, text color and font to the composition", () => {
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
            color: "#000000",
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
    expect(result.texts[0].color).toBe("#f8fafc");
    expect(result.texts[0].fontId).toBe("display");
  });
});
