// src/i18n/context.ts
import { createContext, useContext } from "react";
import type { Lang, TranslationKey } from "./translations";

export type I18nValue = {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (key: TranslationKey, params?: Record<string, string | number>) => string;
    tn: (base: string, count: number, params?: Record<string, string | number>) => string;
    tryT: (key: string) => string | null;
};

export const I18nContext = createContext<I18nValue | null>(null);

export function useI18n(): I18nValue {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n() musi być użyte wewnątrz <I18nProvider>.");
    return ctx;
}
