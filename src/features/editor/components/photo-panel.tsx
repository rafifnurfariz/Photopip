"use client";

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
  const [active, setActive] = useState(0);
  const index = Math.min(active, composition.photos.length - 1);
  const current = composition.photoFilters[index] ?? "none";

  const applyFilter = (filter: PhotoFilterId) => {
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
      <div className="filter-strip">
        {photoFilterCatalog.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`filter-chip filter-${filter.id}`}
            aria-pressed={current === filter.id}
            onClick={() => applyFilter(filter.id)}
          >
            <span className="filter-preview" aria-hidden="true" />
            <span>{t.editor.filterNames[filter.id]}</span>
          </button>
        ))}
      </div>
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
