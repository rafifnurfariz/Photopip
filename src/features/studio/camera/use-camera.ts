"use client";

// custom hook buat nyalain, matiin, dan jepret foto dari webcam browser
// juga otomatis matiin kamera pas user pindah tab atau nutup halaman biar hemat baterai & aman
import { useCallback, useEffect, useRef, useState } from "react";
import {
  cameraFailure,
  capturePhotoFromVideo,
  stopMediaStream,
  waitForVideoFrame,
  type CameraFailure,
} from "./camera-utils";

export type CameraStatus = "off" | "requesting" | "ready" | "error";

// objek kontrol kamera yang dikirim ke komponen studio
export interface CameraController {
  status: CameraStatus;
  error: CameraFailure | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: (mirror: boolean) => string | null;
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // penghitung versi biar request kamera lama yang telat datang langsung diabaikan
  const generation = useRef(0);
  const readiness = useRef<AbortController | null>(null);
  const capturing = useRef(false);
  const [status, setStatus] = useState<CameraStatus>("off");
  const [error, setError] = useState<CameraFailure | null>(null);

  // hentikan stream aktif, lepas video srcObject, lalu reset status ke off
  const stopCamera = useCallback(() => {
    generation.current += 1;
    readiness.current?.abort();
    readiness.current = null;
    const stream = streamRef.current;
    streamRef.current = null;
    stream?.getTracks().forEach((track) => {
      track.onended = null;
    });
    stopMediaStream(stream);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.srcObject = null;
    }
    capturing.current = false;
    setStatus("off");
    setError(null);
  }, []);

  // minta izin kamera depan, pasang ke <video>, dan tunggu sampai frame pertama muncul
  const startCamera = useCallback(async () => {
    stopCamera();
    const id = generation.current;
    const controller = new AbortController();
    readiness.current = controller;
    setStatus("requesting");
    try {
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error("Camera unavailable");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
      });
      // kalau di tengah jalan user batalin atau komponen sudah unmount, langsung matiin stream-nya
      if (id !== generation.current || !videoRef.current) {
        stopMediaStream(stream);
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      // deteksi kalau kamera tiba-tiba dicabut atau dimatiin dari sistem
      stream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          if (id !== generation.current) return;
          stopCamera();
          setError("unavailable");
          setStatus("error");
        };
      });
      await Promise.all([
        video.play(),
        waitForVideoFrame(video, controller.signal),
      ]);
      if (id !== generation.current) return;
      setStatus("ready");
    } catch (cause) {
      if (id !== generation.current) return;
      // bedain error waktu minta izin sama error waktu nunggu gambar video
      const failure = streamRef.current ? "readiness" : cameraFailure(cause);
      stopCamera();
      setError(failure);
      setStatus("error");
    }
  }, [stopCamera]);

  // jepret satu foto dari video, dicegah biar gak kepanggil dobel bersamaan
  const capturePhoto = useCallback(
    (mirror: boolean) => {
      if (capturing.current || status !== "ready" || !videoRef.current)
        return null;
      capturing.current = true;
      try {
        return capturePhotoFromVideo(videoRef.current, mirror);
      } catch {
        setError("capture");
        return null;
      } finally {
        capturing.current = false;
      }
    },
    [status],
  );

  // otomatis matiin kamera pas tab disembunyiin, pindah halaman, atau komponen dibongkar
  useEffect(() => {
    const leave = () => {
      if (document.hidden) stopCamera();
    };
    const pagehide = () => stopCamera();
    document.addEventListener("visibilitychange", leave);
    window.addEventListener("pagehide", pagehide);
    return () => {
      document.removeEventListener("visibilitychange", leave);
      window.removeEventListener("pagehide", pagehide);
      stopCamera();
    };
  }, [stopCamera]);

  const camera: CameraController = {
    status,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
  };

  return [videoRef, camera] as const;
}
