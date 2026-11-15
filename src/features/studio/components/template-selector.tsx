"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/translations/use-language";
import {
  findTemplate,
  templates,
  type Template,
  type TemplateId,
} from "@/shared-tools/catalog/templates";

type MenuPosition = { top: number; left: number; width: number };

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
    const rect = trigger.getBoundingClientRect();
    const width = Math.max(240, Math.min(MENU_WIDTH, window.innerWidth - 16));
    const room = Math.min(window.innerHeight - 24, MENU_ESTIMATE);
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const top =
      below >= room || below >= above
        ? rect.bottom + 8
        : Math.max(12, rect.top - 8 - room);
    const left = Math.max(
      8,
      Math.min(rect.right - width, window.innerWidth - width - 8),
    );
    setPosition({ top, left, width });
  }, []);

  useEffect(() => {
    if (!open) return;
    place();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
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
        onClick={() => setOpen((value) => !value)}
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
          ▾
        </span>
      </button>
      {open &&
        position &&
        createPortal(
          <div
            ref={popoverRef}
            id={popoverId}
            className="layout-popover"
            role="dialog"
            aria-label={t.capture.chooseLayout}
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
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
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
