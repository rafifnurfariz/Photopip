// katalog daftar filter warna foto buat ditampilin di tab Foto editor
// tiap item nyimpen gaya CSS preview yang ngedeketin hasil filter Fabric.js di render.ts
import type { PhotoFilterId } from "@/shared-tools/composition/types";

// properti CSS filter sama lapisan warna tint buat pratinjau kecil di chip
interface PhotoFilterPreview {
  filter?: string;
  tint?: string;
}

export interface PhotoFilter {
  id: PhotoFilterId;
  preview: PhotoFilterPreview;
}

// daftar 6 filter foto yang bisa dipilih user di editor
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
