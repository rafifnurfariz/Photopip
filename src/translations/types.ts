// definisi daftar bahasa dan struktur lengkap kamus teks UI (Messages)
// semua file di folder locales wajib ngikutin bentuk interface ini biar gak ada teks yang ketinggalan
import type { TemplateId } from "@/shared-tools/catalog/templates";
import type { PhotoFilterId } from "@/shared-tools/composition/types";
import type { CameraFailure } from "@/features/studio/camera/camera-utils";

// kode 7 bahasa yang didukung di dropdown header
export const languages = ["id", "en", "es", "fr", "de", "ja", "zh"] as const;

export type Language = (typeof languages)[number];

// label nama bahasa yang ditampilin ke user di menu pilih bahasa
export const languageNames: Record<Language, string> = {
  id: "Indonesia",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
};

// cetakan semua key teks UI dari header, kamera, studio, editor, sampai pesan error
export interface Messages {
  // teks umum aplikasi dan toast notifikasi
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
  // label status dan pengaturan kamera
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
  // teks halaman studio pas ambil atau unggah foto
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
  // semua label tombol, tab, dan inspektor di halaman editor
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
      frame: string;
      photo: string;
      sticker: string;
      text: string;
      properties: string;
    };
    framePresets: string;
    frameHint: string;
    surprise: string;
    filters: string;
    photoLabel: string;
    retakePhoto: string;
    allCategories: string;
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
    uploadSticker: string;
    horizontal: string;
    vertical: string;
    size: string;
    rotation: string;
    remove: string;
    filterNames: Record<PhotoFilterId, string>;
  };
  // teks di bar unduh hasil strip
  export: {
    format: string;
    download: string;
  };
  // pesan error kamera, upload, dan gagal ekspor
  errors: {
    camera: Record<CameraFailure, string>;
    upload: string;
    export: string;
  };
  // nama 5 jenis template tata letak foto
  layoutNames: Record<TemplateId, string>;
}
