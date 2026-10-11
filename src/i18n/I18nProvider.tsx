// src/i18n/I18nProvider.tsx
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { I18nContext, type I18nValue } from "./context";
import { translations, type Lang, type TranslationKey } from "./translations";

const STORAGE_KEY = "lang";

/** Zapisany wybór, a bez niego język przeglądarki (polski albo angielski). */
function initialLang(): Lang {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (v === "pl" || v === "en") return v;
    } catch {
        /* brak dostępu do localStorage */
    }
    return navigator.language?.toLowerCase().startsWith("pl") ? "pl" : "en";
}

function interpolate(text: string, params?: Record<string, string | number>) {
    if (!params) return text;
    return text.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

export default function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>(initialLang);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const setLang = useCallback((next: Lang) => {
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* tryb prywatny: wybór działa do końca sesji */
        }
        setLangState(next);
    }, []);

    const value = useMemo<I18nValue>(() => {
        const dict = translations[lang];
        const plural = new Intl.PluralRules(lang);

        const t = (key: TranslationKey, params?: Record<string, string | number>) =>
            interpolate(dict[key] ?? translations.pl[key] ?? key, params);

        const tn = (base: string, count: number, params?: Record<string, string | number>) => {
            const key = `${base}_${plural.select(count)}` as TranslationKey;
            const fallback = `${base}_other` as TranslationKey;
            return interpolate(dict[key] ?? dict[fallback] ?? base, { count, ...params });
        };

        /** Tłumaczenie po kluczu złożonym w locie (np. "category." + id); null, gdy go nie ma. */
        const tryT = (key: string) => (key in dict ? dict[key as TranslationKey] : null);

        return { lang, setLang, t, tn, tryT };
    }, [lang, setLang]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
