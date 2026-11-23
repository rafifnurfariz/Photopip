import { StaticCanvas } from "fabric";
import type { FramePreset } from "@/shared-tools/catalog/frames";
import { renderComposition } from "./render";
import type { Composition } from "./types";

export type ExportFormat = "png" | "jpeg";

export async function exportComposition(
  composition: Composition,
  frame: FramePreset,
  format: ExportFormat,
  signal?: AbortSignal,
) {
  const element = document.createElement("canvas");
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
    await canvas.dispose();
  }
}

export function downloadImage(data: string, name: string) {
  const link = document.createElement("a");
  link.href = data;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
