export function nextTabIndex(
  count: number,
  current: number,
  key: string,
): number | null {
  if (count === 0 || current < 0) return null;
  switch (key) {
    case "ArrowLeft":
      return (current - 1 + count) % count;
    case "ArrowRight":
      return (current + 1) % count;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return null;
  }
}
