"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import type { ThemePreset } from "@/shared-tools/catalog/themes";
import {
  fitCanvas,
  normalizeSticker,
  templateGeometry,
} from "@/shared-tools/composition/geometry";
import { normalizeText } from "@/shared-tools/composition/text";
import {
  renderComposition,
  type EditorObject,
} from "@/shared-tools/composition/render";
import type { Composition } from "@/shared-tools/composition/types";

export interface CanvasSelection {
  type: "sticker" | "text";
  id: string;
}

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

/** The Fabric object that currently represents a panel selection. */
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
  theme: ThemePreset,
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
  const renderId = useRef(0);
  const resizeRef = useRef<() => void>(() => {});
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

    const resize = () => {
      const { width, height } = measure(container);
      const geometry = templateGeometry(latest.current.composition.template);
      // A 1:3 strip fitted to height on a phone is too narrow to edit, so the
      // stacked (mobile/tablet) editor fits the width and scrolls vertically.
      const tall = geometry.height > geometry.width * 1.5;
      const stacked = window.innerWidth <= 899;
      // "Fit whole strip" is a mobile review mode: both axes, no scrolling.
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
    // Touch screens: the stacked editor shows a strip taller than the stage.
    // The canvas owns the gesture (touch-action: none), so panning is manual:
    // a drag that starts on empty canvas scrolls the wrap, a drag that starts
    // on an object stays a Fabric object drag.
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
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const controller = new AbortController();
    const id = renderId.current + 1;
    renderId.current = id;
    let active = true;
    if (!renderedRef.current) setStatus("loading");
    renderingRef.current = true;
    void renderComposition(canvas, composition, theme, controller.signal, true)
      .then(() => {
        if (!active || id !== renderId.current) return;
        resizeRef.current();
        const current = latest.current.selection;
        const object = current ? findObject(canvas, current) : undefined;
        if (object) canvas.setActiveObject(object);
        else canvas.discardActiveObject();
        renderingRef.current = false;
        renderedRef.current = true;
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
  }, [composition, theme, revision]);

  useEffect(() => {
    resizeRef.current();
  }, [zoom, fitWhole]);

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
