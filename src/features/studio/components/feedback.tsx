"use client";

import { CloseIcon } from "@/components/icons";
import { useLanguage } from "@/translations/use-language";
import type { StudioMessage } from "../types";

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
