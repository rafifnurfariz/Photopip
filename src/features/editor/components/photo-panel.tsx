"use client";

// panel tab Foto di editor buat milih salah satu slot foto, pasang filter warna, atau ambil ulang foto itu
// tiap foto di strip bisa dikasih filter warna yang berbeda-beda
import { useState } from "react";
import { useLanguage } from "@/translations/use-language";
import { photoFilters as photoFilterCatalog } from "@/shared-tools/catalog/photo-filters";
import type {
  Composition,
  PhotoFilterId,
} from "@/shared-tools/composition/types";

interface PhotoPanelProps {
  composition: Composition;
  onChange: (composition: Composition) => void;
  onRetake: (index: number) => void;
}

export function PhotoPanel({
  composition,
  onChange,
  onRetake,
}: PhotoPanelProps) {
  const { t } = useLanguage();
  // index foto yang lagi dipilih buat diganti filternya atau di-retake
  const [active, setActive] = useState(0);
  const index = Math.min(active, composition.photos.length - 1);
  const current = composition.photoFilters[index] ?? "none";

  // ubah filter khusus buat foto di posisi index aja, sisanya tetap
  const applyFilter = (filter: PhotoFilterId) => {
    if (filter === current) return;
    const photoFilters = composition.photos.map((_, position) =>
      position === index
        ? filter
        : (composition.photoFilters[position] ?? "none"),
    );
    onChange({ ...composition, photoFilters });
  };

  return (
    <section className="tool-section" aria-labelledby="tool-photo">
      <h2 id="tool-photo">{t.editor.tabs.photo}</h2>
      {/* pilihan thumbnail semua foto yang ada di strip */}
      <div className="photo-grid">
        {composition.photos.map((photo, position) => (
          <button
            key={position}
            type="button"
            className="photo-thumb"
            aria-pressed={position === index}
            aria-label={`${t.editor.photoLabel} ${position + 1}`}
            onClick={() => setActive(position)}
          >
            <img src={photo} alt="" />
            <span>{position + 1}</span>
          </button>
        ))}
      </div>
      <p className="panel-label">{t.editor.filters}</p>
      {/* daftar 6 chip filter warna lengkap sama preview foto aktif */}
      <div className="filter-strip">
        {photoFilterCatalog.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className="filter-chip"
            aria-pressed={current === filter.id}
            onClick={() => applyFilter(filter.id)}
          >
            <span className="filter-preview" aria-hidden="true">
              {composition.photos[index] && (
                <img
                  src={composition.photos[index]}
                  alt=""
                  style={{ filter: filter.preview.filter }}
                />
              )}
              {filter.preview.tint && (
                <span
                  className="filter-tint"
                  style={{ background: filter.preview.tint }}
                />
              )}
            </span>
            <span>{t.editor.filterNames[filter.id]}</span>
          </button>
        ))}
      </div>
      {/* tombol balik ke kamera buat ganti foto yang lagi dipilih */}
      <button
        type="button"
        className="panel-primary"
        onClick={() => onRetake(index)}
      >
        {t.editor.retakePhoto}
      </button>
    </section>
  );
}
