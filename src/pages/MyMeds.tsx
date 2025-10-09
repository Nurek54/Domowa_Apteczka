// src/pages/MyMeds.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
    deleteDoc,
    arrayRemove,
} from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";
import {
    CATEGORIES,
    CATEGORY_BY_ID,
    formatCategoryForDisplay,
    type MedCategory,
} from "../constants/categories";

/* ───────── Types zgodne z bazą ───────── */
type Med = {
    id: string;
    name: string;
    dose: string;
    quantity: number;
    unit: string;
    date: string; // YYYY-MM-DD
    category: string; // może być ID (nowe) albo wolny tekst (stare)
    notes?: string;
};

type SortKey = "date" | "name" | "category" | "quantity";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "ok" | "soon" | "expired";

/* ───────── Helpers terminu ───────── */
const MS_PER_DAY = 24 * 60 * 60 * 1000;
function parseYMD(s: string) {
    // bez przesunięć TZ
    return new Date(`${s}T00:00:00`);
}
function daysUntil(ymd: string) {
    const today = new Date();
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.floor((parseYMD(ymd).getTime() - t0.getTime()) / MS_PER_DAY);
}
function statusOf(ymd: string): "ok" | "soon" | "expired" {
    const d = daysUntil(ymd);
    if (d < 0) return "expired";
    if (d <= 30) return "soon";
    return "ok";
}

export default function MyMeds() {
    const [meds, setMeds] = useState<Med[]>([]);
    const [userName, setUserName] = useState<string>("");

    // UI: filtry + sortowanie
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<SortKey>("date");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            // ── nazwa użytkownika ──
            try {
                const uref = doc(db, "users", user.uid);
                const usnap = await getDoc(uref);
                const name =
                    (usnap.exists() && (usnap.data() as any).name) || user.displayName;
                setUserName(name || user.email?.split("@")[0] || "User");
            } catch {
                setUserName(user.displayName || user.email?.split("@")[0] || "User");
            }

            // ── pobranie ID leków z medicines_sets ──
            const qSets = query(
                collection(db, "medicines_sets"),
                where("owner", "==", user.uid)
            );
            const setsSnap = await getDocs(qSets);

            const medIds: string[] = [];
            for (const s of setsSnap.docs) {
                const d = s.data() as any;
                if (Array.isArray(d.medicines_id)) medIds.push(...d.medicines_id);
            }

            // ── dociągnięcie dokumentów leków po ID ──
            const docs = await Promise.all(
                medIds.map(async (id) => {
                    const msnap = await getDoc(doc(db, "medicines", id));
                    if (!msnap.exists()) return null;
                    const data = msnap.data() as Omit<Med, "id">;
                    return { id: msnap.id, ...data } as Med;
                })
            );

            setMeds(docs.filter(Boolean) as Med[]);
        };

        fetchData();
    }, []);

    // Kategorie predefiniowane + ewentualne "inne" ze starych wpisów
    const categoryOptions = useMemo(() => {
        const knownIds = new Set<MedCategory>(CATEGORIES.map((c) => c.id));
        const extras = new Set<string>();
        meds.forEach((m) => {
            const raw = (m.category || "").trim();
            if (!raw) return;
            if (!knownIds.has(raw as MedCategory)) extras.add(raw);
        });
        return {
            predefined: CATEGORIES,
            extras: Array.from(extras).sort((a, b) => a.localeCompare(b)),
        };
    }, [meds]);

    // Liczniki do kafelków
    const { okCount, soonCount, expiredCount } = useMemo(() => {
        let ok = 0,
            soon = 0,
            exp = 0;
        meds.forEach((m) => {
            const s = statusOf(m.date);
            if (s === "ok") ok++;
            else if (s === "soon") soon++;
            else exp++;
        });
        return { okCount: ok, soonCount: soon, expiredCount: exp };
    }, [meds]);

    // Filtrowanie + sortowanie
    const visibleMeds = useMemo(() => {
        let arr = meds.slice();

        if (statusFilter !== "all") {
            arr = arr.filter((m) => statusOf(m.date) === statusFilter);
        }
        if (categoryFilter !== "all") {
            arr = arr.filter((m) => (m.category || "").trim() === categoryFilter);
        }

        arr.sort((a, b) => {
            let cmp = 0;
            switch (sortBy) {
                case "date":
                    cmp = parseYMD(a.date).getTime() - parseYMD(b.date).getTime();
                    break;
                case "name":
                    cmp = (a.name || "").localeCompare(b.name || "");
                    break;
                case "category":
                    // sortuj po etykiecie user-friendly
                    const A =
                        CATEGORY_BY_ID[a.category as MedCategory]?.label || a.category || "";
                    const B =
                        CATEGORY_BY_ID[b.category as MedCategory]?.label || b.category || "";
                    cmp = A.localeCompare(B);
                    break;
                case "quantity":
                    cmp = (a.quantity || 0) - (b.quantity || 0);
                    break;
            }
            return sortOrder === "asc" ? cmp : -cmp;
        });

        return arr;
    }, [meds, statusFilter, categoryFilter, sortBy, sortOrder]);

    const changeQty = async (id: string, delta: number) => {
        const med = meds.find((m) => m.id === id);
        if (!med) return;
        const newQty = Math.max(0, (med.quantity || 0) + delta);
        await updateDoc(doc(db, "medicines", id), { quantity: newQty });
        setMeds((prev) =>
            prev.map((m) => (m.id === id ? { ...m, quantity: newQty } : m))
        );
    };

    // Usuń lek: z `medicines` i odlinkuj z `medicines_sets` bieżącego usera
    const deleteMed = async (id: string) => {
        const user = auth.currentUser;
        if (!user) return;
        if (!confirm("Czy na pewno chcesz usunąć ten lek?")) return;

        // 1) usuń dokument leku
        await deleteDoc(doc(db, "medicines", id));

        // 2) zaktualizuj medicines_sets (usuń referencję)
        const qSet = query(
            collection(db, "medicines_sets"),
            where("owner", "==", user.uid)
        );
        const snap = await getDocs(qSet);
        if (!snap.empty) {
            const setRef = snap.docs[0].ref;
            try {
                // jeżeli pole jest tablicą
                await updateDoc(setRef, { medicines_id: arrayRemove(id) });
            } catch {
                // fallback (gdyby nie było arrayRemove)
                const data = snap.docs[0].data() as any;
                const next = (data.medicines_id || []).filter((x: string) => x !== id);
                await updateDoc(setRef, { medicines_id: next });
            }
        }

        // 3) lokalny stan
        setMeds((prev) => prev.filter((m) => m.id !== id));
    };

    // UI plakietki statusu
    const StatusPill = ({ date }: { date: string }) => {
        const d = daysUntil(date);
        const s = statusOf(date);
        if (s === "expired") {
            return (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 bg-rose-100 text-rose-700 ring-rose-200">
          Po terminie • {Math.abs(d)} dni
        </span>
            );
        }
        if (s === "soon") {
            return (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 bg-amber-100 text-amber-800 ring-amber-200">
          &lt; 30 dni • za {d} dni
        </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 bg-emerald-100 text-emerald-700 ring-emerald-200">
        W terminie • za {d} dni
      </span>
        );
    };

    return (
        <DashboardLayout>
            {/* Nagłówek + CTA */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">👋 Hello, {userName}</h1>
                    <p className="text-gray-500">Oto Twoja domowa apteczka</p>
                </div>
            </div>

            {/* Kafelki statusów */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <button
                    onClick={() => setStatusFilter("ok")}
                    className="rounded-2xl p-4 ring-1 ring-zinc-200 bg-white/60 dark:bg-zinc-900/40 text-left"
                >
                    <div className="text-sm text-gray-500 mb-1">W terminie</div>
                    <div className="text-3xl font-semibold">{okCount}</div>
                </button>
                <button
                    onClick={() => setStatusFilter("soon")}
                    className="rounded-2xl p-4 ring-1 ring-zinc-200 bg-white/60 dark:bg-zinc-900/40 text-left"
                >
                    <div className="text-sm text-gray-500 mb-1">&lt; 30 dni do terminu</div>
                    <div className="text-3xl font-semibold">{soonCount}</div>
                </button>
                <button
                    onClick={() => setStatusFilter("expired")}
                    className="rounded-2xl p-4 ring-1 ring-zinc-200 bg-white/60 dark:bg-zinc-900/40 text-left"
                >
                    <div className="text-sm text-gray-500 mb-1">Po terminie</div>
                    <div className="text-3xl font-semibold">{expiredCount}</div>
                </button>
            </div>

            {/* Pasek filtrów / sortowania */}
            <div className="rounded-2xl p-4 ring-1 ring-zinc-200 bg-white/60 dark:bg-zinc-900/40 mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-wrap gap-3">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">Status</label>
                        <select
                            className="border rounded px-3 py-2"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                        >
                            <option value="all">Wszystkie</option>
                            <option value="ok">W terminie</option>
                            <option value="soon">&lt; 30 dni</option>
                            <option value="expired">Po terminie</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">Kategoria</label>
                        <select
                            className="border rounded px-3 py-2"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">Wszystkie</option>
                            <optgroup label="Predefiniowane">
                                {categoryOptions.predefined.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.emoji} {c.label}
                                    </option>
                                ))}
                            </optgroup>
                            {categoryOptions.extras.length > 0 && (
                                <optgroup label="Inne (z danych)">
                                    {categoryOptions.extras.map((raw) => (
                                        <option key={raw} value={raw}>
                                            {raw}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">Sortuj wg</label>
                        <select
                            className="border rounded px-3 py-2"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortKey)}
                        >
                            <option value="date">Data ważności</option>
                            <option value="name">Nazwa</option>
                            <option value="category">Kategoria</option>
                            <option value="quantity">Ilość</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">Kierunek</label>
                        <select
                            className="border rounded px-3 py-2"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                        >
                            <option value="asc">Rosnąco</option>
                            <option value="desc">Malejąco</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista leków */}
            <h2 className="text-xl font-bold mb-4">Moje leki</h2>

            {visibleMeds.length === 0 ? (
                <p className="text-gray-500">Brak leków spełniających filtry.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleMeds.map((med) => (
                        <div
                            key={med.id}
                            className="bg-white shadow rounded-lg p-4 flex flex-col gap-2 border border-gray-100 hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg text-indigo-700">{med.name}</h3>
                                <StatusPill date={med.date} />
                            </div>

                            <p className="text-sm text-gray-600">Dawka: {med.dose}</p>
                            <p className="text-sm text-gray-600">
                                Ilość: {med.quantity} {med.unit}
                            </p>
                            <p className="text-sm text-gray-600">
                                Kategoria: {formatCategoryForDisplay(med.category)}
                            </p>
                            <p className="text-sm text-gray-600">Data ważności: {med.date}</p>
                            {med.notes && (
                                <p className="text-sm text-gray-500 border-t pt-2">Uwagi: {med.notes}</p>
                            )}

                            <div className="flex flex-wrap gap-2 mt-3">
                                <button
                                    onClick={() => changeQty(med.id, -1)}
                                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => changeQty(med.id, 1)}
                                    className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                >
                                    +
                                </button>

                                <button
                                    onClick={() => navigate(`/edit-med/${med.id}`)}
                                    className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                    Edytuj
                                </button>
                                <button
                                    onClick={() => deleteMed(med.id)}
                                    className="px-3 py-1 bg-rose-100 text-rose-700 rounded hover:bg-rose-200"
                                >
                                    Usuń
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
