// src/pages/FamilyMemberMeds.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

type FamilyDoc = {
    name: string;
    users_id: string[];
    roles?: Record<string, "owner" | "admin" | "member" | "viewer">;
};

export default function FamilyMemberMeds() {
    const { familyId, uid } = useParams<{ familyId: string; uid: string }>();
    const [memberName, setMemberName] = useState<string>("");
    const [meds, setMeds] = useState<Med[]>([]);
    const [myRole, setMyRole] =
        useState<"owner" | "admin" | "member" | "viewer">("member");
    const me = auth.currentUser;

    const canEdit = useMemo(() => {
        if (!me) return false;
        if (me.uid === uid) return true;
        return myRole === "owner" || myRole === "admin";
    }, [me, uid, myRole]);

    useEffect(() => {
        const run = async () => {
            if (!uid || !familyId) return;

            // rola bieżącego usera w rodzinie
            if (me) {
                const fref = doc(db, "family", familyId);
                const fsnap = await getDoc(fref);
                if (fsnap.exists()) {
                    const fdata = fsnap.data() as FamilyDoc;
                    const roles = fdata.roles || {};
                    setMyRole((roles[me.uid] || "member") as typeof myRole);
                }
            }

            // dane członka
            const uref = doc(db, "users", uid);
            const usnap = await getDoc(uref);
            const uname = usnap.exists()
                ? (usnap.data().name ||
                    usnap.data().displayName ||
                    usnap.data().email?.split?.("@")?.[0])
                : "User";
            setMemberName(uname || "User");

            // leki członka (czytamy przez jego medicines_sets)
            const q = query(collection(db, "medicines_sets"), where("owner", "==", uid));
            const setsSnap = await getDocs(q);

            const acc: Med[] = [];
            for (const set of setsSnap.docs) {
                const data = set.data();
                for (const medId of data.medicines_id || []) {
                    // pobieramy dokument leku po ID
                    const msnap = await getDoc(doc(db, "medicines", medId));
                    if (msnap.exists()) {
                        acc.push({ id: msnap.id, ...(msnap.data() as Omit<Med, "id">) });
                    }
                }
            }
            setMeds(acc);
        };

        run();
    }, [uid, familyId]);

    const changeQty = async (id: string, delta: number) => {
        if (!canEdit) return;
        const med = meds.find((m) => m.id === id);
        if (!med) return;

        const newQty = Math.max(0, med.quantity + delta);
        await updateDoc(doc(db, "medicines", id), { quantity: newQty });

        setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, quantity: newQty } : m)));
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            💊 Leki: <span className="text-sky-600">{memberName}</span>
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Tryb: {canEdit ? "edycja dozwolona" : "tylko podgląd"}
                        </p>
                    </div>
                    <Link to="/family" className="btn">⬅️ Powrót do rodziny</Link>
                </div>

                {meds.length === 0 ? (
                    <p className="text-zinc-500">Brak leków do wyświetlenia.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {meds.map((med) => (
                            <div
                                key={med.id}
                                className="bg-white dark:bg-zinc-900 shadow rounded-lg p-4 border border-zinc-100 dark:border-zinc-800"
                            >
                                <h3 className="font-semibold text-lg text-indigo-700 dark:text-indigo-400">
                                    {med.name}
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Dawka: {med.dose}</p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Ilość: {med.quantity} {med.unit}
                                </p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Kategoria: {med.category}
                                </p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Data ważności: {med.date}
                                </p>

                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => changeQty(med.id, -1)}
                                        className="px-3 py-1 rounded ring-1 ring-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                                        disabled={!canEdit}
                                        title={canEdit ? "Zmniejsz ilość" : "Brak uprawnień do edycji"}
                                    >
                                        −
                                    </button>
                                    <button
                                        onClick={() => changeQty(med.id, 1)}
                                        className="px-3 py-1 rounded ring-1 ring-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                        disabled={!canEdit}
                                        title={canEdit ? "Zwiększ ilość" : "Brak uprawnień do edycji"}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
