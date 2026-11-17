import type { TemplateId } from "@/shared-tools/catalog/templates";
import type { Composition } from "@/shared-tools/composition/types";

export type ThemeBackground = {
  type: "color";
  value: string;
  preview: string;
};

export interface ThemePreset {
  id: string;
  name: string;
  background: ThemeBackground;
  artwork?: Partial<Record<TemplateId, string>>;
  textColor: string;
  fontId: string;
}

// Built-in presets stay first in the catalog; image packs from /api/themes follow.
// Currently empty — all themes come from theme-pack folders under public/assets/theme-packs/.
export const themePresets: ThemePreset[] = [];

// Stable identity: the editor re-renders on `theme` identity, so a fresh
// fallback object on every call would retry a failed render forever.
const plainTheme: ThemePreset = {
  id: "plain",
  name: "Plain",
  background: { type: "color", value: "#ffffff", preview: "#ffffff" },
  textColor: "#20231f",
  fontId: "app",
};

export function themeById(
  id: string,
  themes: readonly ThemePreset[] = themePresets,
): ThemePreset {
  const found = themes.find((theme) => theme.id === id);
  if (found) return found;
  return plainTheme;
}

function themeMatches(composition: Composition, theme: ThemePreset): boolean {
  return composition.texts.every(
    (text) => text.color === theme.textColor && text.fontId === theme.fontId,
  );
}

export function activeTheme(
  composition: Composition,
  themes: readonly ThemePreset[] = themePresets,
): ThemePreset | null {
  const theme = themes.find((item) => item.id === composition.themeId);
  if (!theme || !themeMatches(composition, theme)) return null;
  return theme;
}

export function applyTheme(
  composition: Composition,
  theme: ThemePreset,
): Composition {
  return {
    ...composition,
    themeId: theme.id,
    texts: composition.texts.map((text) => ({
      ...text,
      color: theme.textColor,
      fontId: theme.fontId,
    })),
  };
}
