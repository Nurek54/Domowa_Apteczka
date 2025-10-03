// src/pages/Calendar.tsx
import { useMemo, useState } from "react";
import CalendarMonth from "../components/CalendarMonth";
import { useMedStore } from "../store/medStore";
import { usePlanStore } from "../store/planStore";
import { yyyyMmDd } from "../utils/schedule";
import { Link, useNavigate } from "react-router-dom";

export default function CalendarPage() {
    const nav = useNavigate();
    const meds = useMedStore(s=>s.meds);
    const { getMonthCounts } = usePlanStore();
    const [today] = useState(()=>yyyyMmDd(new Date()));
    const [cur, setCur] = useState(()=> {
        const d = new Date();
        return { y: d.getFullYear(), m: d.getMonth()+1 };
    });
    const [selected, setSelected] = useState<string>(today);

    const counts = useMemo(()=>getMonthCounts(cur.y, cur.m, meds),[cur, meds, getMonthCounts]);

    const prev = () => {
        let y = cur.y, m = cur.m-1;
        if (m===0) { m=12; y--; }
        setCur({y,m});
    };
    const next = () => {
        let y = cur.y, m = cur.m+1;
        if (m===13) { m=1; y++; }
        setCur({y,m});
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                    <div className="text-lg font-semibold">
                        {cur.y} — {cur.m.toString().padStart(2,"0")}
                    </div>
                    <div className="flex gap-2">
                        <button className="btn" onClick={prev}>← Poprzedni</button>
                        <button className="btn" onClick={next}>Następny →</button>
                    </div>
                </div>

                <CalendarMonth
                    year={cur.y} month={cur.m}
                    counts={counts}
                    selected={selected}
                    onSelect={(ymd)=>{ setSelected(ymd); nav(`/day/${ymd}`); }}
                />
            </div>

            <div className="lg:col-span-1">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Plany dawkowania</h3>
                        <Link to="/plans/new" className="btn-primary">+ Nowy plan</Link>
                    </div>
                    <p className="text-sm text-zinc-600 mt-2">
                        Dodaj plan dla leku (godziny, dni, dawka), aby zobaczyć go w kalendarzu i dostawać przypomnienia.
                    </p>
                    <Link to={`/day/${today}`} className="btn mt-3">Dzisiaj</Link>
                </div>
            </div>
        </div>
    );
}
