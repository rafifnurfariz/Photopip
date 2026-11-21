"use client";

import { useLanguage } from "@/translations/use-language";
import { TextIcon } from "@/components/icons";
import type { Composition } from "@/shared-tools/composition/types";
import type { CanvasSelection } from "../hooks/use-editor-canvas";

interface LayerListProps {
  composition: Composition;
  selection: CanvasSelection | null;
  onSelect: (selection: CanvasSelection) => void;
}

export function LayerList({
  composition,
  selection,
  onSelect,
}: LayerListProps) {
  const { t } = useLanguage();
  if (composition.stickers.length === 0 && composition.texts.length === 0) {
    return null;
  }
  return (
    <section
      className="tool-section layer-section"
      aria-labelledby="tool-layers"
    >
      <h2 id="tool-layers">{t.editor.layer}</h2>
      <div className="layer-list">
        {composition.texts.toReversed().map((text) => (
          <button
            key={text.id}
            type="button"
            aria-pressed={
              selection?.type === "text" && selection.id === text.id
            }
            onClick={() => onSelect({ type: "text", id: text.id })}
          >
            <span className="layer-icon" aria-hidden="true">
              <TextIcon />
            </span>
            <span className="layer-name">
              {text.text || t.editor.textContent}
            </span>
          </button>
        ))}
        {composition.stickers.toReversed().map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            aria-pressed={
              selection?.type === "sticker" && selection.id === sticker.id
            }
            onClick={() => onSelect({ type: "sticker", id: sticker.id })}
          >
            <span className="layer-icon layer-thumb" aria-hidden="true">
              <img src={sticker.src} alt="" />
            </span>
            <span className="layer-name">{sticker.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
