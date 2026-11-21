"use client";

/**
 * TAMPILAN UTAMA STUDIO (FASE PENGAMBILAN FOTO)
 * Mengatur alur pemotretan: kamera aktif, upload file, ganti template strip,
 * hingga tombol lanjut ke mode editor setelah foto lengkap.
 */

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

function EditorLoading() {
  const { t } = useLanguage();
  return <p role="status">{t.app.processing}</p>;
}

const Editor = dynamic(() => import("@/features/editor/editor"), {
  ssr: false,
  loading: EditorLoading,
});

type Stage =
  | { mode: "capture"; draft: Composition | null }
  | { mode: "edit"; draft: Composition };

export default function Studio() {
  const { t } = useLanguage();
  const [videoRef, camera] = useCamera();
  const [mirror, setMirror] = useState(true);
  const [timer, setTimer] = useState(3);
  const [message, setMessage] = useState<StudioMessage | null>(null);
  const [stage, setStage] = useState<Stage>({ mode: "capture", draft: null });
  const [pendingReset, setPendingReset] = useState<{
    templateId?: TemplateId;
  } | null>(null);
  const confirmRef = useRef<HTMLDialogElement>(null);
  const uploadInput = useRef<HTMLInputElement>(null);
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

  // Prefetch sticker catalog in background so opening the sticker tab is instant.
  useEffect(() => {
    void fetchStickerCatalog();
  }, []);

  // The download toast is an acknowledgement, not state: clear it after 3s.
  useEffect(() => {
    if (message !== "downloaded") return;
    const id = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(id);
  }, [message]);

  // A phone back gesture must return to the camera, not drop the session.
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

  const performReset = useCallback(
    (templateId?: TemplateId) => {
      resetSession(templateId);
      cancelExport();
      setStage({ mode: "capture", draft: null });
      setMessage(null);
      // Consume the editor history entry so Back does not reopen a dead draft.
      if (historyEntry.current) {
        historyEntry.current = false;
        window.history.back();
      }
    },
    [cancelExport, resetSession],
  );

  // Changing layout or starting over discards finished photos; confirm first.
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

  useEffect(() => {
    const dialog = confirmRef.current;
    if (!dialog) return;
    if (pendingReset && !dialog.open) dialog.showModal();
    else if (!pendingReset && dialog.open) dialog.close();
  }, [pendingReset]);

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

  const leaveEdit = () => {
    setMessage(null);
    if (historyEntry.current) {
      window.history.back();
      return;
    }
    setStage((previous) => ({ mode: "capture", draft: previous.draft }));
  };

  const retakePhoto = (index: number) => {
    retake(index);
    leaveEdit();
  };

  const toggleCamera = () => {
    setMessage(null);
    if (camera.status === "requesting") camera.stopCamera();
    else void camera.startCamera();
  };

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
      {stage.mode === "edit" && (
        <div className="edit-shell">
          <Editor
            composition={stage.draft}
            frames={frames}
            onChange={(draft) => setStage({ mode: "edit", draft })}
            onBack={leaveEdit}
            onReset={() => requestReset()}
            onRetakePhoto={retakePhoto}
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
