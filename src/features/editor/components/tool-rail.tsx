"use client";

import { useLanguage } from "@/translations/use-language";
import type { ToolTab } from "../types";

interface ToolRailProps {
  tab: ToolTab;
  hasSelection: boolean;
  onChange: (tab: ToolTab) => void;
}

export function ToolRail({ tab, hasSelection, onChange }: ToolRailProps) {
  const { t } = useLanguage();
  const tools: { id: ToolTab; label: string; icon: string }[] = [
    { id: "theme", label: t.editor.tabs.theme, icon: "◐" },
    { id: "photo", label: t.editor.tabs.photo, icon: "▤" },
    { id: "sticker", label: t.editor.tabs.sticker, icon: "✦" },
    { id: "text", label: t.editor.tabs.text, icon: "T" },
    { id: "properties", label: t.editor.tabs.properties, icon: "◈" },
  ];
  return (
    <div className="editor-tabs" role="tablist" aria-label={t.editor.title}>
      {tools.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          className="editor-tab"
          aria-selected={tab === item.id}
          aria-controls="editor-panel"
          onClick={() => onChange(item.id)}
        >
          <span className="tab-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="tab-label">{item.label}</span>
          {item.id === "properties" && hasSelection && (
            <span className="tab-dot" aria-hidden="true" />
          )}
        </button>
      ))}
    </div>
  );
}
