// helper navigasi keyboard (panah kiri/kanan, Home, End) buat pindah tab di ToolRail
// bikin tab editor tetap bisa dioperasikan pakai keyboard sesuai standar aksesibilitas
export function nextTabIndex(
  count: number,
  current: number,
  key: string,
): number | null {
  if (count === 0 || current < 0) return null;
  switch (key) {
    // geser ke kiri dan muter balik ke tab terakhir kalau sudah di awal
    case "ArrowLeft":
      return (current - 1 + count) % count;
    // geser ke kanan dan muter balik ke tab pertama kalau sudah di ujung
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
