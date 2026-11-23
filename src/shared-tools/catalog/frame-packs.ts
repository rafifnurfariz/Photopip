import type { FramePackFrame } from "./frame-pack";
import type { FramePreset } from "./frames";

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

export function mergeFramePacks(
  builtins: readonly FramePreset[],
  packs: readonly FramePackFrame[],
): FramePreset[] {
  return [...builtins, ...packs.map(packToFramePreset)];
}
