"use client";

import type {
  ExportFormat,
  ExportScale,
} from "@/shared-tools/composition/export";
import { useLanguage } from "@/translations/use-language";

interface ExportBarProps {
  format: ExportFormat;
  scale: ExportScale;
  exporting: boolean;
  onFormatChange: (format: ExportFormat) => void;
  onScaleChange: (scale: ExportScale) => void;
  onExport: () => void;
}

export function ExportBar({
  format,
  scale,
  exporting,
  onFormatChange,
  onScaleChange,
  onExport,
}: ExportBarProps) {
  const { t } = useLanguage();
  return (
    <div className="export-bar">
      <label className="format-control">
        <span aria-hidden="true">▤</span>
        <select
          aria-label={t.export.format}
          value={format}
          onChange={(event) =>
            onFormatChange(event.target.value as ExportFormat)
          }
          disabled={exporting}
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
        </select>
      </label>
      <label className="format-control">
        <span aria-hidden="true">⌗</span>
        <select
          aria-label={t.export.scale}
          value={scale}
          onChange={(event) =>
            onScaleChange(Number(event.target.value) as ExportScale)
          }
          disabled={exporting}
        >
          <option value={1}>{t.export.scale1}</option>
          <option value={2}>{t.export.scale2}</option>
          <option value={3}>{t.export.scale3}</option>
        </select>
      </label>
      <button
        type="button"
        className="primary"
        disabled={exporting}
        onClick={onExport}
      >
        {exporting ? t.app.processing : t.export.download}
      </button>
    </div>
  );
}
