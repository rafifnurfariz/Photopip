import type { Template } from "@/shared-tools/catalog/templates";

export type PhotoFilterId =
  | "none"
  | "bw"
  | "warm"
  | "cool"
  | "vintage"
  | "fade";

export interface StickerPlacement {
  id: string;
  stickerId: string;
  src: string;
  name: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  flipX: boolean;
  flipY: boolean;
}

export interface TextPlacement {
  id: string;
  text: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  fontId: string;
  align: "left" | "center" | "right";
  bold: boolean;
  italic: boolean;
  opacity: number;
}

export interface Composition {
  template: Template;
  photos: string[];
  frameId: string;
  stickers: StickerPlacement[];
  texts: TextPlacement[];
  photoFilters: PhotoFilterId[];
}

export interface Slot {
  x: number;
  y: number;
  width: number;
  height: number;
}
