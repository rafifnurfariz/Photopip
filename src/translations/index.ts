import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { id } from "./locales/id";
import { ja } from "./locales/ja";
import { zh } from "./locales/zh";
import type { Language, Messages } from "./types";

export { languageNames, languages } from "./types";
export type { Language, Messages } from "./types";

export const defaultLanguage: Language = "id";

export const messages: Record<Language, Messages> = {
  id,
  en,
  es,
  fr,
  de,
  ja,
  zh,
};

export function isLanguage(value: string): value is Language {
  return value in messages;
}
