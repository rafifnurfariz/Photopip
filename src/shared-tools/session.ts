/**
 * PENGELOLA STATUS SESI (REDUCER)
 * Mengelola state foto yang terkumpul: menambah foto baru, mengganti foto
 * saat retake, dan mereset sesi saat pengguna ingin mengulang dari awal.
 */

import type { TemplateId } from "@/shared-tools/catalog/templates";

export interface Session {
  templateId: TemplateId;
  photos: string[];
  retakeIndex: number | null;
}

export type SessionAction =
  | { type: "capture"; src: string; count: number }
  | { type: "retake"; index: number }
  | { type: "reset"; templateId?: TemplateId };

export const initialSession: Session = {
  templateId: "4x1",
  photos: [],
  retakeIndex: null,
};

export function sessionReducer(state: Session, action: SessionAction): Session {
  if (action.type === "reset")
    return {
      ...initialSession,
      templateId: action.templateId ?? state.templateId,
    };
  if (action.type === "retake")
    return action.index >= 0 && action.index < state.photos.length
      ? { ...state, retakeIndex: action.index }
      : state;
  if (!action.src) return state;
  if (state.retakeIndex !== null) {
    const photos = [...state.photos];
    photos[state.retakeIndex] = action.src;
    return { ...state, photos, retakeIndex: null };
  }
  if (state.photos.length >= action.count) return state;
  return { ...state, photos: [...state.photos, action.src] };
}
