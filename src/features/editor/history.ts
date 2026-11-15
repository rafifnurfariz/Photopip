import type { Composition } from "@/shared-tools/composition/types";

const HISTORY_LIMIT = 40;

export interface HistoryState {
  past: Composition[];
  future: Composition[];
}

export const initialHistory: HistoryState = { past: [], future: [] };

export function pushHistory(
  state: HistoryState,
  current: Composition,
): HistoryState {
  return {
    past: [...state.past.slice(-(HISTORY_LIMIT - 1)), current],
    future: [],
  };
}

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
