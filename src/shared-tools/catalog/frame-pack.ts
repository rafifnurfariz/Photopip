import { textFonts } from "@/shared-tools/catalog/fonts";
import { templates, type TemplateId } from "@/shared-tools/catalog/templates";
import { templateGeometry } from "@/shared-tools/composition/geometry";

/** A frame pack discovered under `public/assets/frame-packs/<id>/`. */
export interface FramePackFrame {
  id: string;
  name: string;
  textColor: string;
  fontId: string;
  backgroundColor: string;
  /** Optional cache-busted URL of the square cover. The card uses artwork. */
  preview?: string;
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

export interface FrameManifest {
  name?: string;
  textColor?: string;
  fontId?: string;
  backgroundColor?: string;
}

export type ManifestParseResult =
  | { ok: true; manifest: FrameManifest }
  | { ok: false; message: string };

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

export const MAX_PACK_ID_LENGTH = 40;
export const MAX_MANIFEST_BYTES = 16 * 1024;
export const PNG_HEADER_BYTES = 24;
const MIN_PREVIEW_EDGE = 64;
const MAX_PREVIEW_EDGE = 2048;
export const LARGE_ARTWORK_BYTES = 8 * 1024 * 1024;
export const LARGE_PREVIEW_BYTES = 1024 * 1024;

const DEFAULT_TEXT_COLOR = "#20231f";
const DEFAULT_BACKGROUND_COLOR = "#ffffff";
const DEFAULT_FONT_ID = "app";

const packIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const hexColorPattern = /^#[0-9a-f]{6}$/i;
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

export function isValidPackId(id: string): boolean {
  return (
    id.length > 0 && id.length <= MAX_PACK_ID_LENGTH && packIdPattern.test(id)
  );
}

export function isHexColor(value: string): boolean {
  return hexColorPattern.test(value);
}

/** Humanizes a folder id when `frame.json` does not provide a name. */
export function nameFromPackId(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function packDefaults(id: string) {
  return {
    name: nameFromPackId(id),
    textColor: DEFAULT_TEXT_COLOR,
    fontId: DEFAULT_FONT_ID,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
  };
}

export function parseFrameManifest(raw: string): ManifestParseResult {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, message: "frame.json is not valid JSON" };
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, message: "frame.json must contain a JSON object" };
  }

  const record = value as Record<string, unknown>;
  const manifest: FrameManifest = {};

  if (record.name !== undefined) {
    if (typeof record.name !== "string") {
      return { ok: false, message: "frame.json name must be a string" };
    }
    const name = record.name.trim();
    if (name.length === 0 || name.length > 60) {
      return {
        ok: false,
        message: "frame.json name must be 1-60 characters",
      };
    }
    manifest.name = name;
  }

  if (record.textColor !== undefined) {
    if (typeof record.textColor !== "string" || !isHexColor(record.textColor)) {
      return { ok: false, message: "frame.json textColor must be #rrggbb" };
    }
    manifest.textColor = record.textColor;
  }

  if (record.backgroundColor !== undefined) {
    if (
      typeof record.backgroundColor !== "string" ||
      !isHexColor(record.backgroundColor)
    ) {
      return {
        ok: false,
        message: "frame.json backgroundColor must be #rrggbb",
      };
    }
    manifest.backgroundColor = record.backgroundColor;
  }

  if (record.fontId !== undefined) {
    if (
      typeof record.fontId !== "string" ||
      !textFonts.some((font) => font.id === record.fontId)
    ) {
      return {
        ok: false,
        message: "frame.json fontId must be app, serif, sans, mono or display",
      };
    }
    manifest.fontId = record.fontId;
  }

  return { ok: true, manifest };
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

export function validatePreviewSize(size: PngSize): string | null {
  if (size.width < MIN_PREVIEW_EDGE || size.height < MIN_PREVIEW_EDGE) {
    return `preview.png must be at least ${MIN_PREVIEW_EDGE}x${MIN_PREVIEW_EDGE}`;
  }
  if (size.width > MAX_PREVIEW_EDGE || size.height > MAX_PREVIEW_EDGE) {
    return `preview.png must be at most ${MAX_PREVIEW_EDGE}x${MAX_PREVIEW_EDGE}`;
  }
  return null;
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
  manifest: FrameManifest;
  preview?: string;
  artwork: Record<TemplateId, string>;
}): FramePackFrame {
  const defaults = packDefaults(input.id);
  return {
    id: input.id,
    name: input.manifest.name ?? defaults.name,
    textColor: input.manifest.textColor ?? defaults.textColor,
    fontId: input.manifest.fontId ?? defaults.fontId,
    backgroundColor: input.manifest.backgroundColor ?? defaults.backgroundColor,
    preview: input.preview,
    artwork: input.artwork,
  };
}
