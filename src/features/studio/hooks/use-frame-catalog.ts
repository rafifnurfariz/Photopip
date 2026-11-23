"use client";

// hook buat ngambil daftar paket bingkai dari endpoint /api/frames pas studio dibuka
// hasilnya digabung sama framePresets bawaan lalu dikasih ke editor
import { useEffect, useState } from "react";
import { framePresets, type FramePreset } from "@/shared-tools/catalog/frames";
import type { FramePackResponse } from "@/shared-tools/catalog/frame-pack";
import { mergeFramePacks } from "@/shared-tools/catalog/frame-packs";

export function useFrameCatalog(): readonly FramePreset[] {
  const [frames, setFrames] = useState<readonly FramePreset[]>(framePresets);

  // fetch daftar bingkai sekali pas mount, batalin otomatis kalau komponen unmount
  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch("/api/frames", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as FramePackResponse;
        if (controller.signal.aborted || !Array.isArray(data.frames)) return;
        setFrames(mergeFramePacks(framePresets, data.frames));
      } catch {
        if (controller.signal.aborted) return;
      }
    })();
    return () => controller.abort();
  }, []);

  return frames;
}
