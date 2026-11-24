"use client";

// komponen utama halaman Studio yang nyambungin fase 1 (ambil/upload foto) sama fase 2 (editor)
// ngatur perpindahan mode, konfirmasi sesi baru, riwayat tombol back HP, sama ekspor hasil strip
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/translations/use-language";
import type { TemplateId } from "@/shared-tools/catalog/templates";
import { frameById } from "@/shared-tools/catalog/frames";
import type { Composition } from "@/shared-tools/composition/types";
import { useCamera } from "./camera/use-camera";
import { BoothStage } from "./components/booth-stage";
import { CaptureControls } from "./components/capture-controls";
import { ExportBar } from "./components/export-bar";
import { Feedback } from "./components/feedback";
import { FilmStrip } from "./components/film-strip";
import { TemplateSelector } from "./components/template-selector";
import { useCaptureSession } from "./hooks/use-capture-session";
import { useExport } from "./hooks/use-export";
import { useFrameCatalog } from "./hooks/use-frame-catalog";
import { fetchStickerCatalog } from "@/features/editor/hooks/use-sticker-catalog";
import type { StudioMessage } from "./types";

// teks loading singkat pas bundle editor Fabric.js lagi diunduh browser
function EditorLoading() {
  const { t } = useLanguage();
  return <p role="status">{t.app.processing}</p>;
}

// muat komponen Editor secara dinamis tanpa SSR biar Fabric.js cuma jalan di browser
const Editor = dynamic(() => import("@/features/editor/editor"), {
  ssr: false,
  loading: EditorLoading,
});

// state tahap halaman: lagi di studio ambil foto atau lagi masuk editor
type Stage =
  | { mode: "capture"; draft: Composition | null }
  | { mode: "edit"; draft: Composition };

export default function Studio() {
  const { t } = useLanguage();
  const [videoRef, camera] = useCamera();
  // pengaturan dasar kamera: mode cermin dan jeda hitung mundur (detik)
  const [mirror, setMirror] = useState(true);
  const [timer, setTimer] = useState(3);
  const [message, setMessage] = useState<StudioMessage | null>(null);
  const [stage, setStage] = useState<Stage>({ mode: "capture", draft: null });
  // nyimpen permintaan reset sementara sampai user klik konfirmasi di modal
  const [pendingReset, setPendingReset] = useState<{
    templateId?: TemplateId;
  } | null>(null);
  const confirmRef = useRef<HTMLDialogElement>(null);
  const uploadInput = useRef<HTMLInputElement>(null);
  // penanda apakah masuk editor tadi nambahin entry ke history browser (buat tombol Back HP)
  const historyEntry = useRef(false);
  const {
    session,
    template,
    complete,
    busy,
    remaining,
    flash,
    uploading,
    capture,
    cancelCapture,
    uploadPhotos,
    retake,
    resetSession,
  } = useCaptureSession({ camera, mirror, timer, onMessage: setMessage });
  const {
    format,
    setFormat,
    exporting,
    exportPhoto,
    cancel: cancelExport,
  } = useExport(setMessage);
  const frames = useFrameCatalog();

  // preload daftar stiker dari awal biar pas masuk editor gak nunggu lama
  useEffect(() => {
    void fetchStickerCatalog();
  }, []);

  // tutup otomatis toast "unduhan dimulai" setelah 3 detik
  useEffect(() => {
    if (message !== "downloaded") return;
    const id = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(id);
  }, [message]);

  // dengerin tombol Back browser di HP supaya balik ke fase studio, bukan keluar website
  useEffect(() => {
    const onPopState = () => {
      if (!historyEntry.current) return;
      historyEntry.current = false;
      setStage((previous) =>
        previous.mode === "edit"
          ? { mode: "capture", draft: previous.draft }
          : previous,
      );
      setMessage(null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // bersihin semua foto, batalin ekspor, dan balik ke awal studio
  const performReset = useCallback(
    (templateId?: TemplateId) => {
      resetSession(templateId);
      cancelExport();
      setStage({ mode: "capture", draft: null });
      setMessage(null);
      if (historyEntry.current) {
        historyEntry.current = false;
        window.history.back();
      }
    },
    [cancelExport, resetSession],
  );

  // kalau belum ada foto langsung reset aja, kalau sudah ada tampilkan dialog konfirmasi dulu
  const requestReset = useCallback(
    (templateId?: TemplateId) => {
      if (session.photos.length === 0) {
        performReset(templateId);
        return;
      }
      setPendingReset({ templateId });
    },
    [performReset, session.photos.length],
  );

  // buka atau tutup tag <dialog> native sesuai state pendingReset
  useEffect(() => {
    const dialog = confirmRef.current;
    if (!dialog) return;
    if (pendingReset && !dialog.open) dialog.showModal();
    else if (!pendingReset && dialog.open) dialog.close();
  }, [pendingReset]);

  // pindah dari fase ambil foto ke fase editor, sambil pertahanin editan lama kalau user habis retake
  const edit = () => {
    if (!complete) return;
    cancelCapture();
    camera.stopCamera();
    setStage((previous) => ({
      mode: "edit",
      draft: previous.draft
        ? {
            ...previous.draft,
            template,
            photos: session.photos,
            stickers: previous.draft.stickers ?? [],
            texts: previous.draft.texts ?? [],
            photoFilters: session.photos.map(
              (_, index) => previous.draft?.photoFilters[index] ?? "none",
            ),
          }
        : {
            template,
            photos: session.photos,
            stickers: [],
            frameId: "plain",
            texts: [],
            photoFilters: session.photos.map(() => "none"),
          },
    }));
    setMessage(null);
    // di layar kecil tambahin state history biar tombol Back HP nutup editor
    if (
      !historyEntry.current &&
      window.matchMedia("(max-width: 899px)").matches
    ) {
      window.history.pushState(
        { ...(window.history.state ?? {}), photopipEditor: true },
        "",
      );
      historyEntry.current = true;
    }
  };

  // keluar dari editor balik ke tampilan studio
  const leaveEdit = () => {
    setMessage(null);
    if (historyEntry.current) {
      window.history.back();
      return;
    }
    setStage((previous) => ({ mode: "capture", draft: previous.draft }));
  };

  // tandain satu slot foto buat dijepret ulang lalu balik ke studio
  const retakePhoto = (index: number) => {
    retake(index);
    leaveEdit();
  };

  // nyalain kamera, atau batalin permintaan kalau masih loading izin
  const toggleCamera = () => {
    setMessage(null);
    if (camera.status === "requesting") camera.stopCamera();
    else void camera.startCamera();
  };

  // tentuin label teks status kamera dan nomor shot aktif
  const status =
    camera.status === "ready"
      ? t.camera.ready
      : camera.status === "requesting"
        ? t.camera.requesting
        : t.camera.off;
  const currentShot =
    session.retakeIndex !== null
      ? session.retakeIndex + 1
      : Math.min(session.photos.length + 1, template.photoCount);

  return (
    <div className={`studio-shell phase-${stage.mode}`}>
      <Feedback message={message} onDismiss={() => setMessage(null)} />
      {stage.mode === "capture" && <h1 className="sr-only">{t.app.studio}</h1>}
      {/* modal konfirmasi sebelum ngapus foto dan mulai sesi baru */}
      <dialog
        ref={confirmRef}
        className="confirm-dialog"
        aria-labelledby="reset-confirm-title"
        onCancel={() => setPendingReset(null)}
        onClose={() => setPendingReset(null)}
      >
        <h2 id="reset-confirm-title">{t.capture.resetTitle}</h2>
        <p>{t.capture.resetBody}</p>
        <div className="confirm-actions">
          <button type="button" onClick={() => setPendingReset(null)}>
            {t.camera.cancel}
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => {
              const templateId = pendingReset?.templateId;
              setPendingReset(null);
              performReset(templateId);
            }}
          >
            {t.capture.reset}
          </button>
        </div>
      </dialog>
      {/* fase 1: panggung kamera di kiri dan panel kontrol studio di kanan */}
      {stage.mode === "capture" && (
        <section className="booth" aria-label={t.camera.label}>
          <BoothStage
            videoRef={videoRef}
            camera={camera}
            mirror={mirror}
            flash={flash}
            remaining={remaining}
            complete={complete}
            photos={session.photos}
            template={template}
            onCameraToggle={toggleCamera}
          />
          <aside className="booth-panel" aria-label={t.app.studio}>
            <header className="panel-head">
              <div className="status-cluster">
                <span className={`status-chip is-${camera.status}`}>
                  <span className="status-dot" aria-hidden="true" />
                  {status}
                </span>
                <span className="count-chip">
                  <span className="count-index">{currentShot}</span>
                  <span className="count-total">/ {template.photoCount}</span>
                </span>
              </div>
            </header>
            <section
              className="panel-section"
              aria-labelledby="layout-section-title"
            >
              <h2 id="layout-section-title" className="panel-label">
                {t.capture.layoutLabel}
              </h2>
              <TemplateSelector
                selectedTemplate={template.id}
                onSelectTemplate={requestReset}
                disabled={busy}
              />
            </section>
            <section
              className="panel-section"
              aria-labelledby="photos-section-title"
            >
              <div className="panel-label-row">
                <h2 id="photos-section-title" className="panel-label">
                  {t.capture.photosLabel}
                </h2>
                <span className="panel-progress">
                  {session.photos.length} / {template.photoCount}
                </span>
              </div>
              <FilmStrip
                photos={session.photos}
                photoCount={template.photoCount}
                retakeIndex={session.retakeIndex}
                busy={busy}
                onRetake={retakePhoto}
              />
            </section>
            <CaptureControls
              camera={camera}
              complete={complete}
              busy={busy}
              uploading={uploading}
              retakeIndex={session.retakeIndex}
              photoCount={template.photoCount}
              hasPhotos={session.photos.length > 0}
              timer={timer}
              onTimerChange={setTimer}
              mirror={mirror}
              onMirrorChange={setMirror}
              onCapture={(automatic) => void capture(automatic)}
              onCancel={cancelCapture}
              onReview={edit}
              onReset={() => requestReset()}
              onUpload={() => {
                setMessage(null);
                uploadInput.current?.click();
              }}
              uploadInput={uploadInput}
              onFiles={(files) => void uploadPhotos(files)}
            />
          </aside>
        </section>
      )}
      {/* fase 2: editor canvas lengkap sama bar ekspor PNG/JPEG di bawah */}
      {stage.mode === "edit" && (
        <div className="edit-shell">
          <Editor
            composition={stage.draft}
            frames={frames}
            onChange={(draft) => setStage({ mode: "edit", draft })}
            onBack={leaveEdit}
            onReset={() => requestReset()}
            onRetakePhoto={retakePhoto}
            onStickerError={() => setMessage("upload")}
          />
          <ExportBar
            format={format}
            exporting={exporting}
            onFormatChange={setFormat}
            onExport={() =>
              void exportPhoto(
                stage.draft,
                frameById(stage.draft.frameId, frames),
              )
            }
          />
        </div>
      )}
    </div>
  );
}
