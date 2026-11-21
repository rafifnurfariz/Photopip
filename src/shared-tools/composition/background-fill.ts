import type { FrameBackground } from "@/shared-tools/catalog/frames";

/**
 * Mengembalikan warna latar kanvas strip foto.
 */
export function backgroundFill(background: FrameBackground): string {
  return background.value;
}
