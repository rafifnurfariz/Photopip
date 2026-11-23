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

// tempat nyimpen sementara semua font yang sudah didaftarin
const registeredFonts = new Map<string, TextFont>();

// masukin daftar font dari API ke Map biar bisa diakses renderer
export function registerTextFonts(fonts: TextFont[]) {
  for (const font of fonts) {
    registeredFonts.set(font.id, font);
  }
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
