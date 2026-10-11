// src/components/ThemeToggle.tsx
import type { ReactElement } from "react";
import { useI18n } from "../i18n/context";
import type { TranslationKey } from "../i18n/translations";
import { useTheme, type Theme } from "../lib/theme";

const SunIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
);

const MoonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
);

const OPTIONS: { value: Theme; label: TranslationKey; Icon: () => ReactElement }[] = [
    { value: "light", label: "theme.light", Icon: SunIcon },
    { value: "dark", label: "theme.dark", Icon: MoonIcon },
];

export default function ThemeToggle({ className = "" }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const { t } = useI18n();

    return (
        <div
            role="group"
            aria-label={t("theme.label")}
            className={`inline-flex items-center gap-0.5 rounded-xl p-0.5 ring-1 ring-zinc-200 bg-white/80 dark:ring-zinc-700 dark:bg-zinc-900/80 ${className}`}
        >
            {OPTIONS.map(({ value, label: labelKey, Icon }) => {
                const active = theme === value;
                const label = t(labelKey);
                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setTheme(value)}
                        aria-pressed={active}
                        aria-label={label}
                        title={label}
                        className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
                            active
                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                        }`}
                    >
                        <Icon />
                    </button>
                );
            })}
        </div>
    );
}
