// helper kecil buat ngambil warna fill background bingkai di canvas Fabric.js
// dipakai di render.ts sebelum naruh foto dan artwork bingkai
import type { FrameBackground } from "@/shared-tools/catalog/frames";

export function backgroundFill(background: FrameBackground): string {
  return background.value;
}
