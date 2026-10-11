// src/constants/categories.ts
// Etykiety kategorii są w src/i18n/translations.ts pod kluczami "category.<id>".

export type MedCategory =
    | "pain"
    | "fever"
    | "cold_flu"
    | "cough"
    | "allergy"
    | "gastro"
    | "derma"
    | "wound"
    | "vitamins"
    | "kids"
    | "cardio"
    | "respiratory"
    | "diabetes"
    | "antibiotic"
    | "other";

export type CategoryDef = {
    id: MedCategory;
    emoji: string; // emoji do UI
};

export const CATEGORIES: CategoryDef[] = [
    { id: "pain",        emoji: "💊" },
    { id: "fever",       emoji: "🌡️" },
    { id: "cold_flu",    emoji: "🤧" },
    { id: "cough",       emoji: "🗣️" },
    { id: "allergy",     emoji: "🌼" },
    { id: "gastro",      emoji: "🧃" },
    { id: "derma",       emoji: "🧴" },
    { id: "wound",       emoji: "🩹" },
    { id: "vitamins",    emoji: "💪" },
    { id: "kids",        emoji: "🧒" },
    { id: "cardio",      emoji: "❤️" },
    { id: "respiratory", emoji: "🫁" },
    { id: "diabetes",    emoji: "🩸" },
    { id: "antibiotic",  emoji: "🧫" },
    { id: "other",       emoji: "🏷️" },
];

export const CATEGORY_BY_ID: Record<MedCategory, CategoryDef> =
    CATEGORIES.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
    }, {} as Record<MedCategory, CategoryDef>);

type Translate = (key: string) => string | null;

/** Etykieta kategorii w bieżącym języku; stare wpisy z wolnym tekstem zwracane bez zmian. */
export function categoryLabel(raw: string | undefined, tryT: Translate): string {
    const id = (raw || "other").trim();
    return tryT(`category.${id}`) ?? id;
}

export function formatCategoryForDisplay(raw: string | undefined, tryT: Translate): string {
    const id = (raw || "other").trim();
    const known = CATEGORY_BY_ID[id as MedCategory];
    return `${known ? known.emoji : "🏷️"} ${categoryLabel(id, tryT)}`;
}
