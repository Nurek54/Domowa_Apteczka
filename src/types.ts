// src/types.ts
export type ExpiryStatus = "ok" | "warning" | "expired";

export type Med = {
    id: string;
    name: string;
    form: string;
    quantity: number;
    unit: string;
    minQty: number;
    expDate: string;
    category: string;
    location: string;
    note: string;
    photoUrl: string;
    createdAt: string;
    updatedAt: string;
};

export type DosePlan = {
    id: string;
    medId: string;
    dose: number;
    unit: string;
    timesOfDay: string[]; // "08:00", "20:30"
    startDate: string;     // "YYYY-MM-DD"
    endDate?: string | null;
    daysOfWeek?: number[]; // 1..7 (Mon..Sun, PL styl)
    everyXDays?: number;   // alternatywa do daysOfWeek, liczone od startDate
    notes?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export type DoseMark = {
    id: string;            // `${planId}_${dueAtISO}`
    planId: string;
    medId: string;
    dueAt: string;         // ISO z lokalnym czasem, np. "2025-10-03T08:00:00+02:00"
    status: "taken" | "skipped";
    markedAt: string;
};

export type DayOccurrence = {
    key: string;           // `${planId}_${date}_${time}`
    planId: string;
    medId: string;
    medName: string;
    dose: number;
    unit: string;
    date: string;          // "YYYY-MM-DD"
    time: string;          // "HH:MM"
    dueAt: string;         // ISO lokalne
    mark?: DoseMark;
};
