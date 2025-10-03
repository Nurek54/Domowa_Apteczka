// src/pages/Medicines.tsx
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { Link } from "react-router-dom";

type Med = {
    id: string;
    name: string;
    dose: string;
    quantity: number;
    unit: string;
    date: string;
    category: string;
    notes?: string;
    owner: string;
};

export default function Medicines() {
    const [meds, setMeds] = useState<Med[]>([]);

    useEffect(() => {
        if (!auth.currentUser) return;
        const q = query(collection(db, "medicines"), where("owner", "==", auth.currentUser.uid));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
                quantity: Number(d.data().quantity),
            })) as Med[];
            setMeds(data);
        });
        return () => unsub();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Moje leki</h1>
            <Link to="/add" className="btn-primary mb-4 inline-block">+ Dodaj lek</Link>

            {meds.length === 0 ? (
                <p>Brak leków.</p>
            ) : (
                <ul className="space-y-2">
                    {meds.map((m) => (
                        <li key={m.id} className="card p-3">
                            <div className="font-semibold">{m.name}</div>
                            <div className="text-sm text-zinc-600">
                                {m.dose} · {m.quantity} {m.unit} · ważność: {m.date}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
