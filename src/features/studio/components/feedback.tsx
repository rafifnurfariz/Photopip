"use client";

// komponen toast notifikasi yang muncul kalau ada error atau pas unduhan mulai jalan
// beda gaya warna otomatis antara pesan error sama pesan info biasa
import { CloseIcon } from "@/components/icons";
import { useLanguage } from "@/translations/use-language";
import type { StudioMessage } from "../types";

// daftar kode pesan yang termasuk kategori error (ditampilin warna merah)
const ERROR_MESSAGES = new Set<StudioMessage>(["capture", "upload", "export"]);

export function Feedback({
  message,
  onDismiss,
}: {
  message: StudioMessage | null;
  onDismiss: () => void;
}) {
  const { t } = useLanguage();
  if (!message) return null;
  const isError = ERROR_MESSAGES.has(message);
  // ambil teks terjemahan yang pas sama kode pesannya
  const text =
    message === "capture"
      ? t.errors.camera.capture
      : message === "upload"
        ? t.errors.upload
        : message === "export"
          ? t.errors.export
          : t.app.downloadStarted;
  return (
    <p
      className={`feedback ${isError ? "error" : ""}`}
      role={isError ? "alert" : "status"}
    >
      <span>{text}</span>
      <button
        type="button"
        className="feedback-close"
        aria-label={t.app.dismiss}
        onClick={onDismiss}
      >
        <CloseIcon />
      </button>
    </p>
  );
}
