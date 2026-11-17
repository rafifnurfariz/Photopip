/**
 * PANEL PILIHAN BINGKAI & TEMA
 * Menampilkan kartu pratinjau bingkai foto strip yang tersedia,
 * tombol "Acak bingkai" (surprise me), dan menerapkan tema ke kanvas.
 */

import { useLanguage } from "@/translations/use-language";
import {
  activeTheme,
  applyTheme,
  type ThemePreset,
} from "@/shared-tools/catalog/themes";
import type { Composition } from "@/shared-tools/composition/types";
import { ThemePreview } from "./theme-preview";

interface ThemePanelProps {
  composition: Composition;
  themes: readonly ThemePreset[];
  onChange: (composition: Composition) => void;
  onSurprise: () => void;
}

export function ThemePanel({
  composition,
  themes,
  onChange,
  onSurprise,
}: ThemePanelProps) {
  const { t } = useLanguage();
  const active = activeTheme(composition, themes);
  return (
    <section className="tool-section" aria-labelledby="tool-theme">
      <div className="section-head">
        <h2 id="tool-theme">{t.editor.themePresets}</h2>
        <button type="button" className="chip-button" onClick={onSurprise}>
          {t.editor.surprise}
        </button>
      </div>
      <p className="tool-help">{t.editor.themeHint}</p>
      <div className="theme-grid">
        {themes.map((theme) => {
          const selected = active?.id === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              className="theme-card"
              aria-pressed={selected}
              onClick={() => onChange(applyTheme(composition, theme))}
            >
              <ThemePreview template={composition.template} theme={theme} />
              <span className="theme-name">{theme.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
