// src/pages/AddMed.tsx
import { useState } from "react";
import { auth, db } from "../lib/firebase";
import {
    addDoc,
    collection,
    doc,
    updateDoc,
    arrayUnion,
    getDocs,
    query,
    where
} from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";

export function AddMed() {
    const [name, setName] = useState("");
    const [dose, setDose] = useState("");
    const [quantity, setQuantity] = useState<number>(0);
    const [unit, setUnit] = useState("pcs");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        // 1) dodaj dokument w "medicines" – BEZ timestampów
        const medRef = await addDoc(collection(db, "medicines"), {
            name,
            dose,
            quantity,
            unit,
            category,
            date,
            notes,
        });

        // 2) dopisz ID do "medicines_sets" zalogowanego użytkownika
        const q = query(collection(db, "medicines_sets"), where("owner", "==", user.uid));
        const snap = await getDocs(q);

        if (!snap.empty) {
            const setRef = doc(db, "medicines_sets", snap.docs[0].id);
            await updateDoc(setRef, { medicines_id: arrayUnion(medRef.id) });
        } else {
            await addDoc(collection(db, "medicines_sets"), {
                owner: user.uid,
                medicines_id: [medRef.id],
            });
        }

        alert("Lek dodany!");
        setName(""); setDose(""); setQuantity(0); setUnit("pcs");
        setCategory(""); setDate(""); setNotes("");
    };

    return (
        <DashboardLayout>
            <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Dodaj nowy lek</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nazwa leku</label>
                        <input className="w-full border rounded p-2" value={name} onChange={(e)=>setName(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Dawka</label>
                        <input className="w-full border rounded p-2" value={dose} onChange={(e)=>setDose(e.target.value)} required />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Ilość</label>
                            <input type="number" className="w-full border rounded p-2" value={quantity} onChange={(e)=>setQuantity(Number(e.target.value))} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Jednostka</label>
                            <select className="w-full border rounded p-2" value={unit} onChange={(e)=>setUnit(e.target.value)}>
                                <option value="pcs">szt</option>
                                <option value="ml">ml</option>
                                <option value="mg">mg</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Kategoria</label>
                        <input className="w-full border rounded p-2" value={category} onChange={(e)=>setCategory(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Data ważności</label>
                        <input type="date" className="w-full border rounded p-2" value={date} onChange={(e)=>setDate(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Uwagi</label>
                        <textarea className="w-full border rounded p-2" value={notes} onChange={(e)=>setNotes(e.target.value)} />
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 font-medium">
                        Zapisz
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
