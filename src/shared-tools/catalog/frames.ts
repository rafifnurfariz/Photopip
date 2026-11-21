import type { TemplateId } from "@/shared-tools/catalog/templates";
import type { Composition } from "@/shared-tools/composition/types";

export type FrameBackground = {
  type: "color";
  value: string;
  preview: string;
};

export interface FramePreset {
  id: string;
  name: string;
  background: FrameBackground;
  artwork?: Partial<Record<TemplateId, string>>;
  textColor: string;
  fontId: string;
}

// Built-in presets stay first in the catalog; image packs from /api/frames follow.
// Currently empty — all frames come from frame-pack folders under public/assets/frame-packs/.
export const framePresets: FramePreset[] = [];

// Stable identity: the editor re-renders on `frame` identity, so a fresh
// fallback object on every call would retry a failed render forever.
const plainFrame: FramePreset = {
  id: "plain",
  name: "Plain",
  background: { type: "color", value: "#ffffff", preview: "#ffffff" },
  textColor: "#20231f",
  fontId: "app",
};

export function frameById(
  id: string,
  frames: readonly FramePreset[] = framePresets,
): FramePreset {
  const found = frames.find((frame) => frame.id === id);
  if (found) return found;
  return plainFrame;
}

function frameMatches(composition: Composition, frame: FramePreset): boolean {
  return composition.texts.every(
    (text) => text.color === frame.textColor && text.fontId === frame.fontId,
  );
}

export function activeFrame(
  composition: Composition,
  frames: readonly FramePreset[] = framePresets,
): FramePreset | null {
  const frame = frames.find((item) => item.id === composition.frameId);
  if (!frame || !frameMatches(composition, frame)) return null;
  return frame;
}

export function applyFrame(
  composition: Composition,
  frame: FramePreset,
): Composition {
  return {
    ...composition,
    frameId: frame.id,
    texts: composition.texts.map((text) => ({
      ...text,
      color: frame.textColor,
      fontId: frame.fontId,
    })),
  };
}
