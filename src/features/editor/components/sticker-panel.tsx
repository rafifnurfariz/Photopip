"use client";

// panel tab Stiker di editor buat cari, filter kategori, unggah stiker sendiri, dan nempelin ke strip
// daftar stiker diambil otomatis dari /api/stickers lewat hook useStickerCatalog
import { useMemo, useRef, useState } from "react";
import { useLanguage } from "@/translations/use-language";
import type { Sticker } from "@/shared-tools/catalog/stickers";
import { readStickerFile } from "@/shared-tools/image-upload";
import { useStickerCatalog } from "../hooks/use-sticker-catalog";

interface StickerPanelProps {
  stickerCount: number;
  onAdd: (sticker: Sticker) => void;
  onClear: () => void;
  onError?: () => void;
}

export function StickerPanel({
  stickerCount,
  onAdd,
  onClear,
  onError,
}: StickerPanelProps) {
  const { t } = useLanguage();
  const { stickers, categories } = useStickerCatalog();
  // state kata kunci pencarian, kategori aktif, dan status proses unggah stiker kustom
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // buka dialog pilih file gambar dari perangkat
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // baca gambar unggahan user jadi PNG transparan lalu langsung pasang ke canvas sebagai stiker baru
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
      // kasih tau user lewat toast kalau file stiker gagal dibaca atau terlalu besar
      onError?.();
    } finally {
      setUploading(false);
    }
  };

  // tambahin tab "all" di depan daftar kategori hasil scan folder
  const allCategories = useMemo(() => {
    return ["all", ...categories];
  }, [categories]);

  // saring stiker yang cocok sama kata pencarian dan kategori yang dipilih
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

  // rapihin nama folder kategori jadi label tombol yang enak dibaca
  const getCategoryLabel = (id: string) => {
    if (id === "all") return t.editor.allCategories;
    return id
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <section className="tool-section" aria-labelledby="tool-sticker">
      {/* judul panel stiker dan tombol upload stiker kustom */}
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
      {/* kolom cari stiker berdasarkan nama atau tag */}
      <label className="search-label">
        <span className="sr-only">{t.editor.search}</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t.editor.search}
        />
      </label>
      {/* deretan tombol filter kategori stiker */}
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
      {/* grid pilihan stiker yang bisa diklik buat langsung ditempel ke tengah strip */}
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
      {/* tampilkan catatan kosong + tombol reset pencarian kalau gak ada stiker yang cocok */}
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
      {/* info jumlah stiker terpasang dan tombol hapus semua stiker sekaligus */}
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
