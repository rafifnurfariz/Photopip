import {
  Canvas,
  FabricImage,
  FabricText,
  Rect,
  StaticCanvas,
  filters,
  type FabricObject,
} from "fabric";
import { resolveTextFont } from "@/shared-tools/catalog/fonts";
import type { ThemePreset } from "@/shared-tools/catalog/themes";
import { backgroundFill } from "./background-fill";
import { coverCrop, normalizeSticker, templateGeometry } from "./geometry";
import { normalizeText } from "./text";
import type { Composition, PhotoFilterId } from "./types";

export type EditorObject = FabricObject & {
  placementId?: string;
  objectType?: "sticker" | "text";
};

// Shared Fabric options: the same anchors and handles on every object.
const TOP_LEFT = { originX: "left", originY: "top" } as const;
const CENTER = { originX: "center", originY: "center" } as const;
const STATIC_OBJECT = { selectable: false, evented: false } as const;
const EDIT_HANDLES = {
  cornerSize: 18,
  touchCornerSize: 30,
  transparentCorners: false,
  cornerColor: "#20231f",
  borderColor: "#20231f",
  lockScalingFlip: true,
} as const;

const IMAGE_CACHE_LIMIT = 24;
const imageCache = new Map<string, HTMLImageElement>();

function cacheImage(src: string, image: HTMLImageElement) {
  if (imageCache.size >= IMAGE_CACHE_LIMIT) {
    const oldest = imageCache.keys().next().value;
    if (oldest) imageCache.delete(oldest);
  }
  imageCache.set(src, image);
}

/**
 * Decorative layers must never block the strip. A missing pack PNG is skipped
 * with a warning; only cancellation still stops the render.
 */
function optionalImage(
  src: string,
  signal?: AbortSignal,
): Promise<HTMLImageElement | null> {
  return loadImage(src, signal).catch((error: unknown) => {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    console.warn(`[render] skipped decorative image: ${src}`, error);
    return null;
  });
}

function loadImage(
  src: string,
  signal?: AbortSignal,
): Promise<HTMLImageElement> {
  if (signal?.aborted) {
    return Promise.reject(new DOMException("Cancelled", "AbortError"));
  }
  const cached = imageCache.get(src);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve, reject) => {
    const image = new Image();
    const cleanup = () => {
      clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      signal?.removeEventListener("abort", abort);
    };
    const abort = () => {
      cleanup();
      image.src = "";
      reject(new DOMException("Cancelled", "AbortError"));
    };
    const timer = setTimeout(() => {
      cleanup();
      image.src = "";
      reject(new Error("Image load timeout"));
    }, 10000);
    image.onload = () => {
      cleanup();
      cacheImage(src, image);
      resolve(image);
    };
    image.onerror = () => {
      cleanup();
      reject(new Error("Image could not load"));
    };
    signal?.addEventListener("abort", abort, { once: true });
    image.src = src;
  });
}

function applyPhotoFilter(image: FabricImage, id: PhotoFilterId) {
  const list: FabricImage["filters"] = [];
  switch (id) {
    case "bw":
      list.push(new filters.Grayscale());
      break;
    case "warm":
      list.push(
        new filters.BlendColor({ color: "#ffb37a", mode: "tint", alpha: 0.18 }),
      );
      list.push(new filters.Brightness({ brightness: 0.03 }));
      break;
    case "cool":
      list.push(
        new filters.BlendColor({ color: "#7ab8ff", mode: "tint", alpha: 0.18 }),
      );
      break;
    case "vintage":
      list.push(new filters.Vintage());
      break;
    case "fade":
      list.push(new filters.Saturation({ saturation: -0.35 }));
      list.push(new filters.Brightness({ brightness: 0.08 }));
      break;
    default:
      return;
  }
  image.filters = list;
  image.applyFilters();
}

/**
 * Canvas text never requests a webfont on its own, so the first draw would use a
 * fallback face. Ask for the stacks in use first; the export path shares this.
 */
async function loadCaptionFonts(texts: Composition["texts"]) {
  if (typeof document === "undefined" || !document.fonts) return;
  const sample = texts.map((text) => text.text).join("") || "A";
  const families = new Set(texts.map((text) => resolveTextFont(text.fontId)));
  await Promise.all(
    [...families].map((family) =>
      document.fonts.load(`400 32px ${family}`, sample),
    ),
  );
  await document.fonts.ready;
}

export async function renderComposition(
  canvas: Canvas | StaticCanvas,
  composition: Composition,
  theme: ThemePreset,
  signal?: AbortSignal,
  interactive = false,
) {
  const geometry = templateGeometry(composition.template);
  if (composition.photos.length !== composition.template.photoCount)
    throw new Error("Incomplete composition");
  const artworkSrc = theme.artwork?.[composition.template.id];
  const [photos, stickerImages, artworkImage, logoImage] = await Promise.all([
    Promise.all(composition.photos.map((src) => loadImage(src, signal))),
    Promise.all(
      composition.stickers.map((sticker) => loadImage(sticker.src, signal)),
    ),
    artworkSrc ? optionalImage(artworkSrc, signal) : Promise.resolve(null),
    loadImage("/assets/brand/logo.png", signal),
  ]);
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
  await loadCaptionFonts(composition.texts ?? []);
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
  canvas.clear();
  canvas.setDimensions({ width: geometry.width, height: geometry.height });
  canvas.backgroundImage = undefined;
  canvas.backgroundColor = backgroundFill(
    theme.background,
    geometry.width,
    geometry.height,
  );
  const frame = theme.frame;
  // Frames sit around the photos, never as an opaque overlay hiding them.
  if (frame) {
    const image = await optionalImage(frame.src, signal);
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
    if (image) {
      const frameObject = new FabricImage(image, {
        ...TOP_LEFT,
        left: 0,
        top: 0,
        ...STATIC_OBJECT,
      });
      frameObject.scaleX = geometry.width / image.width;
      frameObject.scaleY = geometry.height / image.height;
      canvas.add(frameObject);
    }
  }
  photos.forEach((image, index) => {
    const slot = geometry.slots[index];
    const crop = coverCrop(image.width, image.height, slot);
    const photo = new FabricImage(image, {
      ...TOP_LEFT,
      left: slot.x,
      top: slot.y,
      cropX: crop.cropX,
      cropY: crop.cropY,
      width: crop.width,
      height: crop.height,
      scaleX: crop.scale,
      scaleY: crop.scale,
      ...STATIC_OBJECT,
    });
    applyPhotoFilter(photo, composition.photoFilters?.[index] ?? "none");
    canvas.add(photo);
    if (frame?.slotStroke)
      canvas.add(
        new Rect({
          ...TOP_LEFT,
          left: slot.x,
          top: slot.y,
          width: slot.width,
          height: slot.height,
          fill: "transparent",
          stroke: frame.slotStroke,
          strokeWidth: 3,
          ...STATIC_OBJECT,
        }),
      );
  });
  // Pack artwork is the front layer: transparent pixels reveal the photo below,
  // while opaque pixels define the photo shape or add decoration above it.
  if (artworkImage) {
    const artwork = new FabricImage(artworkImage, {
      ...TOP_LEFT,
      left: 0,
      top: 0,
      ...STATIC_OBJECT,
    });
    artwork.scaleX = geometry.width / artworkImage.width;
    artwork.scaleY = geometry.height / artworkImage.height;
    canvas.add(artwork);
  }
  const logoScale = (geometry.footer * 1.2) / logoImage.height;
  canvas.add(
    new FabricImage(logoImage, {
      ...CENTER,
      left: geometry.width / 2,
      top: geometry.height - geometry.margin - geometry.footer / 2,
      scaleX: logoScale,
      scaleY: logoScale,
      ...STATIC_OBJECT,
    }),
  );
  stickerImages.forEach((image, index) => {
    const placement = composition.stickers[index];
    const sticker = normalizeSticker(
      placement,
      geometry.width,
      geometry.height,
    );
    const object = new FabricImage(image, {
      ...CENTER,
      left: sticker.x,
      top: sticker.y,
      scaleX: sticker.size / image.width,
      scaleY: sticker.size / image.width,
      angle: sticker.rotation,
      opacity: placement.opacity ?? 1,
      flipX: placement.flipX ?? false,
      flipY: placement.flipY ?? false,
      selectable: interactive,
      evented: interactive,
      ...EDIT_HANDLES,
    }) as EditorObject;
    object.placementId = placement.id;
    object.objectType = "sticker";
    canvas.add(object);
  });
  (composition.texts ?? []).forEach((placement) => {
    if (!placement.text.trim()) return;
    const text = normalizeText(placement, geometry.width, geometry.height);
    const object = new FabricText(text.text, {
      ...CENTER,
      left: text.x,
      top: text.y,
      fontSize: text.size,
      fontFamily: resolveTextFont(text.fontId),
      fill: text.color,
      textAlign: text.align,
      fontWeight: text.bold ? "700" : "400",
      fontStyle: text.italic ? "italic" : "normal",
      opacity: text.opacity,
      angle: text.rotation,
      selectable: interactive,
      evented: interactive,
      ...EDIT_HANDLES,
    }) as EditorObject;
    object.placementId = placement.id;
    object.objectType = "text";
    canvas.add(object);
  });
  canvas.renderAll();
}
