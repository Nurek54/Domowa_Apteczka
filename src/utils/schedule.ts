// src/utils/schedule.ts
import type { DosePlan } from "../types";

export function yyyyMmDd(d: Date): string {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export function localIsoFor(dateYmd: string, timeHm: string): string {
    const [y, m, d] = dateYmd.split("-").map(Number);
    const [hh, mm] = timeHm.split(":").map(Number);
    const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
    const tz = -dt.getTimezoneOffset();
    const offH = Math.floor(tz / 60);
    const offM = tz % 60;
    const sign = tz >= 0 ? "+" : "-";
    const pad = (n: number) => `${Math.abs(n)}`.padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:00${sign}${pad(offH)}:${pad(offM)}`;
}

// Mon..Sun = 1..7
export function jsGetDowMonFirst(d: Date): number {
    const js = d.getDay(); // 0..6, Sun..Sat
    return js === 0 ? 7 : js; // 1..7 Mon..Sun
}

export function inRange(dateYmd: string, startYmd: string, endYmd?: string | null): boolean {
    if (dateYmd < startYmd) return false;
    if (endYmd && dateYmd > endYmd) return false;
    return true;
}

export function daysDiff(aYmd: string, bYmd: string): number {
    const a = new Date(aYmd + "T00:00");
    const b = new Date(bYmd + "T00:00");
    return Math.round((a.getTime() - b.getTime()) / (24 * 3600 * 1000));
}

export function planCoversDate(plan: DosePlan, dateYmd: string): boolean {
    if (!inRange(dateYmd, plan.startDate, plan.endDate ?? undefined)) return false;
    if (plan.everyXDays && plan.everyXDays > 0) {
        const diff = Math.abs(daysDiff(dateYmd, plan.startDate));
        return diff % plan.everyXDays === 0;
    }
    if (plan.daysOfWeek && plan.daysOfWeek.length) {
        const [y, m, d] = dateYmd.split("-").map(Number);
        const js = new Date(y, m - 1, d);
        const dow = jsGetDowMonFirst(js);
        return plan.daysOfWeek.includes(dow);
    }
    // domyślnie: codziennie
    return true;
}

export function monthMatrix(year: number, month: number, mondayFirst = true): Date[][] {
    // month 1..12
    const first = new Date(year, month - 1, 1);
    const grid: Date[][] = [];
    const start = new Date(first);
    const jsFirstDow = first.getDay(); // 0=Sun..6=Sat
    const shift = mondayFirst ? (jsFirstDow === 0 ? 6 : jsFirstDow - 1) : jsFirstDow;
    start.setDate(first.getDate() - shift);
    for (let w = 0; w < 6; w++) {
        const row: Date[] = [];
        for (let d = 0; d < 7; d++) {
            row.push(new Date(start));
            start.setDate(start.getDate() + 1);
        }
        grid.push(row);
    }
    return grid;
}
