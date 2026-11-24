// helper sisi server buat baca dimensi PNG dan ngambil warna tema paket bingkai
// dipakai sama scanner /api/frames untuk validasi folder frame-packs
import sharp from "sharp";
import { templates, type TemplateId } from "@/shared-tools/catalog/templates";
import { templateGeometry } from "@/shared-tools/composition/geometry";

// data satu paket bingkai hasil scan yang dikirim ke browser
export interface FramePackFrame {
  id: string;
  name: string;
  textColor: string;
  fontId: string;
  backgroundColor: string;
  artwork: Record<TemplateId, string>;
}

type FramePackDiagnosticLevel = "warning" | "error";

// catatan warning atau error kalau ada paket bingkai yang kurang pas
export interface FramePackDiagnostic {
  folder: string;
  level: FramePackDiagnosticLevel;
  code: string;
  message: string;
}

export interface FramePackResponse {
  frames: FramePackFrame[];
  diagnostics: FramePackDiagnostic[];
}

// warna teks, font, dan warna dasar yang diturunin dari artwork bingkai
export interface FrameTheme {
  textColor: string;
  fontId: string;
  backgroundColor: string;
}

export interface PngSize {
  width: number;
  height: number;
}

export interface TemplateArtworkSpec {
  id: TemplateId;
  file: string;
  width: number;
  height: number;
}

// batas panjang id, jumlah byte header PNG, dan ambang peringatan ukuran file (8MB)
const MAX_PACK_ID_LENGTH = 60;
export const PNG_HEADER_BYTES = 24;
export const LARGE_ARTWORK_BYTES = 8 * 1024 * 1024;

// konstanta sampling warna pakai sharp buat nentuin teks terang atau gelap
const THEME_SAMPLE_SIZE = 32;
const OPAQUE_ALPHA = 128;
const LIGHT_TEXT_LUMINANCE = 0.179;

const DEFAULT_TEXT_COLOR = "#20231f";
const DEFAULT_BACKGROUND_COLOR = "#ffffff";
const DEFAULT_FONT_ID = "app";

// tema cadangan kalau warna bingkai gagal dibaca
export const DEFAULT_THEME: FrameTheme = {
  textColor: DEFAULT_TEXT_COLOR,
  fontId: DEFAULT_FONT_ID,
  backgroundColor: DEFAULT_BACKGROUND_COLOR,
};

// 8 byte pertama wajib yang nandain file beneran berformat PNG
const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

// daftar 5 file PNG wajib beserta dimensi piksel yang harus dipenuhi tiap paket bingkai
export const templateArtworkSpecs: readonly TemplateArtworkSpec[] =
  templates.map((template) => {
    const geometry = templateGeometry(template);
    return {
      id: template.id,
      file: template.id === "1x1" ? "single.png" : `${template.id}.png`,
      width: geometry.width,
      height: geometry.height,
    };
  });

// ubah nama folder jadi slug id huruf kecil yang bersih, balikin null kalau gak valid
export function packIdFromFolder(name: string): string | null {
  const id = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (id.length === 0 || id.length > MAX_PACK_ID_LENGTH) return null;
  return id;
}

// ubah slug id kayak "retro-night" jadi judul rapi "Retro Night"
export function nameFromPackId(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// konversi nilai channel sRGB 0-255 ke linear buat hitung kecerahan warna
function channelToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

// hitung tingkat terang warna (luminance) buat milih warna teks kontras
function relativeLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

// ubah angka RGB jadi string kode hex kayak #ffffff
function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

// perkecil PNG bingkai jadi 32x32 lalu cari warna dominan buat tema background dan teks
export async function deriveFrameTheme(file: string): Promise<FrameTheme> {
  const { data } = await sharp(file)
    .resize(THEME_SAMPLE_SIZE, THEME_SAMPLE_SIZE, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // shortcut: 5-bit buckets merge near-identical shades; enough for solid
  // frame borders, upgrade to a real palette quantizer if art gets noisy.
  const buckets = new Map<
    number,
    { count: number; r: number; g: number; b: number }
  >();
  for (let index = 0; index < data.length; index += 4) {
    // abaikan piksel transparan (area lubang foto)
    if (data[index + 3] < OPAQUE_ALPHA) continue;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.count += 1;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
    } else {
      buckets.set(key, { count: 1, r, g, b });
    }
  }

  // pilih kelompok warna yang paling banyak muncul
  let best: { count: number; r: number; g: number; b: number } | null = null;
  for (const bucket of buckets.values()) {
    if (!best || bucket.count > best.count) best = bucket;
  }
  if (!best) return DEFAULT_THEME;

  // rata-ratain nilai RGB dari kelompok dominan lalu tentuin warna teks gelap/putih
  const r = best.r / best.count;
  const g = best.g / best.count;
  const b = best.b / best.count;
  return {
    backgroundColor: toHex(r, g, b),
    textColor:
      relativeLuminance(r, g, b) > LIGHT_TEXT_LUMINANCE
        ? DEFAULT_TEXT_COLOR
        : "#ffffff",
    fontId: DEFAULT_FONT_ID,
  };
}

// baca lebar dan tinggi gambar langsung dari 24 byte header IHDR file PNG
export function readPngSize(bytes: Uint8Array): PngSize | null {
  if (bytes.length < PNG_HEADER_BYTES) return null;
  // cocokin 8 byte signature PNG dulu
  for (let index = 0; index < pngSignature.length; index += 1) {
    if (bytes[index] !== pngSignature[index]) return null;
  }
  // pastiin chunk pertama adalah "IHDR"
  if (
    bytes[12] !== 0x49 ||
    bytes[13] !== 0x48 ||
    bytes[14] !== 0x44 ||
    bytes[15] !== 0x52
  ) {
    return null;
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const width = view.getUint32(16);
  const height = view.getUint32(20);
  if (width === 0 || height === 0) return null;
  return { width, height };
}

// susun URL gambar bingkai memakai nama folder asli yang di-encode biar gak 404 kalau ada spasi/huruf besar
export function packFileUrl(
  folder: string,
  file: string,
  stats: { mtimeMs: number; size: number },
): string {
  return `/assets/frame-packs/${encodeURIComponent(folder)}/${file}?v=${Math.round(stats.mtimeMs)}-${stats.size}`;
}

// gabungin id, tema warna, dan peta artwork jadi objek FramePackFrame utuh
export function createFramePackFrame(input: {
  id: string;
  theme: FrameTheme;
  artwork: Record<TemplateId, string>;
}): FramePackFrame {
  return {
    id: input.id,
    name: nameFromPackId(input.id),
    ...input.theme,
    artwork: input.artwork,
  };
}
