"use client";

import { useCallback, useRef, useState } from "react";
import type { ThemePreset } from "@/shared-tools/catalog/themes";
import type { ExportFormat } from "@/shared-tools/composition/export";
import type { Composition } from "@/shared-tools/composition/types";
import type { StudioMessage } from "../types";

export function useExport(onMessage: (message: StudioMessage | null) => void) {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [exporting, setExporting] = useState(false);
  const work = useRef<AbortController | null>(null);

  const exportPhoto = useCallback(
    async (composition: Composition, theme: ThemePreset) => {
      const controller = new AbortController();
      work.current = controller;
      setExporting(true);
      onMessage(null);
      try {
        // Fabric is only needed for the export itself; keep it out of first load.
        const { downloadImage, exportComposition } = await import(
          "@/shared-tools/composition/export"
        );
        if (controller.signal.aborted) return;
        const src = await exportComposition(
          composition,
          theme,
          format,
          controller.signal,
        );
        if (controller.signal.aborted) return;
        downloadImage(
          src,
          `photopip-${Date.now()}.${format === "jpeg" ? "jpg" : "png"}`,
        );
        onMessage("downloaded");
      } catch {
        if (!controller.signal.aborted) onMessage("export");
      } finally {
        if (work.current === controller) {
          work.current = null;
          setExporting(false);
        }
      }
    },
    [format, onMessage],
  );

  const cancel = useCallback(() => {
    work.current?.abort();
    work.current = null;
    setExporting(false);
  }, []);

  return {
    format,
    setFormat,
    exporting,
    exportPhoto,
    cancel,
  };
}
