// panel tab Bingkai di sidebar editor buat milih paket bingkai atau pilih bingkai acak
// nampilin grid kartu pratinjau bingkai yang pas sama template aktif
import { useLanguage } from "@/translations/use-language";
import {
  activeFrame,
  applyFrame,
  type FramePreset,
} from "@/shared-tools/catalog/frames";
import type { Composition } from "@/shared-tools/composition/types";
import { FramePreview } from "./frame-preview";

interface FramePanelProps {
  composition: Composition;
  frames: readonly FramePreset[];
  onChange: (composition: Composition) => void;
  onSurprise: () => void;
}

export function FramePanel({
  composition,
  frames,
  onChange,
  onSurprise,
}: FramePanelProps) {
  const { t } = useLanguage();
  // cek bingkai mana yang lagi dipakai biar kartunya dikasih highlight
  const active = activeFrame(composition, frames);
  return (
    <section className="tool-section" aria-labelledby="tool-frame">
      {/* judul tab bingkai sama tombol pilih acak */}
      <div className="section-head">
        <h2 id="tool-frame">{t.editor.framePresets}</h2>
        <button type="button" className="chip-button" onClick={onSurprise}>
          {t.editor.surprise}
        </button>
      </div>
      <p className="tool-help">{t.editor.frameHint}</p>
      {/* grid daftar pilihan bingkai */}
      <div className="frame-grid">
        {frames.map((frame) => {
          const selected = active?.id === frame.id;
          return (
            <button
              key={frame.id}
              type="button"
              className="frame-card"
              aria-pressed={selected}
              onClick={() => onChange(applyFrame(composition, frame))}
            >
              <FramePreview template={composition.template} frame={frame} />
              <span className="frame-name">{frame.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
