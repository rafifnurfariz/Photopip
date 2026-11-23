"use client";

// panel tab Properti yang nampilin pengaturan detail buat stiker atau teks yang lagi dipilih
// di bagian bawahnya selalu ikut nampilin daftar semua layer biar gampang pindah seleksi
import { useLanguage } from "@/translations/use-language";
import { templateGeometry } from "@/shared-tools/composition/geometry";
import type {
  Composition,
  StickerPlacement,
  TextPlacement,
} from "@/shared-tools/composition/types";
import type { CanvasSelection } from "../hooks/use-editor-canvas";
import { LayerList } from "./layer-list";
import { StickerInspector } from "./sticker-inspector";
import { TextInspector } from "./text-inspector";

interface PropertyPanelProps {
  composition: Composition;
  selection: CanvasSelection | null;
  onSelect: (selection: CanvasSelection) => void;
  onStickerChange: (
    id: string,
    patch: Partial<StickerPlacement>,
    commit?: boolean,
  ) => void;
  onTextChange: (
    id: string,
    patch: Partial<TextPlacement>,
    commit?: boolean,
  ) => void;
  onBeginGesture: () => void;
  onEndGesture: () => void;
  onDuplicate: () => void;
  onLayer: (direction: "front" | "back") => void;
  onRemove: () => void;
}

export function PropertyPanel({
  composition,
  selection,
  onSelect,
  onStickerChange,
  onTextChange,
  onBeginGesture,
  onEndGesture,
  onDuplicate,
  onLayer,
  onRemove,
}: PropertyPanelProps) {
  const { t } = useLanguage();
  const geometry = templateGeometry(composition.template);
  // cari data stiker atau teks yang cocok sama objek terseleksi sekarang
  const sticker =
    selection?.type === "sticker"
      ? composition.stickers.find((item) => item.id === selection.id)
      : undefined;
  const text =
    selection?.type === "text"
      ? composition.texts.find((item) => item.id === selection.id)
      : undefined;

  return (
    <>
      {/* tampilkan inspektor stiker, inspektor teks, atau petunjuk kalau belum ada yang diklik */}
      {sticker && (
        <StickerInspector
          sticker={sticker}
          geometry={geometry}
          onChange={(patch, commit) =>
            onStickerChange(sticker.id, patch, commit)
          }
          onBeginGesture={onBeginGesture}
          onEndGesture={onEndGesture}
          onDuplicate={onDuplicate}
          onLayer={onLayer}
          onRemove={onRemove}
        />
      )}
      {text && (
        <TextInspector
          text={text}
          geometry={geometry}
          onChange={(patch, commit) => onTextChange(text.id, patch, commit)}
          onBeginGesture={onBeginGesture}
          onEndGesture={onEndGesture}
          onDuplicate={onDuplicate}
          onLayer={onLayer}
          onRemove={onRemove}
        />
      )}
      {!sticker && !text && (
        <p className="tool-help" role="status">
          {t.editor.noSelection}
        </p>
      )}
      <LayerList
        composition={composition}
        selection={selection}
        onSelect={onSelect}
      />
    </>
  );
}
