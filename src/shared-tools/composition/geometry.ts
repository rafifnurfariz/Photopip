import type { Slot } from "./types";

const VERTICAL_WIDTH = 600;
const GRID_WIDTH = 1200;
const MARGIN_RATIO = 0.045;
const GAP_RATIO = 0.025;
const FOOTER_RATIO = 0.12;
export const MIN_STICKER_SIZE = 30;

export function templateGeometry(template: {
  layout: "vertical" | "grid" | "single";
  aspectRatio: number;
  photoCount: number;
}) {
  const width = template.layout === "vertical" ? VERTICAL_WIDTH : GRID_WIDTH;
  const height = Math.round(width / template.aspectRatio);
  const margin = Math.round(width * MARGIN_RATIO);
  const gap = Math.round(width * GAP_RATIO);
  const columns = template.layout === "grid" ? 2 : 1;
  const rows = Math.ceil(template.photoCount / columns);
  const footer = Math.round(width * FOOTER_RATIO);
  const slotWidth = (width - margin * 2 - gap * (columns - 1)) / columns;
  const slotHeight = (height - margin * 2 - footer - gap * (rows - 1)) / rows;
  const slots: Slot[] = Array.from({ length: template.photoCount }, (_, i) => ({
    x: margin + (i % columns) * (slotWidth + gap),
    y: margin + Math.floor(i / columns) * (slotHeight + gap),
    width: slotWidth,
    height: slotHeight,
  }));
  return { width, height, margin, footer, slots };
}

export function fitCanvas(
  geometry: { width: number; height: number },
  availableWidth: number,
  availableHeight: number,
) {
  const safeWidth = Math.max(0, availableWidth);
  const safeHeight = Math.max(0, availableHeight);
  if (safeWidth <= 0 || safeHeight <= 0 || geometry.width <= 0) {
    return { width: 0, height: 0 };
  }
  const scale = Math.min(
    1,
    safeWidth / geometry.width,
    safeHeight / geometry.height,
  );
  return {
    width: Math.floor(geometry.width * scale),
    height: Math.floor(geometry.height * scale),
  };
}

export function coverCrop(imageWidth: number, imageHeight: number, slot: Slot) {
  const scale = Math.max(slot.width / imageWidth, slot.height / imageHeight);
  return {
    scale,
    cropX: (imageWidth - slot.width / scale) / 2,
    cropY: (imageHeight - slot.height / scale) / 2,
    width: slot.width / scale,
    height: slot.height / scale,
  };
}

export function normalizeSticker(
  placement: {
    x: number;
    y: number;
    size: number;
    rotation: number;
  },
  width: number,
  height: number,
) {
  return {
    x: Math.max(0, Math.min(width, placement.x)),
    y: Math.max(0, Math.min(height, placement.y)),
    size: Math.max(MIN_STICKER_SIZE, Math.min(width, placement.size)),
    rotation: ((placement.rotation % 360) + 360) % 360,
  };
}
