"use client";

// komponen utama Editor fase 2 tempat user nghias strip foto pakai bingkai, filter, stiker, dan teks
// nyatuin canvas Fabric.js, riwayat undo/redo, kontrol zoom, sama 5 tab alat di sidebar kanan
import { useCallback, useMemo, useRef, useState } from "react";
import {
  BackIcon,
  FitIcon,
  RedoIcon,
  ResetIcon,
  UndoIcon,
} from "@/components/icons";
import { useLanguage } from "@/translations/use-language";
import type { Sticker } from "@/shared-tools/catalog/stickers";
import {
  applyFrame,
  frameById,
  type FramePreset,
} from "@/shared-tools/catalog/frames";
import {
  normalizeSticker,
  templateGeometry,
} from "@/shared-tools/composition/geometry";
import { newId } from "@/shared-tools/id";
import { normalizeText } from "@/shared-tools/composition/text";
import type {
  Composition,
  StickerPlacement,
  TextPlacement,
} from "@/shared-tools/composition/types";
import { useFontCatalog } from "./hooks/use-font-catalog";
import { FramePanel } from "./components/frame-panel";
import { PhotoPanel } from "./components/photo-panel";
import { PropertyPanel } from "./components/property-panel";
import { StickerPanel } from "./components/sticker-panel";
import { TextPanel } from "./components/text-panel";
import { ToolRail } from "./components/tool-rail";
import {
  initialHistory,
  pushHistory,
  redoHistory,
  undoHistory,
  type HistoryState,
} from "./history";
import {
  useEditorCanvas,
  type CanvasSelection,
} from "./hooks/use-editor-canvas";
import type { ToolTab } from "./types";

interface EditorProps {
  composition: Composition;
  frames: readonly FramePreset[];
  onChange: (composition: Composition) => void;
  onBack: () => void;
  onReset: () => void;
  onRetakePhoto: (index: number) => void;
  onStickerError?: () => void;
}

// batas zoom paling kecil (50%) dan paling gede (400%)
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

// jepit nilai transparansi biar tetap antara 0 sampai 1
function clampOpacity(value: number) {
  return Math.min(1, Math.max(0, value));
}

export default function Editor({
  composition,
  frames,
  onChange,
  onBack,
  onReset,
  onRetakePhoto,
  onStickerError,
}: EditorProps) {
  const { t } = useLanguage();
  // state tab aktif, objek terpilih di canvas, tingkat zoom, mode fit HP, dan stack undo/redo
  const [tab, setTab] = useState<ToolTab>("frame");
  const [selection, setSelection] = useState<CanvasSelection | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fitWhole, setFitWhole] = useState(false);
  const [history, setHistory] = useState<HistoryState>(initialHistory);
  const { fonts } = useFontCatalog();
  // nyimpen snapshot sebelum geser slider biar satu tarikan slider cuma jadi 1 langkah undo
  const gesture = useRef<Composition | null>(null);
  const geometry = useMemo(
    () => templateGeometry(composition.template),
    [composition.template],
  );
  const frame = frameById(composition.frameId, frames);

  // simpan perubahan ke riwayat undo lalu perbarui state komposisi
  const commit = useCallback(
    (next: Composition) => {
      gesture.current = null;
      setHistory((state) => pushHistory(state, composition));
      onChange(next);
    },
    [composition, onChange],
  );

  // ubah pratinjau langsung tanpa nambah history (dipakai waktu lagi geser slider)
  const preview = useCallback(
    (next: Composition) => onChange(next),
    [onChange],
  );

  // mulai nyatet gesture pas slider ditekan atau input teks mulai difokusin
  const beginGesture = useCallback(() => {
    if (!gesture.current) gesture.current = composition;
  }, [composition]);

  // selesaikan gesture lalu masukin snapshot awal ke stack undo kalau ada perubahan
  const endGesture = useCallback(() => {
    const snapshot = gesture.current;
    gesture.current = null;
    if (snapshot && snapshot !== composition) {
      setHistory((state) => pushHistory(state, snapshot));
    }
  }, [composition]);

  // tiap kali user ngeklik stiker atau teks di canvas, otomatis pindah ke tab properti
  const handleSelect = useCallback((next: CanvasSelection | null) => {
    setSelection(next);
    if (next) setTab("properties");
  }, []);

  const [elementRef, containerRef, canvas] = useEditorCanvas(
    composition,
    frame,
    commit,
    selection,
    handleSelect,
    zoom,
    fitWhole,
  );

  // balik ke perubahan sebelumnya dari stack history
  const undo = () => {
    const result = undoHistory(history, composition);
    if (!result) return;
    gesture.current = null;
    setHistory(result.state);
    onChange(result.next);
  };

  // ulangin perubahan yang baru aja di-undo
  const redo = () => {
    const result = redoHistory(history, composition);
    if (!result) return;
    gesture.current = null;
    setHistory(result.state);
    onChange(result.next);
  };

  // ubah properti satu stiker (posisi, ukuran, rotasi, flip, atau opacity)
  const updateSticker = (
    id: string,
    patch: Partial<StickerPlacement>,
    shouldCommit = false,
  ) => {
    const stickers = composition.stickers.map((sticker) => {
      if (sticker.id !== id) return sticker;
      const merged = { ...sticker, ...patch };
      return {
        ...merged,
        ...normalizeSticker(merged, geometry.width, geometry.height),
        opacity: clampOpacity(merged.opacity),
      };
    });
    const next = { ...composition, stickers };
    if (shouldCommit) commit(next);
    else preview(next);
  };

  // ubah properti satu objek teks (isi, warna, font, posisi, ukuran, gaya)
  const updateText = (
    id: string,
    patch: Partial<TextPlacement>,
    shouldCommit = false,
  ) => {
    const texts = composition.texts.map((text) =>
      text.id === id
        ? normalizeText({ ...text, ...patch }, geometry.width, geometry.height)
        : text,
    );
    const next = { ...composition, texts };
    if (shouldCommit) commit(next);
    else preview(next);
  };

  // taruh stiker baru tepat di tengah canvas lalu langsung pilih stikernya
  const addSticker = (sticker: Sticker) => {
    const id = newId();
    const placement: StickerPlacement = {
      id,
      stickerId: sticker.id,
      src: sticker.src,
      name: sticker.name,
      x: geometry.width / 2,
      y: geometry.height / 2,
      size: geometry.width * 0.25,
      rotation: 0,
      opacity: 1,
      flipX: false,
      flipY: false,
    };
    commit({
      ...composition,
      stickers: [...composition.stickers, placement],
    });
    setSelection({ type: "sticker", id });
    setTab("properties");
  };

  // tambahin teks baru di tengah strip pakai warna dan font bawaan bingkai aktif
  const addText = () => {
    const id = newId();
    // samain sama fontId bingkai biar status bingkai aktif tetap cocok dan dropdown font sinkron
    const defaultFontId = frame.fontId ?? fonts[0]?.id ?? "app";
    const placement: TextPlacement = {
      id,
      text: t.editor.defaultCaption,
      x: geometry.width / 2,
      y: geometry.height / 2,
      size: Math.round(geometry.width * 0.06),
      rotation: 0,
      color: frame.textColor,
      fontId: defaultFontId,
      align: "center",
      bold: false,
      italic: false,
      opacity: 1,
    };
    commit({ ...composition, texts: [...composition.texts, placement] });
    setSelection({ type: "text", id });
    setTab("properties");
  };

  // hapus stiker atau teks yang lagi terseleksi
  const removeSelection = () => {
    if (!selection) return;
    if (selection.type === "sticker") {
      commit({
        ...composition,
        stickers: composition.stickers.filter(
          (sticker) => sticker.id !== selection.id,
        ),
      });
    } else {
      commit({
        ...composition,
        texts: composition.texts.filter((text) => text.id !== selection.id),
      });
    }
    setSelection(null);
  };

  // hapus satu item teks langsung dari daftar di tab Teks
  const removeText = (id: string) => {
    commit({
      ...composition,
      texts: composition.texts.filter((text) => text.id !== id),
    });
    if (selection?.type === "text" && selection.id === id) setSelection(null);
  };

  // gandain stiker atau teks terpilih sambil digeser 24px biar kelihatan gak numpuk persis
  const duplicateSelection = () => {
    if (!selection) return;
    if (selection.type === "sticker") {
      const source = composition.stickers.find(
        (sticker) => sticker.id === selection.id,
      );
      if (!source) return;
      const id = newId();
      const clone = {
        ...source,
        id,
        x: Math.min(geometry.width, source.x + 24),
        y: Math.min(geometry.height, source.y + 24),
      };
      commit({
        ...composition,
        stickers: [...composition.stickers, clone],
      });
      setSelection({ type: "sticker", id });
      return;
    }
    const source = composition.texts.find((text) => text.id === selection.id);
    if (!source) return;
    const id = newId();
    const clone = {
      ...source,
      id,
      x: Math.min(geometry.width, source.x + 24),
      y: Math.min(geometry.height, source.y + 24),
    };
    commit({ ...composition, texts: [...composition.texts, clone] });
    setSelection({ type: "text", id });
  };

  // ubah urutan tumpukan objek ke paling depan (ujung array) atau paling belakang (awal array)
  const layerSelection = (direction: "front" | "back") => {
    if (!selection) return;
    if (selection.type === "sticker") {
      const target = composition.stickers.find(
        (sticker) => sticker.id === selection.id,
      );
      if (!target) return;
      const rest = composition.stickers.filter(
        (sticker) => sticker.id !== selection.id,
      );
      commit({
        ...composition,
        stickers: direction === "front" ? [...rest, target] : [target, ...rest],
      });
      return;
    }
    const target = composition.texts.find((text) => text.id === selection.id);
    if (!target) return;
    const rest = composition.texts.filter((text) => text.id !== selection.id);
    commit({
      ...composition,
      texts: direction === "front" ? [...rest, target] : [target, ...rest],
    });
  };

  // pilihin bingkai acak selain yang lagi dipakai sekarang
  const surprise = () => {
    const pool = frames.filter((item) => item.id !== composition.frameId);
    const next =
      pool[Math.floor(Math.random() * pool.length)] ??
      frames[0] ??
      frameById("plain", frames);
    commit(applyFrame(composition, next));
  };

  // tambah atau kurangi zoom per 25% sambil matiin mode fitWhole
  const changeZoom = (direction: 1 | -1) => {
    setFitWhole(false);
    setZoom((value) => {
      const next = Number((value + direction * 0.25).toFixed(2));
      return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    });
  };

  return (
    <>
      {/* header editor: tombol kembali, judul, undo/redo, reset, dan kontrol zoom */}
      <header className="edit-topline">
        <div className="edit-heading">
          <button
            type="button"
            className="ghost-button back-button"
            aria-label={t.editor.back}
            onClick={onBack}
          >
            <BackIcon />
            <span className="back-label">{t.editor.back}</span>
          </button>
          <div className="edit-title-block">
            <h1 className="edit-title">{t.editor.title}</h1>
            <p className="edit-subtitle">{t.editor.subtitle}</p>
          </div>
        </div>
        <div className="edit-actions">
          <div className="edit-action-group">
            <button
              type="button"
              className="icon-button"
              aria-label={t.editor.undo}
              title={t.editor.undo}
              disabled={history.past.length === 0}
              onClick={undo}
            >
              <span aria-hidden="true">
                <UndoIcon />
              </span>
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label={t.editor.redo}
              title={t.editor.redo}
              disabled={history.future.length === 0}
              onClick={redo}
            >
              <span aria-hidden="true">
                <RedoIcon />
              </span>
            </button>
            <button
              type="button"
              className="ghost-button reset-button"
              aria-label={t.capture.reset}
              onClick={onReset}
            >
              <span className="reset-label">{t.capture.reset}</span>
              <span className="reset-glyph" aria-hidden="true">
                <ResetIcon />
              </span>
            </button>
          </div>
          <div className="zoom-group" role="group" aria-label={t.editor.fit}>
            <button
              type="button"
              className="icon-button"
              aria-label={t.editor.zoomOut}
              title={t.editor.zoomOut}
              onClick={() => changeZoom(-1)}
            >
              <span aria-hidden="true">−</span>
            </button>
            <button
              type="button"
              className="zoom-value"
              aria-label={t.editor.fit}
              title={t.editor.fit}
              onClick={() => {
                setFitWhole(false);
                setZoom(1);
              }}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              className="icon-button fit-button"
              aria-label={t.editor.fit}
              title={t.editor.fit}
              aria-pressed={fitWhole}
              onClick={() => {
                setZoom(1);
                setFitWhole((value) => !value);
              }}
            >
              <FitIcon />
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label={t.editor.zoomIn}
              title={t.editor.zoomIn}
              onClick={() => changeZoom(1)}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </header>
      {/* ruang kerja editor: panggung canvas di kiri dan panel alat ber-tab di kanan */}
      <div className="edit-workspace">
        <div className="composition-stage">
          <div
            className={`canvas-wrap${zoom > 1 ? " is-zoomed" : ""}`}
            ref={containerRef}
            aria-busy={canvas.status === "loading"}
          >
            <canvas ref={elementRef} aria-label={t.capture.previewTitle} />
          </div>
          {canvas.status === "loading" && (
            <p className="stage-status" role="status">
              {t.app.processing}
            </p>
          )}
          {canvas.status === "error" && (
            <div className="stage-status" role="alert">
              <p>{t.errors.export}</p>
              <button type="button" onClick={canvas.retry}>
                {t.camera.retry}
              </button>
            </div>
          )}
          <div className="stage-meta">
            <span className="print-size">
              {composition.template.size} · {geometry.width} × {geometry.height}{" "}
              px
            </span>
            <span className="zoom-badge">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
        <aside className="editor-tools" aria-label={t.editor.title}>
          <ToolRail tab={tab} onChange={setTab} />
          <div
            className="editor-panel"
            key={tab}
            id="editor-panel"
            role="tabpanel"
            tabIndex={0}
            aria-label={t.editor.tabs[tab]}
          >
            {/* tampilkan isi panel sesuai tab yang lagi dipilih */}
            {tab === "frame" && (
              <FramePanel
                composition={composition}
                frames={frames}
                onChange={commit}
                onSurprise={surprise}
              />
            )}
            {tab === "photo" && (
              <PhotoPanel
                composition={composition}
                onChange={commit}
                onRetake={onRetakePhoto}
              />
            )}
            {tab === "sticker" && (
              <StickerPanel
                stickerCount={composition.stickers.length}
                onAdd={addSticker}
                onClear={() => {
                  commit({ ...composition, stickers: [] });
                  setSelection(null);
                }}
                onError={onStickerError}
              />
            )}
            {tab === "text" && (
              <TextPanel
                composition={composition}
                selection={selection}
                onAdd={addText}
                onSelect={handleSelect}
                onRemove={removeText}
              />
            )}
            {tab === "properties" && (
              <PropertyPanel
                composition={composition}
                selection={selection}
                onSelect={handleSelect}
                onStickerChange={updateSticker}
                onTextChange={updateText}
                onBeginGesture={beginGesture}
                onEndGesture={endGesture}
                onDuplicate={duplicateSelection}
                onLayer={layerSelection}
                onRemove={removeSelection}
              />
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
