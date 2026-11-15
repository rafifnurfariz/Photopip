"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/translations/use-language";
import { stickers, type Sticker } from "@/shared-tools/catalog/stickers";
import type { Composition } from "@/shared-tools/composition/types";

type Category = "all" | "fun" | "love" | "cool" | "fancy";

const categoryTags: Record<Exclude<Category, "all">, string[]> = {
  fun: ["funny", "talk", "comic", "emoji", "happy"],
  love: ["love", "cute", "pink", "heart"],
  cool: [
    "cool",
    "summer",
    "style",
    "electric",
    "power",
    "energy",
    "peace",
    "harmony",
  ],
  fancy: ["royal", "fancy", "gold", "formal", "classy", "smart", "nerdy"],
};

interface StickerPanelProps {
  composition: Composition;
  onAdd: (sticker: Sticker) => void;
  onClear: () => void;
}

export function StickerPanel({
  composition,
  onAdd,
  onClear,
}: StickerPanelProps) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const visibleStickers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const tags = category === "all" ? null : categoryTags[category];
    return stickers.filter((sticker) => {
      const haystack =
        `${sticker.name} ${sticker.tags.join(" ")}`.toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesCategory =
        !tags || tags.some((tag) => sticker.tags.includes(tag));
      return matchesSearch && matchesCategory;
    });
  }, [category, search]);

  return (
    <section className="tool-section" aria-labelledby="tool-sticker">
      <h2 id="tool-sticker">{t.editor.stickers}</h2>
      <label className="search-label">
        <span className="sr-only">{t.editor.search}</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t.editor.search}
        />
      </label>
      <div className="category-row" role="group" aria-label={t.editor.stickers}>
        {(["all", "fun", "love", "cool", "fancy"] as const).map((id) => (
          <button
            key={id}
            type="button"
            className="chip-button"
            aria-pressed={category === id}
            onClick={() => setCategory(id)}
          >
            {t.editor.categories[id]}
          </button>
        ))}
      </div>
      <div className="sticker-options">
        {visibleStickers.map((sticker) => (
          <button
            type="button"
            key={sticker.id}
            aria-label={sticker.name}
            title={sticker.name}
            onClick={() => onAdd(sticker)}
          >
            <img src={sticker.src} alt="" />
            <span>{sticker.name}</span>
          </button>
        ))}
      </div>
      {visibleStickers.length === 0 && (
        <p role="status" className="tool-help">
          {t.editor.search}: 0
        </p>
      )}
      {composition.stickers.length > 0 && (
        <div className="sticker-controls">
          <span className="panel-progress">
            {composition.stickers.length} {t.editor.stickers}
          </span>
          <button type="button" onClick={onClear}>
            {t.editor.clearStickers}
          </button>
        </div>
      )}
    </section>
  );
}
