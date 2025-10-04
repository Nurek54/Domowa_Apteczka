import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import DashboardLayout from "../components/DashboardLayout";

type Med = {
    id: string;
    name: string;
    dose: string;
    quantity: number;
    unit: string;
    date: string;
    category: string;
};

export function MyMeds() {
    const [meds, setMeds] = useState<Med[]>([]);
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            // 🔹 Pobieramy name z dokumentu użytkownika w Firestore
            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists() && userSnap.data().name) {
                    setUserName(userSnap.data().name);
                } else {
                    // Fallback do displayName lub email
                    setUserName(user.displayName || user.email?.split("@")[0] || "User");
                }
            } catch (e) {
                console.warn("Błąd podczas pobierania danych użytkownika:", e);
                setUserName(user.displayName || user.email?.split("@")[0] || "User");
            }

            // 🔹 Pobieramy wszystkie leki należące do użytkownika
            const q = query(collection(db, "medicines_sets"), where("owner", "==", user.uid));
            const setsSnap = await getDocs(q);

            let allMeds: Med[] = [];
            for (const set of setsSnap.docs) {
                const data = set.data();
                for (const medId of data.medicines_id || []) {
                    const medSnap = await getDocs(
                        query(collection(db, "medicines"), where("__name__", "==", medId))
                    );
                    medSnap.forEach((m) =>
                        allMeds.push({ id: m.id, ...(m.data() as Med) })
                    );
                }
            }
            setMeds(allMeds);
        };

        fetchData();
    }, []);

    const changeQty = async (id: string, delta: number) => {
        const med = meds.find((m) => m.id === id);
        if (!med) return;

        const newQty = Math.max(0, med.quantity + delta);
        await updateDoc(doc(db, "medicines", id), { quantity: newQty });

        setMeds((prev) =>
            prev.map((m) => (m.id === id ? { ...m, quantity: newQty } : m))
        );
    };

    return (
        <DashboardLayout>
            {/* 🔹 Powitanie */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    👋 Hello, {userName}
                </h1>
                <p className="text-gray-500">Oto Twoja domowa apteczka</p>
            </div>

            <h2 className="text-xl font-bold mb-4">Moje leki</h2>

            {meds.length === 0 ? (
                <p className="text-gray-500">Nie masz jeszcze żadnych leków.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {meds.map((med) => (
                        <div
                            key={med.id}
                            className="bg-white shadow rounded-lg p-4 flex flex-col gap-2 border border-gray-100 hover:shadow-md transition"
                        >
                            <h3 className="font-semibold text-lg text-indigo-700">{med.name}</h3>
                            <p className="text-sm text-gray-600">Dawka: {med.dose}</p>
                            <p className="text-sm text-gray-600">
                                Ilość: {med.quantity} {med.unit}
                            </p>
                            <p className="text-sm text-gray-600">Kategoria: {med.category}</p>
                            <p className="text-sm text-gray-600">Data ważności: {med.date}</p>

                            <div className="flex gap-2 mt-3">
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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
