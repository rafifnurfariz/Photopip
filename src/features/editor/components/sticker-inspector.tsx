"use client";

import { useLanguage } from "@/translations/use-language";
import { MIN_STICKER_SIZE } from "@/shared-tools/composition/geometry";
import type { StickerPlacement } from "@/shared-tools/composition/types";
import { NumberField } from "./number-field";

interface StickerInspectorProps {
  sticker: StickerPlacement;
  geometry: { width: number; height: number };
  onChange: (patch: Partial<StickerPlacement>, commit?: boolean) => void;
  onBeginGesture: () => void;
  onEndGesture: () => void;
  onDuplicate: () => void;
  onLayer: (direction: "front" | "back") => void;
  onRemove: () => void;
}

export function StickerInspector({
  sticker,
  geometry,
  onChange,
  onBeginGesture,
  onEndGesture,
  onDuplicate,
  onLayer,
  onRemove,
}: StickerInspectorProps) {
  const { t } = useLanguage();
  return (
    <section
      className="tool-section property-section"
      aria-labelledby="tool-property"
    >
      <div className="property-head">
        <h2 id="tool-property">{sticker.name}</h2>
        <span className="property-kind">{t.editor.stickers}</span>
      </div>
      <p className="panel-label">{t.editor.position}</p>
      <div className="range-list">
        <NumberField
          label={t.editor.horizontal}
          value={sticker.x}
          min={0}
          max={geometry.width}
          suffix="px"
          onChange={(x) => onChange({ x })}
          onBegin={onBeginGesture}
          onEnd={onEndGesture}
        />
        <NumberField
          label={t.editor.vertical}
          value={sticker.y}
          min={0}
          max={geometry.height}
          suffix="px"
          onChange={(y) => onChange({ y })}
          onBegin={onBeginGesture}
          onEnd={onEndGesture}
        />
        <NumberField
          label={t.editor.size}
          value={sticker.size}
          min={MIN_STICKER_SIZE}
          max={geometry.width}
          suffix="px"
          onChange={(size) => onChange({ size })}
          onBegin={onBeginGesture}
          onEnd={onEndGesture}
        />
        <NumberField
          label={t.editor.rotation}
          value={sticker.rotation}
          min={0}
          max={359}
          suffix="°"
          onChange={(rotation) => onChange({ rotation })}
          onBegin={onBeginGesture}
          onEnd={onEndGesture}
        />
        <NumberField
          label={t.editor.opacity}
          value={sticker.opacity * 100}
          min={0}
          max={100}
          suffix="%"
          onChange={(opacity) => onChange({ opacity: opacity / 100 })}
          onBegin={onBeginGesture}
          onEnd={onEndGesture}
        />
      </div>
      <p className="panel-label">{t.editor.layer}</p>
      <div className="property-actions">
        <button
          type="button"
          aria-pressed={sticker.flipX}
          onClick={() => onChange({ flipX: !sticker.flipX }, true)}
        >
          {t.editor.flipX}
        </button>
        <button
          type="button"
          aria-pressed={sticker.flipY}
          onClick={() => onChange({ flipY: !sticker.flipY }, true)}
        >
          {t.editor.flipY}
        </button>
        <button type="button" onClick={() => onLayer("front")}>
          {t.editor.bringFront}
        </button>
        <button type="button" onClick={() => onLayer("back")}>
          {t.editor.sendBack}
        </button>
        <button type="button" onClick={onDuplicate}>
          {t.editor.duplicate}
        </button>
        <button type="button" className="danger-button" onClick={onRemove}>
          {t.editor.deleteSelection}
        </button>
      </div>
    </section>
  );
}
