// kumpulan tipe data utama komposisi strip foto yang dipakai di editor dan renderer
// semua objek di sini dipakai secara immutable biar undo/redo dan React tetap rapi
import type { Template } from "@/shared-tools/catalog/templates";

// pilihan id filter warna yang bisa dipasang per foto
export type PhotoFilterId =
  | "none"
  | "bw"
  | "warm"
  | "cool"
  | "vintage"
  | "fade";

// posisi dan gaya satu stiker yang sudah ditaruh di canvas
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

// isi, posisi, dan gaya satu objek teks di canvas
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

// data lengkap satu hasil strip foto: template, daftar foto, bingkai, stiker, teks, dan filter
export interface Composition {
  template: Template;
  photos: string[];
  frameId: string;
  stickers: StickerPlacement[];
  texts: TextPlacement[];
  photoFilters: PhotoFilterId[];
}

// kotak koordinat satu lubang foto di dalam canvas
export interface Slot {
  x: number;
  y: number;
  width: number;
  height: number;
}
