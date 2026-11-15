"use client";

import type { RefObject } from "react";
import { useLanguage } from "@/translations/use-language";
import type { CameraController } from "../camera/use-camera";

interface CaptureControlsProps {
  camera: CameraController;
  complete: boolean;
  busy: boolean;
  uploading: boolean;
  retakeIndex: number | null;
  photoCount: number;
  hasPhotos: boolean;
  timer: number;
  onTimerChange: (timer: number) => void;
  mirror: boolean;
  onMirrorChange: (mirror: boolean) => void;
  onCapture: (automatic: boolean) => void;
  onCancel: () => void;
  onReview: () => void;
  onReset: () => void;
  onUpload: () => void;
  onCameraToggle: () => void;
  uploadInput: RefObject<HTMLInputElement | null>;
  onFiles: (files: File[]) => void;
}

export function CaptureControls({
  camera,
  complete,
  busy,
  uploading,
  retakeIndex,
  photoCount,
  hasPhotos,
  timer,
  onTimerChange,
  mirror,
  onMirrorChange,
  onCapture,
  onCancel,
  onReview,
  onReset,
  onUpload,
  onCameraToggle,
  uploadInput,
  onFiles,
}: CaptureControlsProps) {
  const { t } = useLanguage();
  return (
    <div className="panel-actions">
      {complete ? (
        <div className="panel-finish">
          <button
            type="button"
            className="primary panel-primary"
            onClick={onReview}
          >
            {t.capture.review}
          </button>
          <button
            type="button"
            className="icon-option"
            aria-label={t.capture.reset}
            title={t.capture.reset}
            onClick={onReset}
          >
            <span aria-hidden="true">↺</span>
          </button>
        </div>
      ) : busy ? (
        <button type="button" className="shutter-button" onClick={onCancel}>
          {t.camera.cancel}
        </button>
      ) : (
        <>
          <div
            className="option-row"
            role="group"
            aria-label={t.capture.optionsLabel}
          >
            <label className="icon-option timer-option" title={t.camera.timer}>
              <span className="option-glyph" aria-hidden="true">
                ⏱
              </span>
              <select
                aria-label={t.camera.timer}
                value={timer}
                onChange={(event) => onTimerChange(Number(event.target.value))}
              >
                <option value={0}>{t.camera.noDelay}</option>
                <option value={3}>3 s</option>
                <option value={5}>5 s</option>
              </select>
            </label>
            <label
              className="icon-option toggle-option"
              title={t.camera.mirror}
            >
              <input
                type="checkbox"
                checked={mirror}
                onChange={(event) => onMirrorChange(event.target.checked)}
              />
              <span className="option-glyph" aria-hidden="true">
                ⇆
              </span>
              <span className="sr-only">{t.camera.mirror}</span>
            </label>
            {photoCount > 1 && retakeIndex === null && (
              <button
                type="button"
                className="icon-option"
                aria-label={t.camera.auto}
                title={t.camera.auto}
                disabled={camera.status !== "ready"}
                onClick={() => onCapture(true)}
              >
                <span className="option-glyph" aria-hidden="true">
                  ▶▶
                </span>
              </button>
            )}
            {hasPhotos && (
              <button
                type="button"
                className="icon-option"
                aria-label={t.capture.reset}
                title={t.capture.reset}
                onClick={onReset}
              >
                <span aria-hidden="true">↺</span>
              </button>
            )}
          </div>
          <button
            type="button"
            className="secondary panel-primary"
            disabled={uploading}
            onClick={onUpload}
          >
            {uploading ? t.capture.uploading : t.capture.upload}
          </button>
          {camera.status === "ready" ? (
            <button
              type="button"
              className="shutter-button"
              onClick={() => onCapture(false)}
            >
              <span className="shutter-dot" aria-hidden="true" />
              {retakeIndex !== null ? t.capture.retake : t.capture.takePhoto}
            </button>
          ) : (
            <button
              type="button"
              className="primary panel-primary"
              disabled={uploading}
              onClick={onCameraToggle}
            >
              {camera.status === "requesting"
                ? t.camera.cancel
                : camera.error
                  ? t.camera.retry
                  : t.camera.enable}
            </button>
          )}
        </>
      )}
      <input
        ref={uploadInput}
        type="file"
        accept="image/*"
        multiple={photoCount > 1}
        hidden
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          onFiles(files);
        }}
      />
    </div>
  );
}
