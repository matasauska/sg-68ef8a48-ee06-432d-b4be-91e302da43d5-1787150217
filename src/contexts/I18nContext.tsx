import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import en from "../../locales/en/common.json";
import lt from "../../locales/lt/common.json";
import ru from "../../locales/ru/common.json";
import pl from "../../locales/pl/common.json";
import es from "../../locales/es/common.json";
import de from "../../locales/de/common.json";
import fr from "../../locales/fr/common.json";

export type Locale = "en" | "lt" | "ru" | "pl" | "es" | "de" | "fr";

const translationsMap: Record<Locale, any> = { en, lt, ru, pl, es, de, fr };

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("breedella-locale") : null;
    if (saved && saved in translationsMap) {
      setLocaleState(saved as Locale);
    }
    setLoading(false);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("breedella-locale", l);
      document.documentElement.lang = l;
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const data = translationsMap[locale] || translationsMap[defaultLocale];
      let value = getNestedValue(data, key);
      if (typeof value !== "string") {
        // Fallback to English if key missing in current locale
        const fallback = getNestedValue(translationsMap[defaultLocale], key);
        value = typeof fallback === "string" ? fallback : key;
      }
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(new RegExp(`{${k}}`, "g"), String(v));
        });
      }
      return value;
    },
    [locale]
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