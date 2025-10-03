// src/store/planStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { db } from "../lib/firebase";
import {
    collection, doc, setDoc, updateDoc, deleteDoc,
    onSnapshot, orderBy, query, type Unsubscribe
} from "firebase/firestore";
import type { DosePlan, DoseMark, DayOccurrence, Med } from "../types";
import { localIsoFor, planCoversDate } from "../utils/schedule";

type PlanState = {
    plans: DosePlan[];
    marks: Record<string, DoseMark>; // key = `${planId}_${dueAt}`
    syncReady: boolean;
};

type PlanActions = {
    startSync: () => void;
    addPlan: (p: DosePlan) => Promise<void>;
    updatePlan: (id: string, patch: Partial<DosePlan>) => Promise<void>;
    removePlan: (id: string) => Promise<void>;
    markDose: (planId: string, dueAtIso: string, status: "taken" | "skipped") => Promise<void>;

    getDayAgenda: (dateYmd: string, meds: Med[]) => DayOccurrence[];
    getMonthCounts: (year: number, month: number, meds: Med[]) => Record<string, number>;
};

const COL_PLANS = "plans";
const COL_MARKS = "dose_marks";

let unsubPlans: Unsubscribe | null = null;
let unsubMarks: Unsubscribe | null = null;

const safeStorage = createJSONStorage<PlanState>(() => localStorage);

export const usePlanStore = create<PlanState & PlanActions>()(
    persist(
        (set, get) => ({
            plans: [],
            marks: {},
            syncReady: false,

            startSync: () => {
                if (get().syncReady) return;
                if (!unsubPlans) {
                    const qy = query(collection(db, COL_PLANS), orderBy("createdAt"));
                    unsubPlans = onSnapshot(qy, (snap) => {
                        const arr = snap.docs.map((d) => d.data() as DosePlan);
                        set({ plans: arr, syncReady: true });
                    });
                }
                if (!unsubMarks) {
                    const qy2 = query(collection(db, COL_MARKS), orderBy("markedAt"));
                    unsubMarks = onSnapshot(qy2, (snap) => {
                        const acc: Record<string, DoseMark> = {};
                        for (const d of snap.docs) {
                            const mk = d.data() as DoseMark;
                            acc[mk.planId + "_" + mk.dueAt] = mk;
                        }
                        set({ marks: acc });
                    });
                }
            },

            addPlan: async (p) => {
                const now = new Date().toISOString();
                const payload: DosePlan = { ...p, createdAt: p.createdAt ?? now, updatedAt: now };
                await setDoc(doc(db, COL_PLANS, p.id), payload, { merge: false });
                set({ plans: [...get().plans.filter((x) => x.id !== p.id), payload] });
            },

            updatePlan: async (id, patch) => {
                const now = new Date().toISOString();
                await updateDoc(doc(db, COL_PLANS, id), { ...patch, updatedAt: now });
                set({ plans: get().plans.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: now } : p)) });
            },

            removePlan: async (id) => {
                await deleteDoc(doc(db, COL_PLANS, id));
                set({ plans: get().plans.filter((p) => p.id !== id) });
            },

            markDose: async (planId, dueAtIso, status) => {
                const plan = get().plans.find((p) => p.id === planId);
                if (!plan) return;
                const mark: DoseMark = {
                    id: `${planId}_${dueAtIso}`,
                    planId,
                    medId: plan.medId,
                    dueAt: dueAtIso,
                    status,
                    markedAt: new Date().toISOString(),
                };
                await setDoc(doc(db, COL_MARKS, mark.id), mark, { merge: false });
                set({ marks: { ...get().marks, [mark.id]: mark } });
            },

            getDayAgenda: (dateYmd, meds) => {
                const res: DayOccurrence[] = [];
                for (const p of get().plans) {
                    if (!p.active) continue;
                    if (!planCoversDate(p, dateYmd)) continue;
                    const med = meds.find((m) => m.id === p.medId);
                    const medName = med?.name ?? "(usunięty lek)";
                    for (const t of p.timesOfDay || []) {
                        const dueAt = localIsoFor(dateYmd, t);
                        const key = `${p.id}_${dateYmd}_${t}`;
                        const mk = get().marks[p.id + "_" + dueAt];
                        res.push({
                            key,
                            planId: p.id,
                            medId: p.medId,
                            medName,
                            dose: p.dose,
                            unit: p.unit,
                            date: dateYmd,
                            time: t,
                            dueAt,
                            mark: mk,
                        });
                    }
                }
                return res.sort((a, b) => a.time.localeCompare(b.time));
            },

            getMonthCounts: (year, month, meds) => {
                const out: Record<string, number> = {};
                const daysInMonth = new Date(year, month, 0).getDate();
                for (let d = 1; d <= daysInMonth; d++) {
                    const ymd = `${year}-${`${month}`.padStart(2, "0")}-${`${d}`.padStart(2, "0")}`;
                    out[ymd] = get().getDayAgenda(ymd, meds).length;
                }
                return out;
            },
        }),
        {
            name: "apteczka-plany",
            storage: safeStorage,
            version: 1,
        }
    )
);
