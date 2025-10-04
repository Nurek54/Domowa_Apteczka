// src/pages/AddPlan.tsx
import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
    addDoc,
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";

// Typ uproszczony leku tylko do selecta
type MedLite = { id: string; name: string; dose?: string };

const ALL_DAYS: Array<"monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday"|"sunday"> = [
    "monday","tuesday","wednesday","thursday","friday","saturday","sunday"
];

export default function AddPlan() {
    const [meds, setMeds] = useState<MedLite[]>([]);
    const [medicineId, setMedicineId] = useState("");
    const [name, setName] = useState("");
    const [notes, setNotes] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [frequency, setFrequency] = useState<string[]>(["monday", "tuesday"]); // domyślnie coś zaznaczone
    const [hours, setHours] = useState<string[]>(["08:00", "18:00"]);

    // pobierz leki użytkownika (tak jak w MyMeds → przez medicines_sets + medicines)
    useEffect(() => {
        const load = async () => {
            const user = auth.currentUser;
            if (!user) return;

            // znajdź zestaw leków zalogowanego
            const qSets = query(collection(db, "medicines_sets"), where("owner", "==", user.uid));
            const setsSnap = await getDocs(qSets);

            const medIds: string[] = [];
            setsSnap.forEach(d => {
                const arr = (d.data().medicines_id || []) as string[];
                medIds.push(...arr);
            });

            // jeśli nie ma leków — nic dalej
            if (!medIds.length) {
                setMeds([]);
                return;
            }

            // pobierz ich dokumenty
            const results: MedLite[] = [];
            // Firestore nie ma "in" po __name__ w tej prostszej wersji — lecimy pętlą
            for (const id of medIds) {
                const qMed = query(collection(db, "medicines"), where("__name__", "==", id));
                const medSnap = await getDocs(qMed);
                medSnap.forEach(ms => {
                    const d = ms.data() as any;
                    results.push({ id: ms.id, name: d.name, dose: d.dose });
                });
            }
            setMeds(results);
        };
        load();
    }, []);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        if (!canSubmit) {
            alert("Uzupełnij wymagane pola: nazwa, lek, data startu, co najmniej 1 dzień i 1 godzina.");
            return;
        }

        await addDoc(collection(db, "plans"), {
            owner: user.uid,          // 🔑 do filtrowania planów użytkownika
            name,
            medicine_id: medicineId,  // powiązanie z lekiem
            notes,
            start_date: startDate,    // "YYYY-MM-DD"
            end_date: endDate || "",  // jeśli brak — puste
            frequency,                // np. ["monday","tuesday"]
            hours                     // np. ["08:00","18:00"]
        });

        alert("Plan leczenia zapisany.");
        // reset
        setName("");
        setMedicineId("");
        setNotes("");
        setStartDate("");
        setEndDate("");
        setFrequency(["monday"]);
        setHours(["08:00"]);
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Dodaj plan leczenia</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Nazwa planu *</label>
                        <input className="w-full border rounded p-2"
                               value={name}
                               onChange={(e)=>setName(e.target.value)}
                               placeholder="Nazwa np. 'Antybiotyk – 7 dni'"
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
                        {!meds.length && (
                            <p className="text-xs text-gray-500 mt-1">
                                Nie masz jeszcze leków. Dodaj je w „Moje leki” → „Dodaj lek”.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Dni tygodnia *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {ALL_DAYS.map(d => (
                                <label key={d} className={`px-3 py-2 rounded-lg ring-1 cursor-pointer select-none
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
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Uwagi</label>
                        <textarea className="w-full border rounded p-2"
                                  value={notes} onChange={(e)=>setNotes(e.target.value)}
                                  placeholder="Dodatkowe instrukcje lekarza…" />
                    </div>

                    <button type="submit" className="w-full btn-primary" disabled={!canSubmit}>
                        Zapisz plan
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
