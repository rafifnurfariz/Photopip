import sharp from "sharp";
import { templates, type TemplateId } from "@/shared-tools/catalog/templates";
import { templateGeometry } from "@/shared-tools/composition/geometry";

/** A frame pack discovered under `public/assets/frame-packs/<id>/`. */
export interface FramePackFrame {
  id: string;
  name: string;
  textColor: string;
  fontId: string;
  backgroundColor: string;
  /** Cache-busted front-layer artwork URL for every print template. */
  artwork: Record<TemplateId, string>;
}

type FramePackDiagnosticLevel = "warning" | "error";

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

const MAX_PACK_ID_LENGTH = 60;
export const PNG_HEADER_BYTES = 24;
export const LARGE_ARTWORK_BYTES = 8 * 1024 * 1024;

const THEME_SAMPLE_SIZE = 32;
const OPAQUE_ALPHA = 128;
// WCAG relative luminance above which dark text stays readable.
const LIGHT_TEXT_LUMINANCE = 0.179;

const DEFAULT_TEXT_COLOR = "#20231f";
const DEFAULT_BACKGROUND_COLOR = "#ffffff";
const DEFAULT_FONT_ID = "app";

export const DEFAULT_THEME: FrameTheme = {
  textColor: DEFAULT_TEXT_COLOR,
  fontId: DEFAULT_FONT_ID,
  backgroundColor: DEFAULT_BACKGROUND_COLOR,
};

const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/**
 * Print-pixel artwork required for each template. Derived from geometry so a
 * layout change automatically updates the scanner contract. The single layout
 * uses `single.png`: `1x1.png` is a tracking-pixel name that browser filters
 * can block.
 */
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

/**
 * Turns any folder name into a URL-safe pack id. Returns null when nothing
 * usable remains or the result would be longer than `MAX_PACK_ID_LENGTH`.
 */
export function packIdFromFolder(name: string): string | null {
  const id = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (id.length === 0 || id.length > MAX_PACK_ID_LENGTH) return null;
  return id;
}

/** Humanizes a pack id into a display name. */
export function nameFromPackId(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function channelToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

/**
 * Derives a pack theme from its artwork: the most common opaque color becomes
 * the strip background, and footer text flips between dark and white to stay
 * readable. Packs ship no manifest, so this replaces the old `frame.json`.
 */
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

  let best: { count: number; r: number; g: number; b: number } | null = null;
  for (const bucket of buckets.values()) {
    if (!best || bucket.count > best.count) best = bucket;
  }
  if (!best) return DEFAULT_THEME;

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

/** Reads width and height from a PNG IHDR chunk without decoding pixels. */
export function readPngSize(bytes: Uint8Array): PngSize | null {
  if (bytes.length < PNG_HEADER_BYTES) return null;
  for (let index = 0; index < pngSignature.length; index += 1) {
    if (bytes[index] !== pngSignature[index]) return null;
  }
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

/** Appends file metadata so replacing artwork busts the browser image cache. */
export function packFileUrl(
  id: string,
  file: string,
  stats: { mtimeMs: number; size: number },
): string {
  return `/assets/frame-packs/${id}/${file}?v=${Math.round(stats.mtimeMs)}-${stats.size}`;
}

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
