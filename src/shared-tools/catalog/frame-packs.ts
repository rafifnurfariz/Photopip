import type { FramePackFrame } from "./frame-pack";
import type { FramePreset } from "./frames";

/**
 * Converts a discovered pack into the same shape the editor and renderer use.
 * The frame card layers per-template artwork over neutral slot placeholders.
 */
export function packToFramePreset(pack: FramePackFrame): FramePreset {
  return {
    id: pack.id,
    name: pack.name,
    background: {
      type: "color",
      value: pack.backgroundColor,
      preview: pack.backgroundColor,
    },
    artwork: pack.artwork,
    textColor: pack.textColor,
    fontId: pack.fontId,
  };
}

/** Built-in presets stay first; image packs follow in folder order. */
export function mergeFramePacks(
  builtins: readonly FramePreset[],
  packs: readonly FramePackFrame[],
): FramePreset[] {
  return [...builtins, ...packs.map(packToFramePreset)];
}
