import type { PhotoFilterId } from "@/shared-tools/composition/types";

/** CSS approximation of the Fabric chain in render.ts, for the panel preview. */
interface PhotoFilterPreview {
  filter?: string;
  tint?: string;
}

export interface PhotoFilter {
  id: PhotoFilterId;
  preview: PhotoFilterPreview;
}

// shortcut: the chip preview approximates render.ts, update both together.
export const photoFilters: PhotoFilter[] = [
  { id: "none", preview: {} },
  { id: "bw", preview: { filter: "grayscale(1)" } },
  {
    id: "warm",
    preview: { filter: "brightness(1.03)", tint: "rgba(255, 179, 122, 0.18)" },
  },
  { id: "cool", preview: { tint: "rgba(122, 184, 255, 0.18)" } },
  {
    id: "vintage",
    preview: { filter: "sepia(0.45) contrast(0.92) saturate(0.85)" },
  },
  {
    id: "fade",
    preview: { filter: "saturate(0.65) brightness(1.08) contrast(0.94)" },
  },
];
