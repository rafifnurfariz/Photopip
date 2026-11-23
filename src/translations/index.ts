// pusat ekspor semua kamus bahasa yang dipakai di PhotoPip
// ngumpulin 7 locale jadi satu objek messages plus helper buat validasi kode bahasa
import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { id } from "./locales/id";
import { ja } from "./locales/ja";
import { zh } from "./locales/zh";
import type { Language, Messages } from "./types";

// teruskan daftar bahasa dan tipe-nya biar bisa di-import dari satu pintu
export { languageNames, languages } from "./types";
export type { Language, Messages } from "./types";

// bahasa awal yang dipakai pas website baru dibuka
export const defaultLanguage: Language = "id";

// map kode bahasa ke objek teks terjemahannya masing-masing
export const messages: Record<Language, Messages> = {
  id,
  en,
  es,
  fr,
  de,
  ja,
  zh,
};

// cek string yang masuk beneran kode bahasa yang didukung atau nggak
export function isLanguage(value: string): value is Language {
  return Object.hasOwn(messages, value);
}
