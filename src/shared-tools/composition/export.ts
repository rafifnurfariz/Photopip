// fungsi ekspor komposisi strip jadi file PNG atau JPEG lalu langsung memicu unduhan di browser
// pakai StaticCanvas terpisah dan renderComposition yang sama biar hasil ekspor persis kayak preview
import { StaticCanvas } from "fabric";
import type { FramePreset } from "@/shared-tools/catalog/frames";
import { renderComposition } from "./render";
import type { Composition } from "./types";

export type ExportFormat = "png" | "jpeg";

// render ulang komposisi di canvas offscreen tanpa handle edit lalu ubah jadi data URL
export async function exportComposition(
  composition: Composition,
  frame: FramePreset,
  format: ExportFormat,
  signal?: AbortSignal,
) {
  const element = document.createElement("canvas");
  // matiin retina scaling biar resolusi output tetap pas sama ukuran piksel template
  const canvas = new StaticCanvas(element, { enableRetinaScaling: false });
  try {
    await renderComposition(canvas, composition, frame, signal);
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
    const data = canvas.toDataURL({
      format,
      quality: 0.95,
      multiplier: 1,
    });
    if (!data.startsWith(`data:image/${format}`))
      throw new Error("Export unavailable");
    return data;
  } finally {
    // bersihin canvas sementara supaya gak menuhin memori
    await canvas.dispose();
  }
}

// bikin tag <a> sementara buat otomatis download gambar ke perangkat user
export function downloadImage(data: string, name: string) {
  const link = document.createElement("a");
  link.href = data;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
