// src/components/CalendarMonth.tsx
import { useMemo } from "react";
import { monthMatrix, yyyyMmDd } from "../utils/schedule";

export default function CalendarMonth({
                                          year, month, counts, selected, onSelect
                                      }: {
    year: number; month: number; // 1..12
    counts: Record<string, number>;
    selected?: string;
    onSelect: (ymd: string) => void;
}) {
    const grid = useMemo(()=>monthMatrix(year, month, true),[year,month]);
    const today = yyyyMmDd(new Date());

    return (
        <div className="rounded-2xl ring-1 ring-zinc-200 overflow-hidden">
            <div className="grid grid-cols-7 bg-zinc-50 text-xs font-medium text-zinc-600">
                {["Pon","Wt","Śr","Czw","Pt","Sob","Ndz"].map(d=>
                    <div key={d} className="px-2 py-2 text-center">{d}</div>)}
            </div>
            {grid.map((row,i)=>(
                <div key={i} className="grid grid-cols-7">
                    {row.map((d)=>{
                        const ymd = yyyyMmDd(d);
                        const inMonth = (d.getMonth()+1)===month;
                        const isToday = ymd===today;
                        const isSel = selected===ymd;
                        const cnt = counts[ymd]||0;

                        return (
                            <button
                                key={ymd}
                                onClick={()=>onSelect(ymd)}
                                className={[
                                    "h-20 p-2 text-left border-t border-zinc-100 relative focus:outline-none",
                                    inMonth ? "bg-white" : "bg-zinc-50/60 text-zinc-400",
                                    isSel ? "ring-2 ring-sky-400 z-10" : "",
                                ].join(" ")}
                            >
                                <div className="text-xs">
                  <span className={[
                      "inline-flex items-center justify-center w-6 h-6 rounded-full",
                      isToday ? "bg-sky-600 text-white" : "",
                  ].join(" ")}>
                    {d.getDate()}
                  </span>
                                </div>
                                {cnt>0 && (
                                    <div className="absolute bottom-1 left-2 right-2 text-[11px]">
                                        <div className="truncate">
                      <span className="inline-block px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                        {cnt} dawek
                      </span>
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
