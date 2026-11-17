import type { ThemeBackground } from "@/shared-tools/catalog/themes";

/**
 * Mengembalikan warna latar kanvas strip foto.
 */
export function backgroundFill(background: ThemeBackground): string {
  return background.value;
}
