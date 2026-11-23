// state dan reducer buat sesi ambil foto di studio
// nyimpen template aktif, array foto yang sudah dijepret, sama index foto kalau lagi retake
import type { TemplateId } from "@/shared-tools/catalog/templates";

// struktur data satu sesi foto booth
export interface Session {
  templateId: TemplateId;
  photos: string[];
  retakeIndex: number | null;
}

// aksi yang bisa ngubah state sesi foto
export type SessionAction =
  | { type: "capture"; src: string; count: number }
  | { type: "retake"; index: number }
  | { type: "reset"; templateId?: TemplateId };

// kondisi awal sesi waktu halaman baru dibuka
export const initialSession: Session = {
  templateId: "4x1",
  photos: [],
  retakeIndex: null,
};

// reducer murni buat update sesi tanpa ngubah state lama secara langsung
export function sessionReducer(state: Session, action: SessionAction): Session {
  // reset sesi: kosongin semua foto, ganti template kalau dikirim
  if (action.type === "reset")
    return {
      ...initialSession,
      templateId: action.templateId ?? state.templateId,
    };
  // tandain slot foto mana yang mau diambil ulang
  if (action.type === "retake")
    return action.index >= 0 && action.index < state.photos.length
      ? { ...state, retakeIndex: action.index }
      : state;
  if (!action.src) return state;
  // kalau lagi mode retake, timpa foto di posisi retakeIndex aja
  if (state.retakeIndex !== null) {
    const photos = [...state.photos];
    photos[state.retakeIndex] = action.src;
    return { ...state, photos, retakeIndex: null };
  }
  // kalau slot sudah penuh, abaikan jepretan tambahan
  if (state.photos.length >= action.count) return state;
  return { ...state, photos: [...state.photos, action.src] };
}
