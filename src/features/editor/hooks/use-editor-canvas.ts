"use client";

// hook penghubung antara React state di Editor dengan instance Canvas Fabric.js
// ngatur inisialisasi canvas, resize sesuai layar/zoom, drag/scale/rotate stiker & teks, sampai fast-update pas geser slider
import { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import type { FramePreset } from "@/shared-tools/catalog/frames";
import {
  fitCanvas,
  normalizeSticker,
  templateGeometry,
} from "@/shared-tools/composition/geometry";
import { normalizeText } from "@/shared-tools/composition/text";
import {
  ensureTextFontLoaded,
  getTextFont,
  isTextFontLoaded,
  resolveTextFont,
} from "@/shared-tools/catalog/fonts";
import {
  clearImageCache,
  renderComposition,
  type EditorObject,
} from "@/shared-tools/composition/render";
import type { Composition } from "@/shared-tools/composition/types";

// penanda objek mana yang lagi diseleksi di canvas
export interface CanvasSelection {
  type: "sticker" | "text";
  id: string;
}

// ukur ruang bersih di dalam elemen pembungkus canvas (dikurangi padding)
function measure(element: HTMLElement) {
  const style = getComputedStyle(element);
  const paddingX =
    (Number.parseFloat(style.paddingLeft) || 0) +
    (Number.parseFloat(style.paddingRight) || 0);
  const paddingY =
    (Number.parseFloat(style.paddingTop) || 0) +
    (Number.parseFloat(style.paddingBottom) || 0);
  return {
    width: Math.max(0, element.clientWidth - paddingX),
    height: Math.max(0, element.clientHeight - paddingY),
  };
}

// cari objek Fabric di dalam canvas berdasarkan placementId dan jenisnya
function findObject(canvas: Canvas, target: CanvasSelection) {
  return canvas.getObjects().find((item) => {
    const object = item as EditorObject;
    return (
      object.placementId === target.id && object.objectType === target.type
    );
  });
}

export function useEditorCanvas(
  composition: Composition,
  frame: FramePreset,
  onCommit: (composition: Composition) => void,
  selection: CanvasSelection | null,
  onSelect: (selection: CanvasSelection | null) => void,
  zoom: number,
  fitWhole: boolean,
) {
  const elementRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const renderingRef = useRef(false);
  const renderedRef = useRef(false);
  // simpan komposisi dan bingkai yang terakhir benar-benar selesai dirender di canvas
  const renderedCompositionRef = useRef<Composition | null>(null);
  const renderedFrameRef = useRef<FramePreset | null>(null);
  const renderId = useRef(0);
  const resizeRef = useRef<() => void>(() => {});
  // simpan props terbaru di ref biar event listener Fabric selalu baca data terkini
  const latest = useRef({
    composition,
    onCommit,
    onSelect,
    zoom,
    selection,
    fitWhole,
  });
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    latest.current = {
      composition,
      onCommit,
      onSelect,
      zoom,
      selection,
      fitWhole,
    };
  });

  // buat instance Canvas Fabric sekali pas mount lalu pasang semua listener interaksi
  useEffect(() => {
    const container = containerRef.current;
    if (!elementRef.current || !container) return;
    const canvas = new Canvas(elementRef.current, {
      preserveObjectStacking: true,
      selection: false,
      enableRetinaScaling: false,
      enablePointerEvents: true,
      hoverCursor: "move",
    });
    canvasRef.current = canvas;

    // hitung ulang ukuran tampilan CSS canvas tiap kali layar, zoom, atau mode fit berubah
    const resize = () => {
      const { width, height } = measure(container);
      const geometry = templateGeometry(latest.current.composition.template);
      const tall = geometry.height > geometry.width * 1.5;
      const stacked = window.innerWidth <= 899;
      // di HP buat strip panjang, penuhi lebar biar jelas, kecuali user aktifin tombol fitWhole
      const fit =
        stacked && latest.current.fitWhole
          ? fitCanvas(geometry, width, height)
          : tall && stacked
            ? { width, height: (width * geometry.height) / geometry.width }
            : fitCanvas(geometry, width, height);
      if (fit.width <= 0 || fit.height <= 0) return;
      const scale = Math.max(0.25, latest.current.zoom);
      canvas.setDimensions(
        {
          width: Math.round(fit.width * scale),
          height: Math.round(fit.height * scale),
        },
        { cssOnly: true },
      );
      canvas.calcOffset();
    };
    resizeRef.current = resize;

    // simpan posisi, ukuran, atau rotasi baru ke React state tiap selesai drag/resize di canvas
    const commitTransform = ({ target }: { target?: EditorObject }) => {
      if (!target?.placementId || renderingRef.current) return;
      const current = latest.current.composition;
      const geometry = templateGeometry(current.template);
      if (target.objectType === "text") {
        const next = current.texts.map((text) =>
          text.id === target.placementId
            ? normalizeText(
                {
                  ...text,
                  x: target.left,
                  y: target.top,
                  rotation: target.angle,
                  size: Math.round(text.size * target.scaleY),
                },
                geometry.width,
                geometry.height,
              )
            : text,
        );
        latest.current.onCommit({ ...current, texts: next });
        return;
      }
      const next = current.stickers.map((sticker) =>
        sticker.id === target.placementId
          ? {
              ...sticker,
              ...normalizeSticker(
                {
                  ...sticker,
                  x: target.left,
                  y: target.top,
                  rotation: target.angle,
                  size: target.getScaledWidth(),
                },
                geometry.width,
                geometry.height,
              ),
            }
          : sticker,
      );
      latest.current.onCommit({ ...current, stickers: next });
    };

    // baca objek apa yang lagi dipilih di Fabric lalu kasih tau Editor
    const readSelection = () => {
      if (renderingRef.current) return;
      const active = canvas.getActiveObject() as EditorObject | undefined;
      if (active?.placementId && active.objectType) {
        latest.current.onSelect({
          type: active.objectType,
          id: active.placementId,
        });
      } else {
        latest.current.onSelect(null);
      }
    };

    canvas.on("object:modified", commitTransform);
    canvas.on("selection:created", readSelection);
    canvas.on("selection:updated", readSelection);
    canvas.on("selection:cleared", readSelection);
    // dukung geser scroll vertikal di HP kalau user narik area kosong canvas pakai jari
    let panId: number | null = null;
    let panY = 0;
    const movePan = (event: PointerEvent) => {
      if (event.pointerId !== panId) return;
      container.scrollTop -= event.clientY - panY;
      panY = event.clientY;
    };
    const endPan = (event: PointerEvent) => {
      if (event.pointerId === panId) panId = null;
    };
    canvas.on("mouse:down", (options) => {
      const event = options.e as PointerEvent;
      if (options.target || event.pointerType !== "touch") return;
      panId = event.pointerId;
      panY = event.clientY;
    });
    window.addEventListener("pointermove", movePan, { passive: true });
    window.addEventListener("pointerup", endPan);
    window.addEventListener("pointercancel", endPan);
    const scrolled = () => canvas.calcOffset();
    container.addEventListener("scroll", scrolled, {
      passive: true,
    });

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    // bersihin semua observer, listener, instance Fabric, dan cache pas keluar dari editor
    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", scrolled);
      window.removeEventListener("pointermove", movePan);
      window.removeEventListener("pointerup", endPan);
      window.removeEventListener("pointercancel", endPan);
      resizeRef.current = () => {};
      canvas.off();
      canvasRef.current = null;
      void canvas.dispose();
      clearImageCache();
    };
  }, []);

  // sinkronin perubahan komposisi ke canvas; pakai jalur cepat kalau cuma properti stiker/teks yang berubah
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (renderedRef.current && !renderingRef.current) {
      const prev = renderedCompositionRef.current;
      // cek apakah foto, template, bingkai, filter, dan daftar id objek masih sama persis
      const isBaseIdentical =
        prev !== null &&
        renderedFrameRef.current === frame &&
        prev.template.id === composition.template.id &&
        prev.frameId === composition.frameId &&
        prev.photos.length === composition.photos.length &&
        prev.photos.every((p, i) => p === composition.photos[i]) &&
        JSON.stringify(prev.photoFilters) ===
          JSON.stringify(composition.photoFilters) &&
        prev.stickers.length === composition.stickers.length &&
        prev.stickers.every(
          (s, i) =>
            s.id === composition.stickers[i]?.id &&
            s.src === composition.stickers[i]?.src,
        ) &&
        prev.texts.length === composition.texts.length &&
        prev.texts.every(
          (t, i) =>
            t.id === composition.texts[i]?.id &&
            Boolean(t.text.trim()) ===
              Boolean(composition.texts[i]?.text.trim()),
        );

      // kalau dasar strip gak berubah, cukup update koordinat/gaya objek yang sudah ada biar mulus tanpa kedip
      if (isBaseIdentical) {
        let updatedAny = false;
        let allObjectsExist = true;
        const geometry = templateGeometry(composition.template);

        for (const placement of composition.stickers) {
          const target = findObject(canvas, {
            type: "sticker",
            id: placement.id,
          });
          if (target && "width" in target && typeof target.width === "number") {
            const sticker = normalizeSticker(
              placement,
              geometry.width,
              geometry.height,
            );
            const scale = sticker.size / target.width;
            target.set({
              left: sticker.x,
              top: sticker.y,
              scaleX: scale,
              scaleY: scale,
              angle: sticker.rotation,
              opacity: placement.opacity ?? 1,
              flipX: placement.flipX ?? false,
              flipY: placement.flipY ?? false,
            });
            target.setCoords();
            updatedAny = true;
          } else {
            allObjectsExist = false;
          }
        }

        for (const placement of composition.texts) {
          // teks kosong atau spasi saja tidak dirender di canvas
          if (!placement.text.trim()) continue;
          const target = findObject(canvas, { type: "text", id: placement.id });
          if (target) {
            const text = normalizeText(
              placement,
              geometry.width,
              geometry.height,
            );
            target.set({
              text: text.text,
              left: text.x,
              top: text.y,
              fontSize: text.size,
              // reset skala ke 1 karena ukuran baru sudah disimpan langsung ke fontSize
              scaleX: 1,
              scaleY: 1,
              fontFamily: resolveTextFont(text.fontId),
              fill: text.color,
              textAlign: text.align,
              fontWeight: text.bold ? "700" : "400",
              fontStyle: text.italic ? "italic" : "normal",
              opacity: text.opacity,
              angle: text.rotation,
            });
            target.setCoords();
            // kalau font kustom baru dipilih dan belum selesai preload, render ulang begitu selesai dimuat
            const font = getTextFont(text.fontId);
            if (font && !isTextFontLoaded(font.family)) {
              void ensureTextFontLoaded(font).then(() => {
                if (canvasRef.current !== canvas) return;
                if (
                  "initDimensions" in target &&
                  typeof target.initDimensions === "function"
                ) {
                  target.initDimensions();
                }
                target.set("dirty", true);
                target.setCoords();
                canvas.requestRenderAll();
              });
            }
            updatedAny = true;
          } else {
            allObjectsExist = false;
          }
        }

        if (
          allObjectsExist &&
          (updatedAny || composition.texts.every((t) => !t.text.trim()))
        ) {
          renderedCompositionRef.current = composition;
          renderedFrameRef.current = frame;
          canvas.requestRenderAll();
          return;
        }
      }
    }

    // jalur render penuh kalau ada perubahan bingkai, filter, foto, atau tambah/hapus objek
    const controller = new AbortController();
    const id = renderId.current + 1;
    renderId.current = id;
    let active = true;
    if (!renderedRef.current) setStatus("loading");
    renderingRef.current = true;
    void renderComposition(canvas, composition, frame, controller.signal, true)
      .then(() => {
        if (!active || id !== renderId.current) return;
        resizeRef.current();
        const current = latest.current.selection;
        const object = current ? findObject(canvas, current) : undefined;
        if (object) canvas.setActiveObject(object);
        else canvas.discardActiveObject();
        renderingRef.current = false;
        renderedRef.current = true;
        renderedCompositionRef.current = composition;
        renderedFrameRef.current = frame;
        canvas.requestRenderAll();
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (id !== renderId.current) return;
        renderingRef.current = false;
        if (!active) return;
        console.error("[editor] preview render failed", error);
        setStatus("error");
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [composition, frame, revision]);

  // perbarui skala tampilan canvas tiap kali zoom atau mode fitWhole berubah
  useEffect(() => {
    resizeRef.current();
  }, [zoom, fitWhole]);

  // samain seleksi aktif di Fabric tiap kali user milih layer dari sidebar
  useEffect(() => {
    if (status !== "ready" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const object = selection ? findObject(canvas, selection) : undefined;
    if (object) canvas.setActiveObject(object);
    else canvas.discardActiveObject();
    canvas.requestRenderAll();
  }, [selection, status]);

  return [
    elementRef,
    containerRef,
    {
      status,
      retry: () => {
        setStatus("loading");
        setRevision((value) => value + 1);
      },
    },
  ] as const;
}
