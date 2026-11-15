import type { TemplateId } from "@/shared-tools/catalog/templates";
import type { PhotoFilterId } from "@/shared-tools/composition/types";
import type { CameraFailure } from "@/features/studio/camera/camera-utils";

export const languages = ["id", "en", "es", "fr", "de", "ja", "zh"] as const;

export type Language = (typeof languages)[number];

export const languageNames: Record<Language, string> = {
  id: "Indonesia",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
};

export interface Messages {
  app: {
    studio: string;
    language: string;
    skip: string;
    light: string;
    dark: string;
    processing: string;
    photoComplete: string;
    downloadStarted: string;
    dismiss: string;
  };
  camera: {
    label: string;
    off: string;
    requesting: string;
    ready: string;
    enable: string;
    cancel: string;
    retry: string;
    mirror: string;
    timer: string;
    noDelay: string;
    auto: string;
  };
  capture: {
    layoutLabel: string;
    chooseLayout: string;
    photosLabel: string;
    optionsLabel: string;
    progress: string;
    review: string;
    reset: string;
    retake: string;
    takePhoto: string;
    cameraOff: string;
    cameraOffNote: string;
    stepsTitle: string;
    steps: [string, string, string];
    previewTitle: string;
    upload: string;
    uploading: string;
    photo: string;
    photos: string;
    readyToEdit: string;
    resetTitle: string;
    resetBody: string;
  };
  editor: {
    title: string;
    subtitle: string;
    back: string;
    undo: string;
    redo: string;
    zoomIn: string;
    zoomOut: string;
    fit: string;
    tabs: {
      theme: string;
      photo: string;
      sticker: string;
      text: string;
      properties: string;
    };
    themePresets: string;
    themeHint: string;
    surprise: string;
    filters: string;
    photoLabel: string;
    retakePhoto: string;
    categories: {
      all: string;
      fun: string;
      love: string;
      cool: string;
      fancy: string;
    };
    duplicate: string;
    bringFront: string;
    sendBack: string;
    flipX: string;
    flipY: string;
    opacity: string;
    addText: string;
    defaultCaption: string;
    textContent: string;
    textPlaceholder: string;
    font: string;
    color: string;
    align: string;
    alignLeft: string;
    alignCenter: string;
    alignRight: string;
    bold: string;
    italic: string;
    noSelection: string;
    position: string;
    layer: string;
    deleteSelection: string;
    textEmpty: string;
    stickers: string;
    clearStickers: string;
    search: string;
    searchEmpty: string;
    clearSearch: string;
    horizontal: string;
    vertical: string;
    size: string;
    rotation: string;
    remove: string;
    filterNames: Record<PhotoFilterId, string>;
    fontNames: {
      app: string;
      serif: string;
      sans: string;
      mono: string;
      display: string;
    };
  };
  export: {
    format: string;
    download: string;
  };
  errors: {
    camera: Record<CameraFailure, string>;
    upload: string;
    export: string;
  };
  layoutNames: Record<TemplateId, string>;
}
