import { Link, useNavigate } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import MedCard from "../components/MedCard";
import { useMedStore } from "../store/medStore";
import { useMemo } from "react";

export default function Dashboard() {
    const nav = useNavigate();

    // wąskie selektory – minimalne zależności
    const meds   = useMedStore((s) => s.meds);
    const filter = useMedStore((s) => s.filter);
    const sortBy = useMedStore((s) => s.sortBy);
    const seedDemo = useMedStore((s) => s.seedDemo);

    const list = useMemo(() => {
        const q = (filter.query || "").trim().toLowerCase();
        let arr = meds.filter((m) => {
            if (q && !m.name.toLowerCase().includes(q)) return false;
            if (filter.category !== "all" && (m.category || "") !== filter.category) return false;

            // status ważności – szybka lokalna logika
            const today = new Date(); today.setHours(0,0,0,0);
            const exp = new Date(m.expDate); exp.setHours(0,0,0,0);
            const in30 = new Date(today); in30.setDate(in30.getDate() + 30);

            const st = exp < today ? "expired" : (exp <= in30 ? "warning" : "ok");
            if (filter.status !== "all" && st !== filter.status) return false;
            return true;
        });

        arr = arr.slice().sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "quantity") return (a.quantity ?? 0) - (b.quantity ?? 0);
            return new Date(a.expDate).getTime() - new Date(b.expDate).getTime();
        });

        return arr;
    }, [meds, filter, sortBy]);

    const { expired, warn, low } = useMemo(() => {
        let expired = 0, warn = 0;
        for (const m of meds) {
            const today = new Date(); today.setHours(0,0,0,0);
            const exp = new Date(m.expDate); exp.setHours(0,0,0,0);
            const in30 = new Date(today); in30.setDate(in30.getDate() + 30);
            if (exp < today) expired++; else if (exp <= in30) warn++;
        }
        const low = meds.filter((m) => (m.quantity ?? 0) < (m.minQty ?? 0)).length;
        return { expired, warn, low };
    }, [meds]);

    return (
        <>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl p-4 bg-rose-50 ring-1 ring-rose-200">
                    <div className="text-sm text-rose-700">Przeterminowane</div>
                    <div className="text-2xl font-bold">{expired}</div>
                </div>
                <div className="rounded-2xl p-4 bg-amber-50 ring-1 ring-amber-200">
                    <div className="text-sm text-amber-700">≤ 30 dni</div>
                    <div className="text-2xl font-bold">{warn}</div>
                </div>
                <div className="rounded-2xl p-4 bg-sky-50 ring-1 ring-sky-200">
                    <div className="text-sm text-sky-700">Niski stan</div>
                    <div className="text-2xl font-bold">{low}</div>
                </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <FilterBar />
                <div className="flex items-center gap-2">
                    <Link to="/add" className="btn-primary">Dodaj lek</Link>
                    <button onClick={seedDemo} className="btn">Załaduj demo</button>
                </div>
            </div>

            {list.length === 0 ? (
                <div className="text-zinc-500 text-sm">
                    Brak pozycji — kliknij <b>Załaduj demo</b> albo dodaj lek.
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {list.map((m) => (
                        <MedCard key={m.id} med={m} onOpen={(id) => nav(`/med/${id}`)} />
                    ))}
                </div>
            )}
        </>
    );
}
