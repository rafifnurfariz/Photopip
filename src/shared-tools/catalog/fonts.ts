export interface TextFont {
  id: string;
  name: string;
  stack: string;
}

export const textFonts: TextFont[] = [
  { id: "app", name: "Studio", stack: "" },
  { id: "serif", name: "Serif", stack: "Georgia, 'Times New Roman', serif" },
  {
    id: "sans",
    name: "Sans",
    stack: "Arial, Helvetica, 'PhotoPip Sans', sans-serif",
  },
  { id: "mono", name: "Mono", stack: "'Courier New', Courier, monospace" },
  {
    id: "display",
    name: "Display",
    stack: "Impact, 'Arial Black', 'PhotoPip Display', sans-serif",
  },
];

/** Resolves the font stack in the browser, where the app font has a generated name. */
export function resolveTextFont(id: string) {
  if (id === "app" && typeof document !== "undefined") {
    return getComputedStyle(document.body).fontFamily || "sans-serif";
  }
  return textFonts.find((font) => font.id === id)?.stack || textFonts[1].stack;
}
