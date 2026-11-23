export interface TextFont {
  id: string;
  name: string;
  src: string;
  family: string;
}

const FALLBACK_FONT_FAMILY = "sans-serif";

const registeredFonts = new Map<string, TextFont>();

export function registerTextFonts(fonts: TextFont[]) {
  for (const font of fonts) {
    registeredFonts.set(font.id, font);
  }
}

export function getTextFont(id: string): TextFont | undefined {
  return registeredFonts.get(id);
}

export function resolveTextFont(id: string): string {
  const font = registeredFonts.get(id);
  if (font?.family) {
    return font.family;
  }
  return FALLBACK_FONT_FAMILY;
}
