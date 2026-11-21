"use client";

/**
 * BILAH TAB ALAT (TOOL RAIL)
 * Tombol navigasi tab di sisi samping editor: Bingkai, Foto, Stiker,
 * Teks, dan Properti, lengkap dengan kontrol keyboard (panah/tab).
 */

import { useRef } from "react";
import type { ComponentType, KeyboardEvent } from "react";
import {
  FrameIcon,
  PhotoIcon,
  SlidersIcon,
  StickerIcon,
  TextIcon,
} from "@/components/icons";
import { useLanguage } from "@/translations/use-language";
import { nextTabIndex } from "../tabs";
import type { ToolTab } from "../types";

interface ToolRailProps {
  tab: ToolTab;
  onChange: (tab: ToolTab) => void;
}

export function ToolRail({ tab, onChange }: ToolRailProps) {
  const { t } = useLanguage();
  const refs = useRef<Partial<Record<ToolTab, HTMLButtonElement | null>>>({});
  const tools: {
    id: ToolTab;
    label: string;
    Icon: ComponentType;
  }[] = [
    { id: "frame", label: t.editor.tabs.frame, Icon: FrameIcon },
    { id: "photo", label: t.editor.tabs.photo, Icon: PhotoIcon },
    { id: "sticker", label: t.editor.tabs.sticker, Icon: StickerIcon },
    { id: "text", label: t.editor.tabs.text, Icon: TextIcon },
    { id: "properties", label: t.editor.tabs.properties, Icon: SlidersIcon },
  ];
  const activeIndex = tools.findIndex((item) => item.id === tab);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = nextTabIndex(tools.length, activeIndex, event.key);
    if (next === null) return;
    event.preventDefault();
    onChange(tools[next].id);
    refs.current[tools[next].id]?.focus();
  };

  return (
    <div
      className="editor-tabs"
      role="tablist"
      aria-label={t.editor.title}
      onKeyDown={onKeyDown}
    >
      {tools.map((item) => (
        <button
          key={item.id}
          ref={(node) => {
            refs.current[item.id] = node;
          }}
          type="button"
          role="tab"
          className="editor-tab"
          aria-selected={tab === item.id}
          aria-controls="editor-panel"
          tabIndex={tab === item.id ? 0 : -1}
          onClick={() => onChange(item.id)}
        >
          <span className="tab-icon">
            <item.Icon />
          </span>
          <span className="tab-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
