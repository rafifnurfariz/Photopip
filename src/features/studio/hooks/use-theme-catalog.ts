"use client";

import { useEffect, useState } from "react";
import { themePresets, type ThemePreset } from "@/shared-tools/catalog/themes";
import type { ThemePackResponse } from "@/shared-tools/catalog/theme-pack";
import { mergeThemePacks } from "@/shared-tools/catalog/theme-packs";

/**
 * Starts with the built-in presets so the editor never waits, then adds image
 * packs discovered by `/api/themes`. A missing or broken route leaves the
 * built-ins untouched.
 */
export function useThemeCatalog(): readonly ThemePreset[] {
  const [themes, setThemes] = useState<readonly ThemePreset[]>(themePresets);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch("/api/themes", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as ThemePackResponse;
        if (controller.signal.aborted || !Array.isArray(data.themes)) return;
        setThemes(mergeThemePacks(themePresets, data.themes));
      } catch {
        if (controller.signal.aborted) return;
        // The scan route is optional; built-in presets remain available.
      }
    })();
    return () => controller.abort();
  }, []);

  return themes;
}
