"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/icons";
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
          <img src="/assets/brand/logo.png" alt="" width="38" height="38" />
          <span className="brand-text">
            <span className="brand-name">PhotoPip</span>
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
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
