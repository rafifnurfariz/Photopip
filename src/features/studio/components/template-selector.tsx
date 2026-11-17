"use client";

/**
 * PEMILIH FORMAT TATA LETAK (TEMPLATE)
 * Menu popover / bottom sheet untuk memilih bentuk strip cetak:
 * strip vertikal (4x1, 3x1), kotak grid (2x2, 2x3), atau foto tunggal (1x1).
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckIcon, ChevronIcon } from "@/components/icons";
import { useLanguage } from "@/translations/use-language";
import {
  findTemplate,
  templates,
  type Template,
  type TemplateId,
} from "@/shared-tools/catalog/templates";

type MenuPosition =
  | { sheet: true }
  | { sheet: false; top: number; left: number; width: number };

const MENU_WIDTH = 300;
const MENU_ESTIMATE = 380;

function LayoutMiniature({ template }: { template: Template }) {
  return (
    <span
      className={`layout-miniature ${template.layout}`}
      style={{ aspectRatio: template.aspectRatio }}
      aria-hidden="true"
    >
      {Array.from({ length: template.photoCount }, (_, index) => (
        <span key={index} />
      ))}
    </span>
  );
}

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (id: TemplateId) => void;
  disabled?: boolean;
}

export function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  disabled = false,
}: TemplateSelectorProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const focusedRef = useRef(false);
  const popoverId = useId();
  const selected = findTemplate(selectedTemplate);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    // Phones portrait: a bottom sheet keeps the list in the thumb zone.
    // Landscape is excluded (min-height: 480px) — use positioned popover instead.
    if (
      window.matchMedia("(max-width: 640px) and (min-height: 480px)").matches
    ) {
      setPosition({ sheet: true });
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const vh = window.innerHeight;
    const width = Math.max(240, Math.min(MENU_WIDTH, window.innerWidth - 16));
    const room = Math.min(vh - 24, MENU_ESTIMATE);
    const below = vh - rect.bottom - 12;
    const above = rect.top - 12;
    const rawTop =
      below >= room || below >= above
        ? rect.bottom + 8
        : Math.max(12, rect.top - 8 - room);
    // Clamp so the popover never overflows the bottom of the viewport.
    const top = Math.min(rawTop, vh - room - 8);
    const left = Math.max(
      8,
      Math.min(rect.right - width, window.innerWidth - width - 8),
    );
    setPosition({ sheet: false, top, left, width });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const popover = popoverRef.current;
      if (!popover) return;
      const items = popover.querySelectorAll<HTMLButtonElement>(
        "button:not([disabled])",
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      // The sheet is portaled to <body>, so Tab has to loop inside it.
      if (event.shiftKey && (active === first || !popover.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (active === last || !popover.contains(active))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        popoverRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      )
        return;
      close(false);
    };
    const onReflow = () => place();
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [open, place, close]);

  useEffect(() => {
    if (!open) {
      focusedRef.current = false;
      return;
    }
    if (!position || focusedRef.current) return;
    const active = popoverRef.current?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    );
    (active ?? popoverRef.current?.querySelector("button"))?.focus({
      preventScroll: true,
    });
    focusedRef.current = true;
  }, [open, position]);

  const choose = (id: TemplateId) => {
    onSelectTemplate(id);
    close();
  };

  return (
    <div className="layout-menu">
      <button
        ref={triggerRef}
        type="button"
        className="layout-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        disabled={disabled}
        onClick={() => {
          if (!open) place();
          setOpen((value) => !value);
        }}
      >
        <LayoutMiniature template={selected} />
        <span className="layout-trigger-copy">
          <strong>{t.layoutNames[selected.id]}</strong>
          <small>
            {selected.photoCount}{" "}
            {selected.photoCount === 1 ? t.capture.photo : t.capture.photos} ·{" "}
            {selected.size}
          </small>
        </span>
        <span className="layout-caret" aria-hidden="true">
          <ChevronIcon />
        </span>
      </button>
      {open &&
        position &&
        createPortal(
          <>
            {position.sheet && (
              <div className="layout-scrim" aria-hidden="true" />
            )}
            <div
              ref={popoverRef}
              id={popoverId}
              className={`layout-popover${position.sheet ? " is-sheet" : ""}`}
              role="dialog"
              aria-modal={position.sheet ? true : undefined}
              aria-label={t.capture.chooseLayout}
              style={
                position.sheet
                  ? undefined
                  : {
                      top: position.top,
                      left: position.left,
                      width: position.width,
                    }
              }
            >
              <p className="layout-popover-title">{t.capture.chooseLayout}</p>
              <div className="layout-menu-list">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    className="layout-menu-option"
                    aria-pressed={selectedTemplate === template.id}
                    onClick={() => choose(template.id)}
                  >
                    <LayoutMiniature template={template} />
                    <span className="layout-menu-copy">
                      <strong>{t.layoutNames[template.id]}</strong>
                      <small>
                        {template.photoCount}{" "}
                        {template.photoCount === 1
                          ? t.capture.photo
                          : t.capture.photos}{" "}
                        · {template.size}
                      </small>
                    </span>
                    {selectedTemplate === template.id && (
                      <span className="selected-mark" aria-hidden="true">
                        <CheckIcon />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
