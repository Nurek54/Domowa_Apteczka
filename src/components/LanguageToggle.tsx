// src/components/LanguageToggle.tsx
// Flagi jako SVG, bo Windows nie wyświetla emoji flag (pokazuje same litery "PL").
import type { ReactElement } from "react";
import { useI18n } from "../i18n/context";
import type { Lang } from "../i18n/translations";

const FlagPL = () => (
    <svg viewBox="0 0 16 10" className="h-3.5 w-[22px] rounded-[2px] ring-1 ring-black/10 dark:ring-white/15" aria-hidden="true">
        <rect width="16" height="5" fill="#ffffff" />
        <rect y="5" width="16" height="5" fill="#dc143c" />
    </svg>
);

const FlagGB = () => (
    <svg viewBox="0 0 60 30" className="h-3.5 w-[22px] rounded-[2px] ring-1 ring-black/10 dark:ring-white/15" aria-hidden="true">
        <clipPath id="gb-clip">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#gb-clip)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
);

const OPTIONS: { value: Lang; Flag: () => ReactElement }[] = [
    { value: "pl", Flag: FlagPL },
    { value: "en", Flag: FlagGB },
];

export default function LanguageToggle({ className = "" }: { className?: string }) {
    const { lang, setLang, t } = useI18n();

    return (
        <div
            role="group"
            aria-label={t("lang.label")}
            className={`inline-flex items-center gap-0.5 rounded-xl p-0.5 ring-1 ring-zinc-200 bg-white/80 dark:ring-zinc-700 dark:bg-zinc-900/80 ${className}`}
        >
            {OPTIONS.map(({ value, Flag }) => {
                const active = lang === value;
                const label = t(value === "pl" ? "lang.pl" : "lang.en");
                return (
                    <button
                        key={value}
                        type="button"
                        lang={value}
                        onClick={() => setLang(value)}
                        aria-pressed={active}
                        aria-label={label}
                        title={label}
                        className={`grid h-8 w-10 place-items-center rounded-lg transition ${
                            active
                                ? "bg-indigo-50 ring-1 ring-indigo-300 dark:bg-indigo-500/20 dark:ring-indigo-500/50"
                                : "opacity-60 hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                        <Flag />
                    </button>
                );
            })}
        </div>
    );
}
