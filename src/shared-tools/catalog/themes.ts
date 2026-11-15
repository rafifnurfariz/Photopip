import type { TemplateId } from "@/shared-tools/catalog/templates";
import type { Composition } from "@/shared-tools/composition/types";

interface ThemeBackgroundBase {
  preview: string;
}

export type ThemeBackground =
  | (ThemeBackgroundBase & { type: "color"; value: string })
  | (ThemeBackgroundBase & { type: "gradient"; value: string })
  | (ThemeBackgroundBase & {
      type: "pattern";
      pattern: "stripes" | "dots" | "checker";
    });

export interface ThemePreset {
  id: string;
  name: string;
  background: ThemeBackground;
  frame?: { src: string; slotStroke: string };
  artwork?: Partial<Record<TemplateId, string>>;
  textColor: string;
  fontId: string;
}

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
