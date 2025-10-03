// src/pages/NewPlan.tsx
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMedStore } from "../store/medStore";
import { usePlanStore } from "../store/planStore";
import { uid } from "../utils/id";
import { Link, useNavigate } from "react-router-dom";

const schema = z.object({
    medId: z.string().min(1),
    dose: z.coerce.number().min(0.1),
    unit: z.string().min(1),
    timesOfDay: z.string().min(1), // CSV
    startDate: z.string().min(10),
    endDate: z.string().optional(),
    mode: z.enum(["daily", "weekdays", "everyX"]),
    daysOfWeek: z.array(z.number()).optional(),
    everyXDays: z.coerce.number().optional(),
    notes: z.string().optional(),
    active: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function NewPlan() {
    const nav = useNavigate();
    const meds = useMedStore((s) => s.meds);
    const addPlan = usePlanStore((s) => s.addPlan);

    // 👇 KLUCZOWE: 3 generyki (TFieldValues, TContext, TTransformedValues)
    // + zodResolver<FormValues>(schema)
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues, any, FormValues>({
        resolver: zodResolver<FormValues>(schema),
        defaultValues: {
            medId: meds[0]?.id ?? "",
            dose: 1,
            unit: meds[0]?.unit ?? "szt",
            timesOfDay: "08:00, 20:00",
            startDate: new Date().toISOString().slice(0, 10),
            mode: "daily",
            daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
            everyXDays: 0,
            active: true,
        } satisfies Partial<FormValues>,
    });

    const medId = watch("medId");
    const med = meds.find((m) => m.id === medId);

    const onSubmit: SubmitHandler<FormValues> = async (f) => {
        const times = f.timesOfDay.split(",").map((s) => s.trim()).filter(Boolean);
        const plan = {
            id: uid("plan"),
            medId: f.medId,
            dose: f.dose,
            unit: f.unit || med?.unit || "szt",
            timesOfDay: times,
            startDate: f.startDate,
            endDate: (f.endDate?.trim() || "") || null,
            daysOfWeek:
                f.mode === "weekdays" ? f.daysOfWeek || [] : f.mode === "daily" ? [1, 2, 3, 4, 5, 6, 7] : [],
            everyXDays: f.mode === "everyX" ? f.everyXDays || 1 : undefined,
            notes: f.notes || "",
            active: f.active,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await addPlan(plan);
        nav("/calendar");
    };

    const toggleDow = (n: number) => {
        const cur = new Set(watch("daysOfWeek") || []);
        if (cur.has(n)) cur.delete(n);
        else cur.add(n);
        setValue("daysOfWeek", Array.from(cur).sort((a, b) => a - b), {
            shouldDirty: true,
            shouldTouch: true,
        });
    };

    return (
        <div className="mx-auto max-w-2xl p-6">
            <div className="mb-3 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Nowy plan dawkowania</h1>
                <Link to="/calendar" className="btn">← Kalendarz</Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div>
                    <label className="block text-sm mb-1">Lek</label>
                    <select {...register("medId")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300">
                        {meds.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm mb-1">Dawka</label>
                        <input type="number" step="0.1" {...register("dose")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Jednostka</label>
                        <input {...register("unit")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Godziny (CSV)</label>
                        <input {...register("timesOfDay")} placeholder="08:00, 20:00" className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1">Data startu</label>
                        <input type="date" {...register("startDate")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Data końca (opcjonalnie)</label>
                        <input type="date" {...register("endDate")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
                    </div>
                </div>

                <fieldset className="rounded-2xl ring-1 ring-zinc-200 p-3">
                    <legend className="text-sm px-1">Częstotliwość</legend>
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex items-center gap-2">
                            <input type="radio" value="daily" {...register("mode")} /> Codziennie
                        </label>
                        <label className="inline-flex items-center gap-2">
                            <input type="radio" value="weekdays" {...register("mode")} /> Wybrane dni
                        </label>
                        <label className="inline-flex items-center gap-2">
                            <input type="radio" value="everyX" {...register("mode")} /> Co X dni
                        </label>
                    </div>

                    <div className="mt-3">
                        <div className="text-xs text-zinc-500 mb-1">Dni tygodnia (Pon=1 … Ndz=7)</div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                <button
                                    type="button"
                                    key={n}
                                    onClick={() => toggleDow(n)}
                                    className={[
                                        "px-2 py-1 rounded-lg ring-1 ring-zinc-300",
                                        (watch("daysOfWeek") || []).includes(n) ? "bg-sky-100 ring-sky-300" : "",
                                    ].join(" ")}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm mb-1">Co ile dni</label>
                            <input type="number" min={1} {...register("everyXDays")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
                        </div>
                        <div className="flex items-end">
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input type="checkbox" {...register("active")} /> Aktywny
                            </label>
                        </div>
                    </div>
                </fieldset>

                <div>
                    <label className="block text-sm mb-1">Notatka</label>
                    <textarea {...register("notes")} className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-300" />
                </div>

                <div className="flex gap-2">
                    <button className="btn-primary" type="submit">Zapisz plan</button>
                    <Link to="/calendar" className="btn">Anuluj</Link>
                </div>

                {(errors as any).root && (
                    <div className="text-rose-600 text-sm">{(errors as any).root.message}</div>
                )}
            </form>
        </div>
    );
}
