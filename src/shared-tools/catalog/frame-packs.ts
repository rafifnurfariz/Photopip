// pengubah data bingkai dari API (/api/frames) jadi format FramePreset buat editor
// dipakai di useFrameCatalog biar paket bingkai dinamis bisa digabung sama bingkai bawaan
import type { FramePackFrame } from "./frame-pack";
import type { FramePreset } from "./frames";

// ubah satu item FramePackFrame jadi bentuk FramePreset yang dipakai renderer
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

// gabungin daftar bingkai bawaan sama paket bingkai hasil scan API
export function mergeFramePacks(
  builtins: readonly FramePreset[],
  packs: readonly FramePackFrame[],
): FramePreset[] {
  return [...builtins, ...packs.map(packToFramePreset)];
}
