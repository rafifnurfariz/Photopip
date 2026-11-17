"use client";

import { resolveTextFont } from "@/shared-tools/catalog/fonts";
import type { ThemePreset } from "@/shared-tools/catalog/themes";
import { templateGeometry } from "@/shared-tools/composition/geometry";
import type { Composition } from "@/shared-tools/composition/types";

const MAX_WIDTH = 104;
const MAX_HEIGHT = 128;

interface ThemePreviewProps {
  template: Composition["template"];
  theme: ThemePreset;
}

export function ThemePreview({ template, theme }: ThemePreviewProps) {
  const geometry = templateGeometry(template);
  const scale = Math.min(
    MAX_WIDTH / geometry.width,
    MAX_HEIGHT / geometry.height,
  );
  const width = Math.max(1, Math.round(geometry.width * scale));
  const height = Math.max(1, Math.round(geometry.height * scale));
  const artwork = theme.artwork?.[template.id];

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
    const slots = makeSlots("theme-preview-slot theme-preview-slot--artwork");
    return (
      <span
        className="theme-preview"
        style={{
          width,
          height,
          background:
            theme.background.type === "color"
              ? theme.background.value
              : "#ffffff",
        }}
        aria-hidden="true"
      >
        {slots}
        <img className="theme-preview-artwork" src={artwork} alt="" />
      </span>
    );
  }

  const slots = makeSlots("theme-preview-slot");
  return (
    <span
      className="theme-preview"
      style={{ width, height, background: theme.background.preview }}
      aria-hidden="true"
    >
      {slots}
      <span
        className="theme-preview-text"
        style={{
          left: width / 2,
          top: height - (geometry.margin + geometry.footer / 2) * scale,
          color: theme.textColor,
          fontFamily: resolveTextFont(theme.fontId),
        }}
      >
        Aa
      </span>
    </span>
  );
}
