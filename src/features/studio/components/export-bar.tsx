"use client";

/**
 * BILAH EKSPOR & UNDUH
 * Pilihan format file hasil akhir (PNG atau JPEG) dan tombol unduh
 * yang merender strip kanvas menjadi file gambar siap simpan.
 */

import type { ExportFormat } from "@/shared-tools/composition/export";
import { FileIcon } from "@/components/icons";
import { useLanguage } from "@/translations/use-language";

interface ExportBarProps {
  format: ExportFormat;
  exporting: boolean;
  onFormatChange: (format: ExportFormat) => void;
  onExport: () => void;
}

export function ExportBar({
  format,
  exporting,
  onFormatChange,
  onExport,
}: ExportBarProps) {
  const { t } = useLanguage();
  return (
    <div className="export-bar">
      <label className="format-control">
        <span aria-hidden="true">
          <FileIcon />
        </span>
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
