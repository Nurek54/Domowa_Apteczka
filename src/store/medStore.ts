import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Med } from "../types";

// 🔥 Firebase
import { db } from "../lib/firebase";
import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    type Unsubscribe,
} from "firebase/firestore";

type SortKey = "expDate" | "name" | "quantity";
type StatusFilter = "all" | "ok" | "warning" | "expired";
type Filter = { query: string; category: string | "all"; status: StatusFilter };

export type MedStoreState = {
    meds: Med[];
    filter: Filter;
    sortBy: SortKey;
    syncReady: boolean; // czy słuchamy Firestore
};

type Actions = {
    startSync: () => void;
    addMed: (m: Med) => Promise<void>;
    updateMed: (id: string, patch: Partial<Med>) => Promise<void>;
    removeMed: (id: string) => Promise<void>;
    consumeOne: (id: string) => Promise<void>;
    restock: (id: string, amount: number) => Promise<void>;
    setFilter: (f: Partial<Filter>) => void;
    setSortBy: (k: SortKey) => void;
    seedDemo: () => Promise<void>;
};

const initialState: MedStoreState = {
    meds: [],
    filter: { query: "", category: "all", status: "all" },
    sortBy: "expDate",
    syncReady: false,
};

/** Storage odporny na błędy localStorage */
const safeStorage = createJSONStorage<MedStoreState>(() => {
    const storage: Storage = {
        getItem(name: string) {
            try {
                return localStorage.getItem(name);
            } catch (e) {
                console.warn("getItem failed:", e);
                return null;
            }
        },
        setItem(name: string, value: string) {
            try {
                localStorage.setItem(name, value);
            } catch (e) {
                console.warn("setItem failed:", e);
            }
        },
        removeItem(name: string) {
            try {
                localStorage.removeItem(name);
            } catch (e) {
                console.warn("removeItem failed:", e);
            }
        },
        key: localStorage.key.bind(localStorage),
        clear() {
            try {
                localStorage.clear();
            } catch (e) {
                console.warn("clear failed:", e);
            }
        },
        get length() {
            return localStorage.length;
        },
    };
    return storage;
});

// —————————————————————————————————————————————
// Firestore helpers
const COL = "meds";
const colRef = collection(db, COL);

let unsub: Unsubscribe | null = null;
// —————————————————————————————————————————————

export const useMedStore = create<MedStoreState & Actions>()(
    persist(
        (set, get) => ({
            ...initialState,

            /** Uruchom nasłuch Firestore (wywołaj raz w App) */
            startSync: () => {
                if (get().syncReady || unsub) return; // już działa
                const qy = query(colRef, orderBy("name"));
                unsub = onSnapshot(
                    qy,
                    (snap) => {
                        const meds: Med[] = snap.docs
                            .map((d) => d.data() as Med)
                            // bezpieczeństwo: odfiltruj rekordy bez wymaganych pól
                            .filter((m) => m && m.id && m.name && typeof m.quantity === "number");
                        set({ meds, syncReady: true });
                    },
                    (e) => {
                        console.warn("Firestore onSnapshot error:", e);
                    }
                );
            },

            /** Dodaj lek (pisze do Firestore, UI zaktualizuje nasłuch) */
            addMed: async (m) => {
                const now = new Date().toISOString();
                const docRef = doc(db, COL, m.id);
                const payload: Med = { ...m, createdAt: m.createdAt ?? now, updatedAt: now };
                await setDoc(docRef, payload, { merge: false });
                // opcjonalnie optymistycznie:
                set({ meds: [...get().meds.filter((x) => x.id !== m.id), payload] });
            },

            /** Patch leku */
            updateMed: async (id, patch) => {
                const now = new Date().toISOString();
                const docRef = doc(db, COL, id);
                await updateDoc(docRef, { ...patch, updatedAt: now });
                // optymistycznie
                set({
                    meds: get().meds.map((x) =>
                        x.id === id ? { ...x, ...patch, updatedAt: now } : x
                    ),
                });
            },

            removeMed: async (id) => {
                const docRef = doc(db, COL, id);
                await deleteDoc(docRef);
                set({ meds: get().meds.filter((x) => x.id !== id) });
            },

            consumeOne: async (id) => {
                const item = get().meds.find((m) => m.id === id);
                const qty = Math.max(0, (item?.quantity ?? 0) - 1);
                await get().updateMed(id, { quantity: qty });
            },

            restock: async (id, amount) => {
                const item = get().meds.find((m) => m.id === id);
                const qty = (item?.quantity ?? 0) + Math.max(0, amount);
                await get().updateMed(id, { quantity: qty });
            },

            setFilter: (f) => {
                const cur = get().filter;
                const next: Filter = { ...cur, ...f };
                if (
                    cur.query === next.query &&
                    cur.category === next.category &&
                    cur.status === next.status
                )
                    return; // bez zmian
                set({ filter: next });
            },

            setSortBy: (k) => {
                if (get().sortBy === k) return;
                set({ sortBy: k });
            },

            /** Dodaje 3 rekordy demo do Firestore */
            seedDemo: async () => {
                const now = new Date().toISOString();
                const demo: Med[] = [
                    {
                        id: "demo-ibuprofen",
                        name: "Ibuprofen",
                        form: "200 mg tabletki",
                        quantity: 6,
                        unit: "szt",
                        minQty: 8,
                        expDate: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString(),
                        category: "przeciwbólowe",
                        location: "Łazienka",
                        note: "",
                        photoUrl: "",
                        createdAt: now,
                        updatedAt: now,
                    },
                    {
                        id: "demo-witamina-c",
                        name: "Witamina C",
                        form: "1000 mg",
                        quantity: 1,
                        unit: "szt",
                        minQty: 1,
                        expDate: new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString(),
                        category: "witaminy",
                        location: "Kuchnia",
                        note: "",
                        photoUrl: "",
                        createdAt: now,
                        updatedAt: now,
                    },
                    {
                        id: "demo-syrop",
                        name: "Syrop na kaszel",
                        form: "125 ml",
                        quantity: 0,
                        unit: "ml",
                        minQty: 50,
                        expDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
                        category: "przeciwzapalne",
                        location: "Apteczka",
                        note: "Dla dzieci 6+",
                        photoUrl: "",
                        createdAt: now,
                        updatedAt: now,
                    },
                ];

                await Promise.all(
                    demo.map((m) => setDoc(doc(db, COL, m.id), m, { merge: false }))
                );

                // optymistycznie odśwież lokalny stan (nasłuch i tak to dociągnie)
                set({ meds: demo });
            },
        }),
        {
            name: "domowa-apteczka",
            storage: safeStorage,
            version: 1,
            migrate: (persisted: unknown) => {
                try {
                    if (!persisted || typeof persisted !== "object") return initialState;
                    const obj = persisted as Partial<MedStoreState>;
                    if (!Array.isArray(obj.meds) || !obj.filter || !obj.sortBy) return initialState;
                    return { ...initialState, ...obj };
                } catch (e) {
                    console.warn("migrate failed:", e);
                    return initialState;
                }
            },
            onRehydrateStorage: () => (state, error) => {
                if (error && state) {
                    console.warn("rehydrate error:", error);
                    try {
                        localStorage.removeItem("domowa-apteczka");
                    } catch (e) {
                        console.warn("cleanup failed:", e);
                    }
                    state.filter = initialState.filter;
                    state.sortBy = initialState.sortBy;
                    state.meds = [];
                }
            },
        }
    )
);
