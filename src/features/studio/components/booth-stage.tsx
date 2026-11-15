"use client";

import type { RefObject } from "react";
import { useLanguage } from "@/translations/use-language";
import type { Template } from "@/shared-tools/catalog/templates";
import type { CameraController } from "../camera/use-camera";

interface BoothStageProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  camera: CameraController;
  mirror: boolean;
  flash: boolean;
  remaining: number | null;
  complete: boolean;
  photos: string[];
  template: Template;
}

export function BoothStage({
  videoRef,
  camera,
  mirror,
  flash,
  remaining,
  complete,
  photos,
  template,
}: BoothStageProps) {
  const { t } = useLanguage();
  return (
    <div className={`booth-stage ${flash ? "shutter-flash" : ""}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="booth-video"
        style={{
          transform: mirror ? "scaleX(-1)" : undefined,
          visibility: camera.status === "ready" ? "visible" : "hidden",
        }}
      />
      <div className="booth-wash" aria-hidden="true" />
      {camera.status !== "ready" && (
        <div className={`camera-empty${complete ? " is-complete" : ""}`}>
          {complete ? (
            <>
              <div className="completion-strip-wrap">
                <div
                  className={`completion-strip ${template.layout}`}
                  style={{ aspectRatio: template.aspectRatio }}
                >
                  {photos.map((src) => (
                    <img key={src} src={src} alt="" />
                  ))}
                </div>
              </div>
              <div className="completion-copy" role="status">
                <h2>{t.app.photoComplete}</h2>
                <p>
                  {photos.length} / {template.photoCount} ·{" "}
                  {t.capture.readyToEdit}
                </p>
              </div>
            </>
          ) : (
            <div className="camera-empty-content">
              <img
                className="camera-mark"
                src="/assets/brand/logo.png"
                width="96"
                height="96"
                alt=""
              />
              <h2>
                {camera.status === "requesting"
                  ? t.camera.requesting
                  : t.capture.cameraOff}
              </h2>
              <p role={camera.error ? "alert" : undefined}>
                {camera.error
                  ? t.errors.camera[camera.error]
                  : t.capture.cameraOffNote}
              </p>
              {camera.status !== "requesting" && (
                <ol className="empty-steps" aria-label={t.capture.stepsTitle}>
                  {t.capture.steps.map((step, index) => (
                    <li key={step}>
                      <span className="step-number" aria-hidden="true">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
      )}
      {remaining !== null && (
        <span className="countdown" role="status" aria-live="assertive">
          {remaining}
        </span>
      )}
    </div>
  );
}
