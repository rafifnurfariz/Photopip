// tumpukan riwayat undo dan redo buat editor strip foto (maksimal 40 langkah)
// semua fungsinya murni tanpa mutasi array biar state React aman
import type { Composition } from "@/shared-tools/composition/types";

const HISTORY_LIMIT = 40;

// simpan daftar kondisi sebelum (past) dan sesudah undo (future)
export interface HistoryState {
  past: Composition[];
  future: Composition[];
}

export const initialHistory: HistoryState = { past: [], future: [] };

// catet perubahan baru ke past dan hapus future karena alur editan bercabang baru
export function pushHistory(
  state: HistoryState,
  current: Composition,
): HistoryState {
  return {
    past: [...state.past.slice(-(HISTORY_LIMIT - 1)), current],
    future: [],
  };
}

// mundur satu langkah ke kondisi sebelumnya, simpan kondisi sekarang ke future buat redo
export function undoHistory(
  state: HistoryState,
  current: Composition,
): { state: HistoryState; next: Composition } | null {
  const next = state.past[state.past.length - 1];
  if (!next) return null;
  return {
    next,
    state: {
      past: state.past.slice(0, -1),
      future: [current, ...state.future].slice(0, HISTORY_LIMIT),
    },
  };
}

// maju lagi satu langkah dari future kalau user batalin undo
export function redoHistory(
  state: HistoryState,
  current: Composition,
): { state: HistoryState; next: Composition } | null {
  const next = state.future[0];
  if (!next) return null;
  return {
    next,
    state: {
      past: [...state.past.slice(-(HISTORY_LIMIT - 1)), current],
      future: state.future.slice(1),
    },
  };
}
