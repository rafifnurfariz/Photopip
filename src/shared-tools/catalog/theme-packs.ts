import type { ThemePackTheme } from "./theme-pack";
import type { ThemePreset } from "./themes";

/**
 * Converts a discovered pack into the same shape the editor and renderer use.
 * The CSS preview is a fallback cover; the theme card layers per-template
 * artwork over neutral slot placeholders, so `preview.png` is optional.
 */
export function packToThemePreset(pack: ThemePackTheme): ThemePreset {
  return {
    id: pack.id,
    name: pack.name,
    background: {
      type: "color",
      value: pack.backgroundColor,
      preview: pack.preview
        ? `url("${pack.preview}") center / cover no-repeat ${pack.backgroundColor}`
        : pack.backgroundColor,
    },
    artwork: pack.artwork,
    textColor: pack.textColor,
    fontId: pack.fontId,
  };
}

/** Built-in presets stay first; image packs follow in folder order. */
export function mergeThemePacks(
  builtins: readonly ThemePreset[],
  packs: readonly ThemePackTheme[],
): ThemePreset[] {
  return [...builtins, ...packs.map(packToThemePreset)];
}
