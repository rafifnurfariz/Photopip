"use client";

import { useEffect, useState } from "react";
import { framePresets, type FramePreset } from "@/shared-tools/catalog/frames";
import type { FramePackResponse } from "@/shared-tools/catalog/frame-pack";
import { mergeFramePacks } from "@/shared-tools/catalog/frame-packs";

/**
 * Starts with the built-in presets so the editor never waits, then adds image
 * packs discovered by `/api/frames`. A missing or broken route leaves the
 * built-ins untouched.
 */
export function useFrameCatalog(): readonly FramePreset[] {
  const [frames, setFrames] = useState<readonly FramePreset[]>(framePresets);

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
        // The scan route is optional; built-in presets remain available.
      }
    })();
    return () => controller.abort();
  }, []);

  return frames;
}
