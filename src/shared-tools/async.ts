// helper timer async yang bisa dibatalin pakai AbortSignal
// dipakai di kamera pas lagi hitung mundur atau jeda foto otomatis
export function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    // kalau dibatalin di tengah jalan, bersihin timer lalu lempar AbortError
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException("Cancelled", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);
    signal.addEventListener("abort", abort, { once: true });
    // langsung batal kalau signal-nya sudah aborted dari awal
    if (signal.aborted) abort();
  });
}
