// registry font teks yang dipakai di editor dan renderer canvas
// nyimpen daftar font hasil fetch dari /api/fonts supaya gampang dicari berdasarkan id
export interface TextFont {
  id: string;
  name: string;
  src: string;
  family: string;
}

// font cadangan kalau id font gak ketemu di registry
const FALLBACK_FONT_FAMILY = "sans-serif";

// tempat nyimpen sementara semua font yang sudah didaftarin dan status pemuatannya
const registeredFonts = new Map<string, TextFont>();
const loadedFamilies = new Set<string>();
const pendingFonts = new Map<string, Promise<void>>();

// masukin daftar font dari API ke Map biar bisa diakses renderer
export function registerTextFonts(fonts: TextFont[]) {
  for (const font of fonts) {
    registeredFonts.set(font.id, font);
  }
}

// cek apakah font family sudah selesai dimuat ke document.fonts
export function isTextFontLoaded(family: string): boolean {
  return loadedFamilies.has(family);
}

// muat satu file font ke FontFaceSet browser sekali saja (deduplikasi request paralel)
export function ensureTextFontLoaded(font: TextFont): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }
  if (loadedFamilies.has(font.family)) {
    return Promise.resolve();
  }
  const existing = pendingFonts.get(font.family);
  if (existing) {
    return existing;
  }
  const promise = (async () => {
    try {
      const fontFace = new FontFace(font.family, `url(${font.src})`);
      const loaded = await fontFace.load();
      document.fonts.add(loaded);
      loadedFamilies.add(font.family);
    } catch (error) {
      console.warn(`[fonts] Failed to load font face ${font.name}:`, error);
    } finally {
      pendingFonts.delete(font.family);
    }
  })();
  pendingFonts.set(font.family, promise);
  return promise;
}

// ambil detail satu font berdasarkan id-nya
export function getTextFont(id: string): TextFont | undefined {
  return registeredFonts.get(id);
}

// cari nama font-family CSS buat dipakai di FabricText, balik sans-serif kalau kosong
export function resolveTextFont(id: string): string {
  const font = registeredFonts.get(id);
  if (font?.family) {
    return font.family;
  }
  return FALLBACK_FONT_FAMILY;
}
