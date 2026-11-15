"use client";

import { useLanguage } from "@/translations/use-language";
import type { StudioMessage } from "../types";

const ERROR_MESSAGES = new Set<StudioMessage>(["capture", "upload", "export"]);

export function Feedback({ message }: { message: StudioMessage | null }) {
  const { t } = useLanguage();
  if (!message) return null;
  const isError = ERROR_MESSAGES.has(message);
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
      {text}
    </p>
  );
}
