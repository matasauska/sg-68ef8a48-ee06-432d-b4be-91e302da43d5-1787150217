import { useState, useEffect, useCallback } from "react";

type Locale = "en" | "lt" | "ru" | "pl" | "es" | "de" | "fr";

const defaultLocale: Locale = "en";

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function useI18n() {
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

  return { locale, setLocale, t, loading };
}

export const availableLocales: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "lt", label: "Lietuvių" },
  { code: "ru", label: "Русский" },
  { code: "pl", label: "Polski" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
];