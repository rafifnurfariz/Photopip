import type { TextPlacement } from "./types";

export const MIN_TEXT_SIZE = 18;
export const MAX_TEXT_LENGTH = 120;

/** Keeps a text placement inside the canvas and within sane limits. */
export function normalizeText(
  text: TextPlacement,
  width: number,
  height: number,
): TextPlacement {
  return {
    ...text,
    text: text.text.slice(0, MAX_TEXT_LENGTH),
    x: Math.max(0, Math.min(width, text.x)),
    y: Math.max(0, Math.min(height, text.y)),
    size: Math.max(MIN_TEXT_SIZE, Math.min(width, text.size)),
    rotation: ((text.rotation % 360) + 360) % 360,
    opacity: Math.max(0, Math.min(1, text.opacity)),
  };
}
