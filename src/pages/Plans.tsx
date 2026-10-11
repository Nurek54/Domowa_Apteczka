// src/pages/Plans.tsx
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { auth, db } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
    addMonths, endOfMonth, endOfWeek,
    format, isAfter, isBefore, isSameDay, isSameMonth,
    parseISO, startOfMonth, startOfWeek, addDays
} from "date-fns";
import { pl as plLocale, enUS } from "date-fns/locale";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/context";
import type { TranslationKey } from "../i18n/translations";

type Plan = {
    id: string;
    owner?: string;
    name: string;
    medicine_id: string;
    notes?: string;
    start_date: string; // YYYY-MM-DD
    end_date?: string;  // "" lub YYYY-MM-DD
    frequency: string[]; // ["monday",...]
    hours: string[];     // ["08:00",...]
};

type MedLite = { id: string; name: string; dose?: string };

const DOW: Array<"monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday"|"sunday"> =
    ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

function weekdayToIndex(d: string): number {
    return DOW.indexOf(d as any); // 0..6 (pn..nd)
}

export default function Plans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [meds, setMeds] = useState<MedLite[]>([]);
    const [month, setMonth] = useState<Date>(new Date());
    const { lang, t } = useI18n();
    const locale = lang === "pl" ? plLocale : enUS;
    const monthLabel = format(month, "LLLL yyyy", { locale });
    const dayShort = (d: string) => t(`dayShort.${d}` as TranslationKey);

    useEffect(() => {
        const load = async () => {
            const user = auth.currentUser;
            if (!user) return;

            // 1) plany użytkownika
            const qPlans = query(collection(db, "plans"), where("owner", "==", user.uid));
            const plansSnap = await getDocs(qPlans);
            const allPlans: Plan[] = [];
            plansSnap.forEach(d => allPlans.push({ id: d.id, ...(d.data() as any) }));
            setPlans(allPlans);

            // 2) leki użytkownika (przez medicines_sets)
            const qSets = query(collection(db, "medicines_sets"), where("owner", "==", user.uid));
            const setsSnap = await getDocs(qSets);
            const medIds: string[] = [];
            setsSnap.forEach(s => medIds.push(...((s.data().medicines_id || []) as string[])));

            const medList: MedLite[] = [];
            for (const id of medIds) {
                const qMed = query(collection(db, "medicines"), where("__name__", "==", id));
                const snap = await getDocs(qMed);
                snap.forEach(ms => {
                    const d = ms.data() as any;
                    medList.push({ id: ms.id, name: d.name, dose: d.dose });
                });
            }
            setMeds(medList);
        };
        load();
    }, []);

    const medNameById = (id: string) => {
        const m = meds.find(x => x.id === id);
        if (!m) return t("plans.unknownMed");
        return m.dose ? `${m.name} (${m.dose})` : m.name;
    };

    // wystąpienia w miesiącu; brak domyślnego końca → plan jest ważny od start_date bez ograniczeń
    const occByDay = useMemo(() => {
        const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
        const map = new Map<string, { time: string; text: string; planId: string }[]>();

        for (let d = start; !isAfter(d, end); d = addDays(d, 1)) {
            map.set(format(d, "yyyy-MM-dd"), []);
        }

        for (const p of plans) {
            const pStart = parseISO(p.start_date);
            const endStr = (p.end_date || "").trim();
            const pEnd = endStr ? parseISO(endStr) : null; // null = bezterminowy

            for (let d = start; !isAfter(d, end); d = addDays(d, 1)) {
                const inRange =
                    !isBefore(d, pStart) &&
                    (pEnd ? !isAfter(d, pEnd) : true); // brak końca → zawsze po starcie

                if (!inRange) continue;

                const dow = (d.getDay() + 6) % 7; // pn=0..nd=6
                const active = p.frequency.some(f => weekdayToIndex(f) === dow);
                if (!active) continue;

                for (const h of p.hours) {
                    const time = h.length === 5 ? h : h.padStart(5, "0");
                    const text = `${time} · ${medNameById(p.medicine_id)} · ${p.name}`;
                    const key = format(d, "yyyy-MM-dd");
                    map.get(key)?.push({ time, text, planId: p.id });
                }
            }
        }

        for (const [k, arr] of map) {
            arr.sort((a, b) => a.time.localeCompare(b.time));
            map.set(k, arr);
        }
        return map;
    }, [plans, meds, month, t]);

    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const cells: Date[] = [];
    for (let d = start; !isAfter(d, end); d = addDays(d, 1)) cells.push(d);

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">{t("plans.title")}</h2>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">
                            {t("plans.monthView", { month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1) })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/addplan" className="btn">{t("plans.add")}</Link>
                        <button className="btn" onClick={()=>setMonth(addMonths(month, -1))}>{t("plans.prev")}</button>
                        <button className="btn" onClick={()=>setMonth(new Date())}>{t("plans.today")}</button>
                        <button className="btn" onClick={()=>setMonth(addMonths(month, 1))}>{t("plans.next")}</button>
                    </div>
                </div>

                {/* nagłówki dni */}
                <div className="grid grid-cols-7 text-xs font-medium text-gray-500 dark:text-zinc-400 mb-2 px-1">
                    {DOW.map((d) => (
                        <div key={d} className="px-2 py-1">{dayShort(d)}</div>
                    ))}
                </div>

                {/* kalendarz */}
                <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-zinc-800 rounded-lg overflow-hidden">
                    {cells.map((d) => {
                        const dayKey = format(d, "yyyy-MM-dd");
                        const items = occByDay.get(dayKey) || [];
                        return (
                            <div key={dayKey}
                                 className={`min-h-[110px] p-2 flex flex-col ${
                                     !isSameMonth(d, month)
                                         ? "bg-gray-50 dark:bg-zinc-950 text-gray-400 dark:text-zinc-500"
                                         : "bg-white dark:bg-zinc-900"}`}>
                                <div className="text-sm mb-1 flex items-center justify-between">
                  <span className={`font-medium ${isSameDay(d, new Date()) ? "text-indigo-600 dark:text-indigo-400" : ""}`}>
                    {format(d, "d")}
                  </span>
                                    {isSameDay(d, new Date()) && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300">{t("plans.todayBadge")}</span>
                                    )}
                                </div>
                                <div className="space-y-1 overflow-auto">
                                    {items.map((ev, i) => (
                                        <Link
                                            key={i}
                                            to={`/editplan/${ev.planId}`}
                                            className="block text-[11px] leading-snug px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/25"
                                            title={t("plans.editPlan")}
                                        >
                                            {ev.text}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* lista planów */}
                <div className="mt-8">
                    <h3 className="font-semibold mb-2">{t("plans.yourPlans")}</h3>
                    {plans.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-zinc-400">{t("plans.empty")}</p>
                    ) : (
                        <ul className="text-sm list-disc pl-5 space-y-1">
                            {plans.map(p => (
                                <li key={p.id}>
                                    <span className="font-medium">{p.name}</span>
                                    {" · "}{medNameById(p.medicine_id)}
                                    {" · "}{t("plans.days", { value: p.frequency.map(dayShort).join(", ") })}
                                    {" · "}{t("plans.hours", { value: p.hours.join(", ") })}
                                    {" · "}{p.end_date
                                        ? t("plans.range", { start: p.start_date, end: p.end_date })
                                        : t("plans.rangeOpen", { start: p.start_date })}
                                    <Link to={`/editplan/${p.id}`} className="ml-2 underline text-indigo-700 dark:text-indigo-300">{t("common.edit")}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
