const MAX_EDGE = 2000;
const MAX_STICKER_EDGE = 1200;
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_SOURCE_PIXELS = 40_000_000;
const IMAGE_EXTENSION = /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|webp)$/i;

function isImageFile(file: File) {
  return file.type.startsWith("image/") || IMAGE_EXTENSION.test(file.name);
}

export function isSupportedPhotoFile(file: File) {
  return isImageFile(file) && file.size <= MAX_FILE_BYTES;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  const { promise, resolve, reject } =
    Promise.withResolvers<HTMLImageElement>();
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error("Image could not load"));
  image.src = src;
  return promise;
}

export async function readPhotoFile(file: File): Promise<string> {
  if (!isImageFile(file)) throw new Error("Unsupported image file");
  if (file.size > MAX_FILE_BYTES) throw new Error("Image file is too large");
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (!width || !height) throw new Error("Image has no dimensions");
    if (width * height > MAX_SOURCE_PIXELS)
      throw new Error("Image dimensions are too large");
    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.92);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function readStickerFile(file: File): Promise<string> {
  if (!isImageFile(file)) throw new Error("Unsupported image file");
  if (file.size > MAX_FILE_BYTES) throw new Error("Image file is too large");
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (!width || !height) throw new Error("Image has no dimensions");
    if (width * height > MAX_SOURCE_PIXELS)
      throw new Error("Image dimensions are too large");
    const scale = Math.min(1, MAX_STICKER_EDGE / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}
