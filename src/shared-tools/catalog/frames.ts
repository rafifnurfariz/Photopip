// tipe data bingkai (FramePreset) dan fungsi helper buat nyari serta nerapin bingkai ke strip
// dipakai di studio, panel bingkai editor, sama renderer canvas
import type { TemplateId } from "@/shared-tools/catalog/templates";
import type { Composition } from "@/shared-tools/composition/types";

// warna latar belakang bingkai
export type FrameBackground = {
  type: "color";
  value: string;
  preview: string;
};

// struktur lengkap satu pilihan bingkai beserta peta gambar PNG-nya
export interface FramePreset {
  id: string;
  name: string;
  background: FrameBackground;
  artwork?: Partial<Record<TemplateId, string>>;
  textColor: string;
  fontId: string;
}

// daftar bingkai statis bawaan (kosong karena semua bingkai dimuat dinamis dari folder frame-packs)
export const framePresets: FramePreset[] = [];

// bingkai polos putih buat cadangan kalau id bingkai gak ketemu
const plainFrame: FramePreset = {
  id: "plain",
  name: "Plain",
  background: { type: "color", value: "#ffffff", preview: "#ffffff" },
  textColor: "#20231f",
  fontId: "app",
};

// cari bingkai berdasarkan id, balikin bingkai polos kalau gak ada yang cocok
export function frameById(
  id: string,
  frames: readonly FramePreset[] = framePresets,
): FramePreset {
  const found = frames.find((frame) => frame.id === id);
  if (found) return found;
  return plainFrame;
}

// cek semua teks di komposisi masih pakai warna dan font bawaan bingkai atau sudah diubah user
function frameMatches(composition: Composition, frame: FramePreset): boolean {
  return composition.texts.every(
    (text) => text.color === frame.textColor && text.fontId === frame.fontId,
  );
}

// ambil bingkai yang lagi aktif dipakai di komposisi (kalau masih sesuai bawaannya)
export function activeFrame(
  composition: Composition,
  frames: readonly FramePreset[] = framePresets,
): FramePreset | null {
  const frame = frames.find((item) => item.id === composition.frameId);
  if (!frame || !frameMatches(composition, frame)) return null;
  return frame;
}

// pasang bingkai baru ke komposisi sekaligus samain warna dan font teksnya
export function applyFrame(
  composition: Composition,
  frame: FramePreset,
): Composition {
  return {
    ...composition,
    frameId: frame.id,
    texts: composition.texts.map((text) => ({
      ...text,
      color: frame.textColor,
      fontId: frame.fontId,
    })),
  };
}
