// src/pages/EditPlan.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { auth, db } from "../lib/firebase";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

type MedLite = { id: string; name: string; dose?: string };
type PlanDoc = {
    owner?: string;
    name: string;
    medicine_id: string;
    notes?: string;
    start_date: string;
    end_date?: string;
    frequency: string[];
    hours: string[];
};

const ALL_DAYS: Array<"monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday"|"sunday"> = [
    "monday","tuesday","wednesday","thursday","friday","saturday","sunday"
];

export default function EditPlan() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [meds, setMeds] = useState<MedLite[]>([]);

    const [name, setName] = useState("");
    const [medicineId, setMedicineId] = useState("");
    const [notes, setNotes] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [frequency, setFrequency] = useState<string[]>([]);
    const [hours, setHours] = useState<string[]>([]);

    // załaduj plan + listę leków
    useEffect(() => {
        const load = async () => {
            const user = auth.currentUser;
            if (!user || !id) return;

            // lista leków (jak w AddPlan)
            const qSets = query(collection(db, "medicines_sets"), where("owner", "==", user.uid));
            const setsSnap = await getDocs(qSets);
            const medIds: string[] = [];
            setsSnap.forEach(d => medIds.push(...((d.data().medicines_id || []) as string[])));
            const results: MedLite[] = [];
            for (const mid of medIds) {
                const qMed = query(collection(db, "medicines"), where("__name__", "==", mid));
                const medSnap = await getDocs(qMed);
                medSnap.forEach(ms => {
                    const d = ms.data() as any;
                    results.push({ id: ms.id, name: d.name, dose: d.dose });
                });
            }
            setMeds(results);

            // plan
            const ref = doc(db, "plans", id);
            const snap = await getDoc(ref);
            if (!snap.exists()) {
                alert("Plan nie istnieje.");
                navigate("/plans", { replace: true });
                return;
            }
            const data = snap.data() as PlanDoc;

            // prosta autoryzacja klientowa (serwerowo zabezpiecz przez reguły)
            if (data.owner && data.owner !== user.uid) {
                alert("Nie masz dostępu do tego planu.");
                navigate("/plans", { replace: true });
                return;
            }

            setName(data.name || "");
            setMedicineId(data.medicine_id || "");
            setNotes(data.notes || "");
            setStartDate(data.start_date || "");
            setEndDate((data.end_date || "").trim());
            setFrequency(Array.isArray(data.frequency) ? data.frequency : []);
            setHours(Array.isArray(data.hours) ? data.hours : []);
            setLoading(false);
        };

        load();
    }, [id, navigate]);

    const dayChecked = (d: string) => frequency.includes(d);
    const toggleDay = (d: string) =>
        setFrequency(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

    const updateHour = (i: number, v: string) =>
        setHours(prev => prev.map((h, idx) => (idx === i ? v : h)));

    const addHour = () => setHours(prev => [...prev, "12:00"]);
    const removeHour = (i: number) =>
        setHours(prev => prev.filter((_, idx) => idx !== i));

    const canSubmit = useMemo(() => {
        return !!name && !!medicineId && !!startDate && frequency.length > 0 && hours.length > 0;
    }, [name, medicineId, startDate, frequency, hours]);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        const user = auth.currentUser;
        if (!user) return;

        await updateDoc(doc(db, "plans", id), {
            owner: user.uid,      // zachowujemy właściciela
            name,
            medicine_id: medicineId,
            notes,
            start_date: startDate,
            end_date: (endDate || "").trim(), // puste = bezterminowy
            frequency,
            hours,
        });

        alert("Zapisano zmiany.");
        navigate("/plans");
    };

    const remove = async () => {
        if (!id) return;
        if (!confirm("Na pewno usunąć ten plan?")) return;
        await deleteDoc(doc(db, "plans", id));
        navigate("/plans");
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="max-w-2xl mx-auto">Ładowanie…</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Edytuj plan leczenia</h2>
                <form onSubmit={save} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Nazwa planu *</label>
                        <input className="w-full border rounded p-2"
                               value={name}
                               onChange={(e)=>setName(e.target.value)}
                               required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Powiązany lek *</label>
                        <select className="w-full border rounded p-2"
                                value={medicineId}
                                onChange={(e)=>setMedicineId(e.target.value)}
                                required>
                            <option value="" disabled>— wybierz lek —</option>
                            {meds.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.name}{m.dose ? ` (${m.dose})` : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Dni tygodnia *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {ALL_DAYS.map(d => (
                                <label key={d}
                                       className={`px-3 py-2 rounded-lg ring-1 cursor-pointer select-none
                         ${dayChecked(d) ? "ring-indigo-500 bg-indigo-50 text-indigo-700"
                                           : "ring-gray-200 hover:bg-gray-50"}`}>
                                    <input type="checkbox" className="mr-2" checked={dayChecked(d)} onChange={()=>toggleDay(d)} />
                                    {d.charAt(0).toUpperCase() + d.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Godziny przyjęcia *</label>
                        <div className="space-y-2">
                            {hours.map((h, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input
                                        type="time"
                                        className="border rounded p-2"
                                        value={h}
                                        onChange={(e)=>updateHour(idx, e.target.value)}
                                        required
                                    />
                                    <button type="button" onClick={()=>removeHour(idx)}
                                            className="px-2 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200">
                                        Usuń
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addHour} className="btn">+ Dodaj godzinę</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium">Data startu *</label>
                            <input type="date" className="w-full border rounded p-2"
                                   value={startDate} onChange={(e)=>setStartDate(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Data końca (opcjonalnie)</label>
                            <input type="date" className="w-full border rounded p-2"
                                   value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
                            <p className="text-xs text-gray-500 mt-1">Pozostaw puste, jeśli plan jest bezterminowy.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Uwagi</label>
                        <textarea className="w-full border rounded p-2"
                                  value={notes} onChange={(e)=>setNotes(e.target.value)} />
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="btn-primary flex-1" disabled={!canSubmit}>Zapisz</button>
                        <button type="button" onClick={remove} className="btn text-red-700 ring-red-200">Usuń</button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
