"use client";

/**
 * PANEL DAFTAR TEKS
 * Menampilkan daftar tulisan/caption yang ada di kanvas,
 * tombol "+ Tambah Teks", dan tombol hapus teks per baris.
 */

import { useLanguage } from "@/translations/use-language";
import { CloseIcon } from "@/components/icons";
import type { Composition } from "@/shared-tools/composition/types";
import type { CanvasSelection } from "../hooks/use-editor-canvas";

interface TextPanelProps {
  composition: Composition;
  selection: CanvasSelection | null;
  onAdd: () => void;
  onSelect: (selection: CanvasSelection) => void;
  onRemove: (id: string) => void;
}

export function TextPanel({
  composition,
  selection,
  onAdd,
  onSelect,
  onRemove,
}: TextPanelProps) {
  const { t } = useLanguage();
  return (
    <section className="tool-section" aria-labelledby="tool-text">
      <div className="section-head">
        <h2 id="tool-text">{t.editor.tabs.text}</h2>
        <button type="button" className="chip-button" onClick={onAdd}>
          + {t.editor.addText}
        </button>
      </div>
      {composition.texts.length === 0 && (
        <p className="tool-help">{t.editor.textEmpty}</p>
      )}
      <div className="text-list">
        {composition.texts.map((text) => (
          <div
            key={text.id}
            className="text-list-item"
            data-selected={
              selection?.type === "text" && selection.id === text.id
            }
          >
            <button
              type="button"
              onClick={() => onSelect({ type: "text", id: text.id })}
            >
              {text.text || t.editor.textContent}
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label={t.editor.remove}
              title={t.editor.remove}
              onClick={() => onRemove(text.id)}
            >
              <span aria-hidden="true">
                <CloseIcon />
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
