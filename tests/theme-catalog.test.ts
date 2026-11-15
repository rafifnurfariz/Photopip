import { describe, expect, it } from "vitest";
import { templates, type TemplateId } from "@/shared-tools/catalog/templates";
import {
  templateArtworkSpecs,
  type ThemePackTheme,
} from "@/shared-tools/catalog/theme-pack";
import {
  mergeThemePacks,
  packToThemePreset,
} from "@/shared-tools/catalog/theme-packs";
import {
  activeTheme,
  applyTheme,
  themeById,
  themePresets,
} from "@/shared-tools/catalog/themes";
import type { Composition } from "@/shared-tools/composition/types";

const pack: ThemePackTheme = {
  id: "neon-nights",
  name: "Neon Nights",
  textColor: "#f8fafc",
  fontId: "display",
  backgroundColor: "#0b1020",
  preview: "/assets/theme-packs/neon-nights/preview.png?v=1-2",
  artwork: Object.fromEntries(
    templateArtworkSpecs.map((spec) => [
      spec.id,
      `/assets/theme-packs/neon-nights/${spec.file}?v=1-2`,
    ]),
  ) as Record<TemplateId, string>,
};

const composition: Composition = {
  template: templates[0],
  photos: [],
  themeId: "neon-nights",
  stickers: [],
  texts: [],
  photoFilters: [],
};

describe("theme pack catalog", () => {
  it("converts a pack into a theme preset with a CSS preview", () => {
    const preset = packToThemePreset(pack);
    expect(preset).toMatchObject({
      id: "neon-nights",
      name: "Neon Nights",
      textColor: "#f8fafc",
      fontId: "display",
      artwork: pack.artwork,
    });
    expect(preset.background).toEqual({
      type: "color",
      value: "#0b1020",
      preview:
        'url("/assets/theme-packs/neon-nights/preview.png?v=1-2") center / cover no-repeat #0b1020',
    });
    expect(preset.frame).toBeUndefined();
  });

  it("falls back to the background color without a preview image", () => {
    const preset = packToThemePreset({ ...pack, preview: undefined });
    expect(preset.background).toEqual({
      type: "color",
      value: "#0b1020",
      preview: "#0b1020",
    });
  });

  it("keeps built-in presets first and appends packs", () => {
    const merged = mergeThemePacks(themePresets, [pack]);
    expect(merged).toHaveLength(themePresets.length + 1);
    expect(merged.slice(0, themePresets.length)).toEqual(themePresets);
    expect(merged[merged.length - 1].id).toBe("neon-nights");
  });

  it("resolves a pack by id and falls back to plain", () => {
    const merged = mergeThemePacks(themePresets, [pack]);
    expect(themeById("neon-nights", merged).name).toBe("Neon Nights");
    expect(themeById("missing", merged).id).toBe("plain");
    expect(themeById("missing")).toEqual({
      id: "plain",
      name: "Plain",
      background: { type: "color", value: "#ffffff", preview: "#ffffff" },
      textColor: "#20231f",
      fontId: "app",
    });
  });

  it("marks a pack active only while captions still match", () => {
    const merged = mergeThemePacks(themePresets, [pack]);
    const applied = applyTheme(composition, merged[merged.length - 1]);
    expect(activeTheme(applied, merged)?.id).toBe("neon-nights");
    expect(
      activeTheme(
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
    const result = applyTheme(
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
      packToThemePreset(pack),
    );
    expect(result.themeId).toBe("neon-nights");
    expect(result.texts[0].color).toBe("#f8fafc");
    expect(result.texts[0].fontId).toBe("display");
  });
});
