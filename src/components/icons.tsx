import type { SVGProps } from "react";

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SunIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </Icon>
  );
}

export function MoonIcon() {
  return (
    <Icon>
      <path d="M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10Z" />
    </Icon>
  );
}

export function FrameIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
    </Icon>
  );
}

export function PhotoIcon() {
  return (
    <Icon>
      <path d="M3 20V4h18v16Z" />
      <path d="M4 18l5-6 4 4 3-3 4 5" />
      <path d="M8 9h.01" strokeWidth="3" />
    </Icon>
  );
}

export function StickerIcon() {
  return (
    <Icon>
      <path d="M4 4h16v10l-6 6H4Z" />
      <path d="M20 14h-6v6" />
    </Icon>
  );
}

export function TextIcon() {
  return (
    <Icon>
      <path d="M4 5h16M12 5v14M8 19h8" />
    </Icon>
  );
}

export function SlidersIcon() {
  return (
    <Icon>
      <path d="M4 7h8M17 7h3M4 17h3M12 17h8" />
      <path d="M15 4v6M9 14v6" />
    </Icon>
  );
}

export function UndoIcon() {
  return (
    <Icon>
      <path d="M9 7h6a5 5 0 0 1 0 10H7" />
      <path d="M11 3L7 7l4 4" />
    </Icon>
  );
}

export function RedoIcon() {
  return (
    <Icon>
      <path d="M15 7H9a5 5 0 0 0 0 10h8" />
      <path d="M13 3l4 4-4 4" />
    </Icon>
  );
}

export function ResetIcon() {
  return (
    <Icon>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 4v5h-5" />
    </Icon>
  );
}

export function BackIcon() {
  return (
    <Icon>
      <path d="M20 12H4M11 5l-7 7 7 7" />
    </Icon>
  );
}

export function ChevronIcon() {
  return (
    <Icon>
      <path d="M5 9l7 7 7-7" />
    </Icon>
  );
}

export function CheckIcon() {
  return (
    <Icon>
      <path d="M4 12l5 5L20 6" />
    </Icon>
  );
}

export function CloseIcon() {
  return (
    <Icon>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

export function TimerIcon() {
  return (
    <Icon>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 9v4l3 2M9 3h6" />
    </Icon>
  );
}

export function MirrorIcon() {
  return (
    <Icon>
      <path d="M12 3v18" strokeDasharray="2 6" />
      <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
    </Icon>
  );
}

export function AutoIcon() {
  return (
    <Icon>
      <path d="M4 6l7 6-7 6Z" />
      <path d="M13 6l7 6-7 6Z" />
    </Icon>
  );
}

export function RetakeIcon() {
  return (
    <Icon>
      <path d="M4 10V5h5M20 14v5h-5" />
      <path d="M19 9a8 8 0 0 0-13.6-2.6M5 15a8 8 0 0 0 13.6 2.6" />
    </Icon>
  );
}

export function FileIcon() {
  return (
    <Icon>
      <path d="M6 3h8l4 4v14H6Z" />
      <path d="M14 3v5h4" />
    </Icon>
  );
}

export function AlignLeftIcon() {
  return (
    <Icon>
      <path d="M4 6h16M4 11h10M4 16h13" />
    </Icon>
  );
}

export function AlignCenterIcon() {
  return (
    <Icon>
      <path d="M4 6h16M7 11h10M5 16h14" />
    </Icon>
  );
}

export function AlignRightIcon() {
  return (
    <Icon>
      <path d="M4 6h16M10 11h10M7 16h13" />
    </Icon>
  );
}

export function FitIcon() {
  return (
    <Icon>
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </Icon>
  );
}
