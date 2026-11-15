import type { PhotoFilterId } from "@/shared-tools/composition/types";

export interface PhotoFilter {
  id: PhotoFilterId;
  name: string;
}

export const photoFilters: PhotoFilter[] = [
  { id: "none", name: "Original" },
  { id: "bw", name: "Black & White" },
  { id: "warm", name: "Warm" },
  { id: "cool", name: "Cool" },
  { id: "vintage", name: "Vintage" },
  { id: "fade", name: "Fade" },
];
