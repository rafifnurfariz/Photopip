/**
 * Scroll offset that keeps `[start, start + size]` inside a viewport of `view`
 * pixels. A box already inside keeps the current offset, otherwise it is
 * centred (or aligned to its start when it is larger than the viewport).
 */
export function axisScroll(
  start: number,
  size: number,
  scroll: number,
  view: number,
) {
  if (start >= scroll && start + size <= scroll + view) return scroll;
  return Math.max(0, start - Math.max(0, (view - size) / 2));
}
