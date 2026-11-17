"use client";

import { useEffect, useState } from "react";
import type { Sticker } from "@/shared-tools/catalog/stickers";

export interface StickerCatalogData {
  stickers: Sticker[];
  categories: string[];
}

export function useStickerCatalog(): StickerCatalogData {
  const [data, setData] = useState<StickerCatalogData>({
    stickers: [],
    categories: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch("/api/stickers", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) return;
        const result = (await response.json()) as StickerCatalogData;
        if (controller.signal.aborted) return;
        setData({
          stickers: Array.isArray(result.stickers) ? result.stickers : [],
          categories: Array.isArray(result.categories) ? result.categories : [],
        });
      } catch {
        if (controller.signal.aborted) return;
      }
    })();
    return () => controller.abort();
  }, []);

  return data;
}
