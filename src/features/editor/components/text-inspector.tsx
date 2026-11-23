"use client";

// inspektor pengaturan satu objek teks yang lagi dipilih di canvas
// bisa ubah isi tulisan, font, warna, posisi, ukuran, rotasi, opacity, perataan, bold/italic, dan layer
import { useLanguage } from "@/translations/use-language";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "@/components/icons";
import { useFontCatalog } from "../hooks/use-font-catalog";
import {
  MAX_TEXT_LENGTH,
  MIN_TEXT_SIZE,
} from "@/shared-tools/composition/text";
import type { TextPlacement } from "@/shared-tools/composition/types";
import { NumberField } from "./number-field";

interface TextInspectorProps {
  text: TextPlacement;
  geometry: { width: number; height: number };
  onChange: (patch: Partial<TextPlacement>, commit?: boolean) => void;
  onBeginGesture: () => void;
  onEndGesture: () => void;
  onDuplicate: () => void;
  onLayer: (direction: "front" | "back") => void;
  onRemove: () => void;
}

export function TextInspector({
  text,
  geometry,
  onChange,
  onBeginGesture,
  onEndGesture,
  onDuplicate,
  onLayer,
  onRemove,
}: TextInspectorProps) {
  const { t } = useLanguage();
  const { fonts } = useFontCatalog();
  return (
    <section
      className="tool-section property-section"
      aria-labelledby="tool-property"
    >
      <div className="property-head">
        <h2 id="tool-property">{t.editor.textContent}</h2>
        <span className="property-kind">{t.editor.tabs.text}</span>
      </div>
      {/* kotak edit isi tulisan, dibatasi maksimal MAX_TEXT_LENGTH karakter */}
      <label className="field">
        <span>{t.editor.textContent}</span>
        <textarea
          value={text.text}
          maxLength={MAX_TEXT_LENGTH}
          rows={2}
          placeholder={t.editor.textPlaceholder}
          onChange={(event) => onChange({ text: event.target.value })}
          onFocus={onBeginGesture}
          onBlur={onEndGesture}
        />
      </label>
      {/* pemilih font kustom dari API dan color picker buat warna huruf */}
      <div className="field-grid">
        <label className="field">
          <span>{t.editor.font}</span>
          <select
            value={text.fontId}
            onChange={(event) => onChange({ fontId: event.target.value }, true)}
          >
            {fonts.length === 0 ? (
              <option value={text.fontId || "system"}>Default</option>
            ) : (
              fonts.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name}
                </option>
              ))
            )}
          </select>
        </label>
        <label className="field">
          <span>{t.editor.color}</span>
          <input
            type="color"
            className="color-input"
            value={text.color}
            onChange={(event) => onChange({ color: event.target.value }, true)}
          />
        </label>
      </div>
      {/* slider posisi X/Y, ukuran font, rotasi, dan transparansi */}
      <p className="panel-label">{t.editor.position}</p>
      <div className="range-list">
        <NumberField
          label={t.editor.horizontal}
          value={text.x}
          min={0}
          max={geometry.width}
          suffix="px"
          onChange={(x) => onChange({ x })}
          onBegin={onBeginGesture}
          onEnd={onEndGesture}
        />
        <NumberField
          label={t.editor.vertical}
          value={text.y}
          min={0}
          max={geometry.height}
          suffix="px"
          onChange={(y) => onChange({ y })}
          onBegin={onBeginGesture}
          onEnd={onEndGesture}
        />
        <NumberField
          label={t.editor.size}
          value={text.size}
          min={MIN_TEXT_SIZE}
          max={Math.max(MIN_TEXT_SIZE, geometry.width)}
          suffix="px"
          onChange={(size) => onChange({ size })}
          onBegin={onBeginGesture}
          onEnd={onEndGesture}
        />
        <NumberField
          label={t.editor.rotation}
          value={text.rotation}
          min={0}
          max={359}
          suffix="°"
          onChange={(rotation) => onChange({ rotation })}
          onBegin={onBeginGesture}
          onEnd={onEndGesture}
        />
        <NumberField
          label={t.editor.opacity}
          value={text.opacity * 100}
          min={0}
          max={100}
          suffix="%"
          onChange={(opacity) => onChange({ opacity: opacity / 100 })}
          onBegin={onBeginGesture}
          onEnd={onEndGesture}
        />
      </div>
      {/* tombol rata kiri/tengah/kanan plus toggle tebal dan miring */}
      <p className="panel-label">{t.editor.align}</p>
      <div className="property-actions">
        {(
          [
            ["left", <AlignLeftIcon key="left" />, t.editor.alignLeft],
            ["center", <AlignCenterIcon key="center" />, t.editor.alignCenter],
            ["right", <AlignRightIcon key="right" />, t.editor.alignRight],
          ] as const
        ).map(([align, icon, label]) => (
          <button
            key={align}
            type="button"
            aria-label={label}
            title={label}
            aria-pressed={text.align === align}
            onClick={() => onChange({ align }, true)}
          >
            <span aria-hidden="true">{icon}</span>
          </button>
        ))}
        <button
          type="button"
          aria-label={t.editor.bold}
          title={t.editor.bold}
          aria-pressed={text.bold}
          onClick={() => onChange({ bold: !text.bold }, true)}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          aria-label={t.editor.italic}
          title={t.editor.italic}
          aria-pressed={text.italic}
          onClick={() => onChange({ italic: !text.italic }, true)}
        >
          <em>I</em>
        </button>
      </div>
      {/* tombol atur urutan tumpukan, gandain teks, dan hapus */}
      <p className="panel-label">{t.editor.layer}</p>
      <div className="property-actions">
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
