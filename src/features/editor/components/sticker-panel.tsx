"use client";

import { useMemo, useRef, useState } from "react";
import { useLanguage } from "@/translations/use-language";
import type { Sticker } from "@/shared-tools/catalog/stickers";
import { readStickerFile } from "@/shared-tools/image-upload";
import { useStickerCatalog } from "../hooks/use-sticker-catalog";

interface StickerPanelProps {
  stickerCount: number;
  onAdd: (sticker: Sticker) => void;
  onClear: () => void;
}

export function StickerPanel({
  stickerCount,
  onAdd,
  onClear,
}: StickerPanelProps) {
  const { t } = useLanguage();
  const { stickers, categories } = useStickerCatalog();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const src = await readStickerFile(file);
      const baseName = file.name.replace(/\.[^.]+$/, "").trim();
      const name =
        baseName
          .replace(/[-_]+/g, " ")
          .replace(/\s+/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()) || "Custom Sticker";

      onAdd({
        id: `custom-${Date.now()}`,
        name,
        src,
        tags: ["custom"],
      });
    } catch {
      // Ignore invalid files
    } finally {
      setUploading(false);
    }
  };

  const allCategories = useMemo(() => {
    return ["all", ...categories];
  }, [categories]);

  const visibleStickers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return stickers.filter((sticker) => {
      const haystack =
        `${sticker.name} ${sticker.tags.join(" ")}`.toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesCategory =
        selectedCategory === "all" ||
        sticker.category === selectedCategory ||
        sticker.tags.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [stickers, selectedCategory, search]);

  const getCategoryLabel = (id: string) => {
    if (id === "all") return t.editor.allCategories;
    return id
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <section className="tool-section" aria-labelledby="tool-sticker">
      <div className="section-head">
        <h2 id="tool-sticker">{t.editor.stickers}</h2>
        <button
          type="button"
          className="chip-button"
          disabled={uploading}
          onClick={handleUploadClick}
        >
          {uploading ? t.capture.uploading : `+ ${t.editor.uploadSticker}`}
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
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
        {allCategories.map((id) => (
          <button
            key={id}
            type="button"
            className="chip-button"
            aria-pressed={selectedCategory === id}
            onClick={() => setSelectedCategory(id)}
          >
            {getCategoryLabel(id)}
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
        <div className="empty-note" role="status">
          <p>{t.editor.searchEmpty}</p>
          <button
            type="button"
            className="chip-button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
            }}
          >
            {t.editor.clearSearch}
          </button>
        </div>
      )}
      {stickerCount > 0 && (
        <div className="sticker-controls">
          <span className="panel-progress">
            {stickerCount} {t.editor.stickers}
          </span>
          <button type="button" onClick={onClear}>
            {t.editor.clearStickers}
          </button>
        </div>
      )}
    </section>
  );
}
