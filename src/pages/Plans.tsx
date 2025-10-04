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
import { Link } from "react-router-dom";

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
        if (!m) return "(nieznany lek)";
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
                    const text = `${time} — ${medNameById(p.medicine_id)} • ${p.name}`;
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
    }, [plans, meds, month]);

    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const cells: Date[] = [];
    for (let d = start; !isAfter(d, end); d = addDays(d, 1)) cells.push(d);

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Kalendarz planów</h2>
                        <p className="text-sm text-gray-500">
                            Widok miesiąca: {format(month, "LLLL yyyy")}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/addplan" className="btn">➕ Dodaj plan</Link>
                        <button className="btn" onClick={()=>setMonth(addMonths(month, -1))}>← Poprzedni</button>
                        <button className="btn" onClick={()=>setMonth(new Date())}>Dziś</button>
                        <button className="btn" onClick={()=>setMonth(addMonths(month, 1))}>Następny →</button>
                    </div>
                </div>

                {/* nagłówki dni */}
                <div className="grid grid-cols-7 text-xs font-medium text-gray-500 mb-2 px-1">
                    {["Pon","Wto","Śro","Czw","Pią","Sob","Ndz"].map((d) => (
                        <div key={d} className="px-2 py-1">{d}</div>
                    ))}
                </div>

                {/* kalendarz */}
                <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                    {cells.map((d) => {
                        const dayKey = format(d, "yyyy-MM-dd");
                        const items = occByDay.get(dayKey) || [];
                        return (
                            <div key={dayKey}
                                 className={`min-h-[110px] bg-white p-2 flex flex-col ${
                                     !isSameMonth(d, month) ? "bg-gray-50 text-gray-400" : ""}`}>
                                <div className="text-sm mb-1 flex items-center justify-between">
                  <span className={`font-medium ${isSameDay(d, new Date()) ? "text-indigo-600" : ""}`}>
                    {format(d, "d")}
                  </span>
                                    {isSameDay(d, new Date()) && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">dziś</span>
                                    )}
                                </div>
                                <div className="space-y-1 overflow-auto">
                                    {items.length === 0 ? (
                                        <div className="text-xs text-gray-300">—</div>
                                    ) : items.map((ev, i) => (
                                        <Link
                                            key={i}
                                            to={`/editplan/${ev.planId}`}
                                            className="block text-[11px] leading-snug px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                            title="Edytuj plan"
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
                    <h3 className="font-semibold mb-2">Twoje plany</h3>
                    {plans.length === 0 ? (
                        <p className="text-sm text-gray-500">Brak planów. Dodaj pierwszy.</p>
                    ) : (
                        <ul className="text-sm list-disc pl-5 space-y-1">
                            {plans.map(p => (
                                <li key={p.id}>
                                    <span className="font-medium">{p.name}</span>{" "}
                                    – {medNameById(p.medicine_id)} • dni: {p.frequency.join(", ")} • godz.: {p.hours.join(", ")} •
                                    {` `}od {p.start_date}{p.end_date ? ` do ${p.end_date}` : " (bez końca)"}
                                    {"  "}
                                    <Link to={`/editplan/${p.id}`} className="ml-2 underline text-indigo-700">Edytuj</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
