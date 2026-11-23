"use client";

// deretan kotak thumbnail foto di panel studio (filmstrip)
// nampilin slot kosong bernomor urut atau foto yang sudah terambil lengkap sama tombol retake
import type { CSSProperties } from "react";
import { RetakeIcon } from "@/components/icons";
import { useLanguage } from "@/translations/use-language";

interface FilmStripProps {
  photos: string[];
  photoCount: number;
  retakeIndex: number | null;
  busy: boolean;
  onRetake: (index: number) => void;
}

export function FilmStrip({
  photos,
  photoCount,
  retakeIndex,
  busy,
  onRetake,
}: FilmStripProps) {
  const { t } = useLanguage();
  return (
    <div
      className="film-grid"
      style={
        {
          // kalau jumlah foto lebih dari 4 (kayak grid 2x3), susun jadi 3 kolom biar rapi
          "--film-columns": photoCount > 4 ? 3 : photoCount,
        } as CSSProperties
      }
      aria-label={t.capture.previewTitle}
    >
      {Array.from({ length: photoCount }, (_, index) => (
        <div
          key={index}
          className={`photo-slot ${retakeIndex === index ? "retaking" : ""}`}
        >
          {/* kalau slot sudah ada fotonya tampilkan gambar + tombol ambil ulang, kalau belum tampilkan nomor 01, 02... */}
          {photos[index] ? (
            <>
              <img
                key={photos[index]}
                src={photos[index]}
                alt={`${t.capture.progress} ${index + 1}`}
              />
              <button
                type="button"
                className="slot-retake"
                disabled={busy}
                onClick={() => onRetake(index)}
                aria-label={`${t.capture.retake} ${index + 1}`}
                title={`${t.capture.retake} ${index + 1}`}
              >
                <span className="retake-badge" aria-hidden="true">
                  <RetakeIcon />
                </span>
              </button>
            </>
          ) : (
            <span>{String(index + 1).padStart(2, "0")}</span>
          )}
        </div>
      ))}
    </div>
  );
}
