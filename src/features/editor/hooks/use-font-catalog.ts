"use client";

import { useEffect, useState } from "react";
import { registerTextFonts, type TextFont } from "@/shared-tools/catalog/fonts";

export interface FontCatalogData {
  fonts: TextFont[];
}

let cachedCatalog: FontCatalogData | null = null;
let activeRequest: Promise<FontCatalogData | null> | null = null;
const loadedFontFamilies = new Set<string>();

async function ensureFontLoaded(font: TextFont): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  if (loadedFontFamilies.has(font.family)) return;

  try {
    const fontFace = new FontFace(font.family, `url(${font.src})`);
    const loaded = await fontFace.load();
    document.fonts.add(loaded);
    loadedFontFamilies.add(font.family);
  } catch (error) {
    console.warn(`[fonts] Failed to load font face ${font.name}:`, error);
  }
}

async function fetchFontCatalog(): Promise<FontCatalogData | null> {
  if (cachedCatalog) return cachedCatalog;
  if (activeRequest) return activeRequest;

  activeRequest = (async () => {
    try {
      const response = await fetch("/api/fonts", {
        cache: "no-store",
      });
      if (!response.ok) return null;
      const result = (await response.json()) as FontScanResponse;
      const data: FontCatalogData = {
        fonts: Array.isArray(result.fonts) ? result.fonts : [],
      };
      registerTextFonts(data.fonts);
      cachedCatalog = data;
      for (const font of data.fonts) {
        void ensureFontLoaded(font);
      }
      return data;
    } catch {
      return null;
    } finally {
      activeRequest = null;
    }
  })();

  return activeRequest;
}

interface FontScanResponse {
  fonts: TextFont[];
}

export function useFontCatalog(): FontCatalogData {
  const [data, setData] = useState<FontCatalogData>(
    () => cachedCatalog ?? { fonts: [] },
  );

  useEffect(() => {
    if (cachedCatalog) return;

    let unmounted = false;
    void (async () => {
      const catalog = await fetchFontCatalog();
      if (!unmounted && catalog) {
        setData(catalog);
      }
    })();

    return () => {
      unmounted = true;
    };
  }, []);

  return data;
}
