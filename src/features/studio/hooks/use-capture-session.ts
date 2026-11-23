"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { delay } from "@/shared-tools/async";
import {
  findTemplate,
  type TemplateId,
} from "@/shared-tools/catalog/templates";
import {
  readPhotoFile,
  isSupportedPhotoFile,
} from "@/shared-tools/image-upload";
import { initialSession, sessionReducer } from "@/shared-tools/session";
import type { CameraController } from "../camera/use-camera";
import type { StudioMessage } from "../types";

interface CaptureSessionOptions {
  camera: CameraController;
  mirror: boolean;
  timer: number;
  onMessage: (message: StudioMessage | null) => void;
}

export function useCaptureSession({
  camera,
  mirror,
  timer,
  onMessage,
}: CaptureSessionOptions) {
  const [session, dispatch] = useReducer(sessionReducer, initialSession);
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [uploading, setUploading] = useState(false);
  const work = useRef<AbortController | null>(null);
  const cameraRef = useRef(camera);
  const template = findTemplate(session.templateId);
  const complete =
    session.photos.length === template.photoCount &&
    session.retakeIndex === null;

  useEffect(() => {
    cameraRef.current = camera;
  });

  const cancelCapture = useCallback(() => {
    work.current?.abort();
    work.current = null;
    setBusy(false);
    setRemaining(null);
    setFlash(false);
  }, []);

  useEffect(() => {
    const leave = () => {
      if (document.hidden) cancelCapture();
    };
    document.addEventListener("visibilitychange", leave);
    return () => {
      document.removeEventListener("visibilitychange", leave);
      cancelCapture();
    };
  }, [cancelCapture]);

  const resetSession = useCallback(
    (templateId?: TemplateId) => {
      cancelCapture();
      dispatch({ type: "reset", templateId });
    },
    [cancelCapture],
  );

  const retake = useCallback(
    (index: number) => {
      cancelCapture();
      cameraRef.current.stopCamera();
      dispatch({ type: "retake", index });
      onMessage(null);
    },
    [cancelCapture, onMessage],
  );

  const capture = useCallback(
    async (automatic: boolean) => {
      if (
        work.current ||
        uploading ||
        complete ||
        cameraRef.current.status !== "ready"
      )
        return;
      const controller = new AbortController();
      work.current = controller;
      const signal = controller.signal;
      setBusy(true);
      onMessage(null);
      const count =
        session.retakeIndex !== null
          ? 1
          : automatic
            ? template.photoCount - session.photos.length
            : 1;
      try {
        for (let i = 0; i < count; i++) {
          const seconds = i === 0 ? timer : 5;
          for (let second = seconds; second > 0; second--) {
            setRemaining(second);
            await delay(1000, signal);
          }
          setRemaining(null);
          if (signal.aborted) return;
          const photo = cameraRef.current.capturePhoto(mirror);
          if (!photo) {
            onMessage("capture");
            return;
          }
          dispatch({
            type: "capture",
            src: photo,
            count: template.photoCount,
          });
          setFlash(true);
          await delay(140, signal);
          setFlash(false);
        }
        if (automatic || session.photos.length + count >= template.photoCount)
          cameraRef.current.stopCamera();
      } catch {
        if (!signal.aborted) onMessage("capture");
      } finally {
        if (work.current === controller) {
          work.current = null;
          setBusy(false);
          setRemaining(null);
          setFlash(false);
        }
      }
    },
    [
      complete,
      mirror,
      onMessage,
      session.photos.length,
      session.retakeIndex,
      timer,
      template.photoCount,
      uploading,
    ],
  );

  const uploadPhotos = useCallback(
    async (files: File[]) => {
      if (!files.length || uploading || complete || work.current) return;
      const slots =
        session.retakeIndex !== null
          ? 1
          : template.photoCount - session.photos.length;
      if (slots <= 0) return;
      const selected = files.slice(0, slots);
      if (!selected.every(isSupportedPhotoFile)) {
        onMessage("upload");
        return;
      }
      setUploading(true);
      onMessage(null);
      try {
        const sources: string[] = [];
        for (const file of selected) sources.push(await readPhotoFile(file));
        for (const src of sources)
          dispatch({ type: "capture", src, count: template.photoCount });
      } catch {
        onMessage("upload");
      } finally {
        setUploading(false);
      }
    },
    [
      complete,
      onMessage,
      session.photos.length,
      session.retakeIndex,
      template.photoCount,
      uploading,
    ],
  );

  return {
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
  };
}
