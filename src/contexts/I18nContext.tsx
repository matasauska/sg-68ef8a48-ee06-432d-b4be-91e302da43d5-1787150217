import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Locale = "en" | "lt" | "ru" | "pl" | "es" | "de" | "fr";

const defaultLocale: Locale = "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  loading: boolean;
  availableLocales: { code: Locale; label: string }[];
}

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("breedella-locale") : null;
    if (saved) setLocaleState(saved as Locale);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/locales/${locale}/common.json`)
      .then((r) => r.json())
      .then((data) => {
        setTranslations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("breedella-locale", l);
      document.documentElement.lang = l;
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = getNestedValue(translations, key);
      if (typeof value !== "string") return key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(new RegExp(`{${k}}`, "g"), String(v));
        });
      }
      return value;
    },
    [translations]
  );

  const availableLocales = [
    { code: "lt" as Locale, label: "Lietuvių" },
    { code: "en" as Locale, label: "English" },
    { code: "ru" as Locale, label: "Русский" },
    { code: "pl" as Locale, label: "Polski" },
    { code: "es" as Locale, label: "Español" },
    { code: "de" as Locale, label: "Deutsch" },
    { code: "fr" as Locale, label: "Français" },
  ];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, loading, availableLocales }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}