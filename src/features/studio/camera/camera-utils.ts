// kumpulan helper kamera: mapping error browser, matiin stream, nunggu frame video, sama jepret ke JPEG
// dipisah dari useCamera biar logika murninya gampang dites di Vitest
export type CameraFailure =
  | "denied"
  | "missing"
  | "busy"
  | "unavailable"
  | "readiness"
  | "capture";

// kelompokin error dari getUserMedia jadi kode CameraFailure biar pesannya jelas buat user
export function cameraFailure(error: unknown): CameraFailure {
  if (error instanceof DOMException) {
    if (["NotAllowedError", "SecurityError"].includes(error.name))
      return "denied";
    if (["NotFoundError", "OverconstrainedError"].includes(error.name))
      return "missing";
    if (["NotReadableError", "AbortError"].includes(error.name)) return "busy";
  }
  return "unavailable";
}

// hentikan semua track video di MediaStream supaya lampu kamera mati beneran
export function stopMediaStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

// cek elemen <video> sudah punya gambar dengan lebar dan tinggi valid
export function hasUsableFrame(video: HTMLVideoElement) {
  return video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0;
}

// tunggu sampai kamera ngirim frame video pertama, dengan batas timeout dan dukungan batal
export function waitForVideoFrame(
  video: HTMLVideoElement,
  signal: AbortSignal,
  timeout = 10000,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let frameId: number | undefined;
    // copot semua listener dan timer pas selesai atau dibatalin
    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener("loadeddata", check);
      video.removeEventListener("canplay", check);
      signal.removeEventListener("abort", abort);
      if (frameId !== undefined) video.cancelVideoFrameCallback?.(frameId);
    };
    const finish = () => {
      cleanup();
      resolve();
    };
    const abort = () => {
      cleanup();
      reject(new DOMException("Cancelled", "AbortError"));
    };
    // kalau video sudah siap, tunggu 1 frame beneran lewat requestVideoFrameCallback bila tersedia
    const check = () => {
      if (hasUsableFrame(video)) {
        if (video.requestVideoFrameCallback) {
          if (frameId === undefined)
            frameId = video.requestVideoFrameCallback(finish);
        } else finish();
      }
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Video readiness timeout"));
    }, timeout);
    video.addEventListener("loadeddata", check);
    video.addEventListener("canplay", check);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    else check();
  });
}

// tangkap satu frame dari elemen <video> ke canvas lalu ubah jadi data URL JPEG
export function capturePhotoFromVideo(
  video: HTMLVideoElement,
  flipHorizontal = true,
): string {
  if (!hasUsableFrame(video)) throw new Error("No usable video frame");
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  // balik gambar secara horizontal kalau mode mirror lagi nyala
  if (flipHorizontal) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }
  context.drawImage(video, 0, 0);
  const result = canvas.toDataURL("image/jpeg", 0.95);
  if (!result.startsWith("data:image/jpeg")) throw new Error("Capture failed");
  return result;
}
