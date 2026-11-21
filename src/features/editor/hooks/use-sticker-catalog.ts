"use client";

import { useEffect, useState } from "react";
import type { Sticker } from "@/shared-tools/catalog/stickers";

export interface StickerCatalogData {
  stickers: Sticker[];
  categories: string[];
}

let cachedCatalog: StickerCatalogData | null = null;
let activeRequest: Promise<StickerCatalogData | null> | null = null;

export async function fetchStickerCatalog(): Promise<StickerCatalogData | null> {
  if (cachedCatalog) return cachedCatalog;
  if (activeRequest) return activeRequest;

  activeRequest = (async () => {
    try {
      const response = await fetch("/api/stickers", {
        cache: "no-store",
      });
      if (!response.ok) return null;
      const result = (await response.json()) as StickerCatalogData;
      const data: StickerCatalogData = {
        stickers: Array.isArray(result.stickers) ? result.stickers : [],
        categories: Array.isArray(result.categories) ? result.categories : [],
      };
      cachedCatalog = data;
      return data;
    } catch {
      return null;
    } finally {
      activeRequest = null;
    }
  })();

  return activeRequest;
}

export function useStickerCatalog(): StickerCatalogData {
  const [data, setData] = useState<StickerCatalogData>(
    () => cachedCatalog ?? { stickers: [], categories: [] },
  );

  useEffect(() => {
    if (cachedCatalog) return;

    let unmounted = false;
    void (async () => {
      const result = await fetchStickerCatalog();
      if (!unmounted && result) {
        setData(result);
      }
    })();

    return () => {
      unmounted = true;
    };
  }, []);

  return data;
}
