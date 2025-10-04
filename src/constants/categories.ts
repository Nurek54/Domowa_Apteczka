// src/constants/categories.ts

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
    label: string;  // PL opis do UI
    emoji: string;  // emoji do UI
};

export const CATEGORIES: CategoryDef[] = [
    { id: "pain",        label: "Ból / przeciwbólowe",                 emoji: "💊" },
    { id: "fever",       label: "Gorączka / przeciwgorączkowe",        emoji: "🌡️" },
    { id: "cold_flu",    label: "Przeziębienie / grypa",               emoji: "🤧" },
    { id: "cough",       label: "Kaszel",                              emoji: "🗣️" },
    { id: "allergy",     label: "Alergia / antyhistaminowe",           emoji: "🌼" },
    { id: "gastro",      label: "Żołądek / jelita",                    emoji: "🧃" },
    { id: "derma",       label: "Skóra / dermatologia",                emoji: "🧴" },
    { id: "wound",       label: "Rany / opatrunki / antyseptyki",      emoji: "🩹" },
    { id: "vitamins",    label: "Witaminy / suplementy",               emoji: "💪" },
    { id: "kids",        label: "Dziecięce",                           emoji: "🧒" },
    { id: "cardio",      label: "Układ krążenia",                      emoji: "❤️" },
    { id: "respiratory", label: "Układ oddechowy",                     emoji: "🫁" },
    { id: "diabetes",    label: "Cukrzyca",                            emoji: "🩸" },
    { id: "antibiotic",  label: "Antybiotyki (na receptę)",            emoji: "🧫" },
    { id: "other",       label: "Inne",                                emoji: "🏷️" },
];

export const CATEGORY_BY_ID: Record<MedCategory, CategoryDef> =
    CATEGORIES.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
    }, {} as Record<MedCategory, CategoryDef>);

export function formatCategoryForDisplay(raw?: string): string {
    if (!raw) return `${CATEGORY_BY_ID.other.emoji} ${CATEGORY_BY_ID.other.label}`;
    const known = CATEGORY_BY_ID[raw as MedCategory];
    if (known) return `${known.emoji} ${known.label}`;
    return `🏷️ ${raw}`;
}
