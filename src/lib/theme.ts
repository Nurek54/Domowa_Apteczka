// src/lib/theme.ts
import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const media = () => window.matchMedia?.("(prefers-color-scheme: dark)");

/** Zapisany wybór użytkownika albo null (wtedy decyduje motyw systemu). */
function storedTheme(): Theme | null {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        return v === "light" || v === "dark" ? v : null;
    } catch {
        return null;
    }
}

function systemTheme(): Theme {
    return media()?.matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => storedTheme() ?? systemTheme());

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    // Bez zapisanego wyboru podążamy za zmianą motywu systemu.
    useEffect(() => {
        const mq = media();
        if (!mq) return;
        const onChange = () => {
            if (!storedTheme()) setThemeState(systemTheme());
        };
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    const setTheme = useCallback((next: Theme) => {
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* tryb prywatny itp. - motyw działa do końca sesji */
        }
        setThemeState(next);
    }, []);

    return { theme, setTheme };
}
