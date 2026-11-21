"use client";

import { resolveTextFont } from "@/shared-tools/catalog/fonts";
import type { FramePreset } from "@/shared-tools/catalog/frames";
import { templateGeometry } from "@/shared-tools/composition/geometry";
import type { Composition } from "@/shared-tools/composition/types";

const MAX_WIDTH = 104;
const MAX_HEIGHT = 128;

interface FramePreviewProps {
  template: Composition["template"];
  frame: FramePreset;
}

export function FramePreview({ template, frame }: FramePreviewProps) {
  const geometry = templateGeometry(template);
  const scale = Math.min(
    MAX_WIDTH / geometry.width,
    MAX_HEIGHT / geometry.height,
  );
  const width = Math.max(1, Math.round(geometry.width * scale));
  const height = Math.max(1, Math.round(geometry.height * scale));
  const artwork = frame.artwork?.[template.id];

  const makeSlots = (className: string) =>
    geometry.slots.map((slot, index) => (
      <span
        key={index}
        className={className}
        style={{
          left: slot.x * scale,
          top: slot.y * scale,
          width: slot.width * scale,
          height: slot.height * scale,
        }}
      />
    ));

  if (artwork) {
    const slots = makeSlots("frame-preview-slot frame-preview-slot--artwork");
    return (
      <span
        className="frame-preview"
        style={{
          width,
          height,
          background:
            frame.background.type === "color"
              ? frame.background.value
              : "#ffffff",
        }}
        aria-hidden="true"
      >
        {slots}
        <img className="frame-preview-artwork" src={artwork} alt="" />
      </span>
    );
  }

  const slots = makeSlots("frame-preview-slot");
  return (
    <span
      className="frame-preview"
      style={{ width, height, background: frame.background.preview }}
      aria-hidden="true"
    >
      {slots}
      <span
        className="frame-preview-text"
        style={{
          left: width / 2,
          top: height - (geometry.margin + geometry.footer / 2) * scale,
          color: frame.textColor,
          fontFamily: resolveTextFont(frame.fontId),
        }}
      >
        Aa
      </span>
    </span>
  );
}
