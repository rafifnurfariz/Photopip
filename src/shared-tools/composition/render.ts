// renderer utama Fabric.js yang nggambar seluruh strip foto di editor maupun pas ekspor
// urutan lapisannya: background -> foto (plus filter) -> bingkai PNG -> logo bawah -> stiker -> teks
import {
  Canvas,
  FabricImage,
  FabricText,
  StaticCanvas,
  filters,
  type FabricObject,
} from "fabric";
import {
  ensureTextFontLoaded,
  getTextFont,
  resolveTextFont,
} from "@/shared-tools/catalog/fonts";
import type { FramePreset } from "@/shared-tools/catalog/frames";
import { backgroundFill } from "./background-fill";
import { coverCrop, normalizeSticker, templateGeometry } from "./geometry";
import { normalizeText } from "./text";
import type { Composition, PhotoFilterId } from "./types";

// objek Fabric yang ditempelin id dan tipe biar bisa dilacak pas digeser atau dihapus
export type EditorObject = FabricObject & {
  placementId?: string;
  objectType?: "sticker" | "text";
};

// preset origin koordinat, objek statis yang gak bisa diklik, sama gaya handle seleksi
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

// cache LRU sederhana maksimal 24 gambar supaya gak fetch ulang tiap kali re-render
const IMAGE_CACHE_LIMIT = 24;
const imageCache = new Map<string, HTMLImageElement>();

// kosongin cache gambar (dipakai juga di unit test biar gak bocor antar test)
export function clearImageCache() {
  imageCache.clear();
}

// simpan gambar ke cache, buang yang paling lama dipakai kalau sudah penuh
function cacheImage(src: string, image: HTMLImageElement) {
  if (imageCache.size >= IMAGE_CACHE_LIMIT) {
    const oldest = imageCache.keys().next().value;
    if (oldest) imageCache.delete(oldest);
  }
  imageCache.set(src, image);
}

// muat gambar dekoratif kayak artwork bingkai; kalau gagal, skip aja asal bukan karena cancel/timeout
function optionalImage(
  src: string,
  signal?: AbortSignal,
): Promise<HTMLImageElement | null> {
  return loadImage(src, signal).catch((error: unknown) => {
    if (
      error instanceof DOMException &&
      (error.name === "AbortError" || error.name === "TimeoutError")
    )
      throw error;
    console.warn(`[render] skipped decorative image: ${src}`, error);
    return null;
  });
}

// muat HTMLImageElement pakai cache, timeout 10 detik, dan dukungan pembatalan AbortSignal
function loadImage(
  src: string,
  signal?: AbortSignal,
): Promise<HTMLImageElement> {
  if (signal?.aborted) {
    return Promise.reject(new DOMException("Cancelled", "AbortError"));
  }
  // kalau sudah ada di cache, pindahin ke urutan terbaru lalu langsung balikin
  const cached = imageCache.get(src);
  if (cached) {
    imageCache.delete(src);
    imageCache.set(src, cached);
    return Promise.resolve(cached);
  }
  // gabungin signal pembatalan dari luar sama timeout otomatis 10 detik
  const combined = signal
    ? AbortSignal.any([signal, AbortSignal.timeout(10000)])
    : AbortSignal.timeout(10000);
  return new Promise((resolve, reject) => {
    const image = new Image();
    const cleanup = () => {
      image.onload = null;
      image.onerror = null;
      combined.removeEventListener("abort", abort);
    };
    const abort = () => {
      cleanup();
      image.src = "";
      reject(
        combined.reason instanceof DOMException
          ? combined.reason
          : new DOMException("Cancelled", "AbortError"),
      );
    };
    image.onload = () => {
      cleanup();
      cacheImage(src, image);
      resolve(image);
    };
    image.onerror = () => {
      cleanup();
      reject(new Error("Image could not load"));
    };
    combined.addEventListener("abort", abort, { once: true });
    image.src = src;
  });
}

// pasang filter warna Fabric.js ke satu foto sesuai pilihan user
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

// gambar ulang seluruh komposisi strip ke canvas Fabric (interaktif di editor, statis saat ekspor)
export async function renderComposition(
  canvas: Canvas | StaticCanvas,
  composition: Composition,
  frame: FramePreset,
  signal?: AbortSignal,
  interactive = false,
) {
  const geometry = templateGeometry(composition.template);
  if (composition.photos.length !== composition.template.photoCount)
    throw new Error("Incomplete composition");
  // muat semua gambar (foto, stiker, artwork bingkai, dan logo brand) barengan biar cepat
  const artworkSrc = frame.artwork?.[composition.template.id];
  const [photos, stickerImages, artworkImage, logoImage] = await Promise.all([
    Promise.all(composition.photos.map((src) => loadImage(src, signal))),
    Promise.all(
      composition.stickers.map((sticker) => loadImage(sticker.src, signal)),
    ),
    artworkSrc ? optionalImage(artworkSrc, signal) : Promise.resolve(null),
    loadImage("/assets/brand/logo.png", signal),
  ]);
  if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
  // muat font kustom yang dipakai teks sebelum nggambar biar hurufnya gak jatuh ke font default
  if (typeof document !== "undefined" && document.fonts) {
    const fontPromises = (composition.texts ?? [])
      .map((text) => getTextFont(text.fontId))
      .filter((font): font is NonNullable<typeof font> => Boolean(font))
      .map((font) => ensureTextFontLoaded(font));
    await Promise.allSettled(fontPromises);
    await document.fonts.ready;
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
  }
  // bersihin canvas lama, set ukuran sesuai template, dan isi warna dasar bingkai
  canvas.clear();
  canvas.setDimensions({ width: geometry.width, height: geometry.height });
  canvas.backgroundImage = undefined;
  canvas.backgroundColor = backgroundFill(frame.background);
  // lapisan 1: taruh tiap foto ke slot masing-masing sambil di-crop tengah dan diberi filter
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
  });
  // lapisan 2: pasang gambar bingkai PNG di atas foto supaya nutup pinggirannya
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
  // lapisan 3: taruh logo PhotoPip di area footer bagian bawah strip
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
  // lapisan 4: gambar semua stiker yang ditaruh user, aktifin handle kalau mode editor
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
      scaleY: sticker.size / image.width, // shortcut: assumes square sticker src, fix if non-square stickers added
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
    if (interactive) {
      object.setControlsVisibility({
        ml: false,
        mr: false,
        mt: false,
        mb: false,
      });
    }
    canvas.add(object);
  });
  // lapisan 5: gambar semua teks keterangan di lapisan paling atas
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
    if (interactive) {
      object.setControlsVisibility({
        ml: false,
        mr: false,
        mt: false,
        mb: false,
      });
    }
    canvas.add(object);
  });
  canvas.renderAll();
}
