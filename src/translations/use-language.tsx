"use client";

// context dan hook bahasa buat nyimpen pilihan bahasa aktif di seluruh aplikasi
// juga nyimpen preferensi bahasa ke localStorage biar gak ke-reset pas halaman di-reload
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLanguage,
  isLanguage,
  messages,
  type Language,
  type Messages,
} from "@/translations";

// key penyimpanan bahasa di localStorage browser
const STORAGE_KEY = "photobooth-language";

// isi data yang dibagiin lewat LanguageContext
interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Messages;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

// provider yang ngebungkus app supaya komponen di bawahnya bisa baca & ganti bahasa
export function LanguageProvider({ children }: { children: ReactNode }) {
  // state bahasa aktif, awalnya pakai bahasa default dulu biar aman pas SSR
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  // baca bahasa yang pernah disimpan user setelah komponen jalan di browser
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* Browser storage is optional for language preferences. */
    }
    if (!saved || !isLanguage(saved)) return;
    // tunda setState sebentar biar gak bentrok sama proses hydration awal
    const timer = setTimeout(() => setLanguageState(saved), 0);
    return () => clearTimeout(timer);
  }, []);

  // sinkronin atribut lang di tag <html> tiap kali bahasanya diganti
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // ganti bahasa aktif sekaligus simpan ke localStorage kalau browser ngizinin
  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Keep the session preference when persistence is blocked. */
    }
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: messages[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// hook buat ngambil bahasa aktif, fungsi ganti bahasa, sama objek teks t
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
