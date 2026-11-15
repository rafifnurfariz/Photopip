"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { isLanguage, languageNames, languages } from "@/translations";
import { useLanguage } from "@/translations/use-language";

const subscribe = () => () => {};

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === "dark";
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        {t.app.skip}
      </a>
      <div className="header-inner">
        <Link className="brand" href="/">
          <img src="/assets/brand/logo.png" alt="" />
          <span className="brand-text">
            <span className="brand-name">PhotoPip</span>
            <span className="brand-caption">{t.app.studio}</span>
          </span>
        </Link>
        <div className="header-controls">
          <label className="language-control">
            <span className="sr-only">{t.app.language}</span>
            <select
              value={language}
              onChange={(event) => {
                const next = event.target.value;
                if (isLanguage(next)) setLanguage(next);
              }}
              aria-label={t.app.language}
            >
              {languages.map((code) => (
                <option key={code} value={code}>
                  {languageNames[code]}
                </option>
              ))}
            </select>
          </label>
          <button
            className="theme-control"
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? t.app.light : t.app.dark}
          >
            <span aria-hidden="true">{isDark ? "☀" : "◐"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
