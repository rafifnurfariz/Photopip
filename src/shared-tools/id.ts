// generator id unik sederhana buat stiker dan teks yang ditambahin user ke canvas
// pakai crypto.randomUUID kalau browser dukung, kalau nggak pakai cadangan timestamp
let counter = 0;

export function newId(): string {
  // utamakan UUID bawaan browser biar pasti unik
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
    return crypto.randomUUID();
  // cadangan buat environment lama atau jsdom tanpa randomUUID
  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
