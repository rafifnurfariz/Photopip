"use client";

// hook buat ambil daftar font kustom dari /api/fonts sekaligus preload ke document.fonts
// hasil fetch di-cache di level modul biar gak request berulang kali pas pindah tab
import { useEffect, useState } from "react";
import {
  ensureTextFontLoaded,
  registerTextFonts,
  type TextFont,
} from "@/shared-tools/catalog/fonts";

export interface FontCatalogData {
  fonts: TextFont[];
}

// cache global hasil fetch dan request yang sedang berjalan
let cachedCatalog: FontCatalogData | null = null;
let activeRequest: Promise<FontCatalogData | null> | null = null;

// fetch katalog font sekali saja; kalau ada request lain berbarengan, tunggu promise yang sama
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
      // daftarin font ke registry dan mulai preload di background
      registerTextFonts(data.fonts);
      cachedCatalog = data;
      for (const font of data.fonts) {
        void ensureTextFontLoaded(font);
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

// hook React yang dipakai Editor dan TextInspector buat dapetin daftar font tersedia
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
