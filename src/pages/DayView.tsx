// src/pages/DayView.tsx
import { useParams, Link } from "react-router-dom";
import { useMedStore } from "../store/medStore";
import { usePlanStore } from "../store/planStore";
import { useMemo } from "react";

export default function DayView() {
    const { ymd } = useParams(); // "YYYY-MM-DD"
    const meds = useMedStore(s=>s.meds);
    const { getDayAgenda, markDose } = usePlanStore();

    const items = useMemo(()=> getDayAgenda(ymd!, meds), [ymd, meds, getDayAgenda]);

    const snooze = (dueIso: string) => {
        const due = new Date(dueIso);
        const at = new Date(due.getTime() + 10*60*1000);
        try {
            if (Notification.permission === "granted") {
                const timeout = at.getTime() - Date.now();
                setTimeout(()=> new Notification("Przypomnienie — lek", {
                    body: `Czas wziąć lek (drzemka): ${due.toLocaleTimeString()}`,
                }), Math.max(1000, timeout));
            }
        } catch {}
        alert("Drzemka ustawiona na +10 min (lokalna).");
    };

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Dzień: {ymd}</h1>
                <Link to="/calendar" className="btn">← Kalendarz</Link>
            </div>

            {items.length===0 ? (
                <div className="card text-sm text-zinc-600">
                    Brak zaplanowanych dawek tego dnia.
                    <div className="mt-2"><Link className="btn" to="/plans/new">+ Dodaj plan</Link></div>
                </div>
            ) : (
                <div className="grid gap-2">
                    {items.map(it=>(
                        <div key={it.key} className="card flex items-center justify-between">
                            <div>
                                <div className="font-medium">
                                    {it.time} — {it.medName} <span className="text-zinc-500">{it.dose} {it.unit}</span>
                                </div>
                                <div className="text-xs text-zinc-500">due: {new Date(it.dueAt).toLocaleString()}</div>
                                {it.mark && (
                                    <div className={`text-xs mt-1 ${it.mark.status==="taken" ? "text-emerald-600" : "text-rose-600"}`}>
                                        {it.mark.status==="taken" ? "Wzięte" : "Pominięte"} · {new Date(it.mark.markedAt).toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    disabled={!!it.mark}
                                    onClick={()=>markDose(it.planId, it.dueAt, "taken")}
                                    className="btn-primary disabled:opacity-50"
                                >Weź</button>
                                <button
                                    disabled={!!it.mark}
                                    onClick={()=>markDose(it.planId, it.dueAt, "skipped")}
                                    className="btn"
                                >Pomiń</button>
                                <button onClick={()=>snooze(it.dueAt)} className="btn">Drzemka +10</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
