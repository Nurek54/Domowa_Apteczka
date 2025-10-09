// src/pages/EditMed.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import DashboardLayout from "../components/DashboardLayout";
import { CATEGORIES, CATEGORY_BY_ID } from "../constants/categories";

export default function EditMed() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        dose: "",
        quantity: 0,
        unit: "",
        date: "",
        category: "",
        notes: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMed = async () => {
            if (!id) return;
            try {
                const ref = doc(db, "medicines", id);
                const snap = await getDoc(ref);
                if (!snap.exists()) {
                    setError("Nie znaleziono leku.");
                    return;
                }
                const data = snap.data();
                setForm({
                    name: data.name || "",
                    dose: data.dose || "",
                    quantity: data.quantity || 0,
                    unit: data.unit || "",
                    date: data.date || "",
                    category: data.category || "",
                    notes: data.notes || "",
                });
            } catch (e) {
                setError("Błąd podczas pobierania danych.");
            } finally {
                setLoading(false);
            }
        };

        fetchMed();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            await updateDoc(doc(db, "medicines", id), form);
            navigate("/mymeds");
        } catch (e) {
            setError("Błąd podczas zapisywania zmian.");
        }
    };

    if (loading)
        return (
            <DashboardLayout>
                <p className="text-center text-gray-500">Ładowanie danych...</p>
            </DashboardLayout>
        );

    if (error)
        return (
            <DashboardLayout>
                <p className="text-center text-red-500">{error}</p>
            </DashboardLayout>
        );

    return (
        <DashboardLayout>
            <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Edytuj lek</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nazwa leku"
                        value={form.name}
                        onChange={handleChange}
                        className="border rounded p-2"
                        required
                    />

                    <input
                        type="text"
                        name="dose"
                        placeholder="Dawka (np. 500mg)"
                        value={form.dose}
                        onChange={handleChange}
                        className="border rounded p-2"
                        required
                    />

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Ilość"
                        value={form.quantity}
                        onChange={handleChange}
                        className="border rounded p-2"
                        required
                        min={0}
                    />

                    <input
                        type="text"
                        name="unit"
                        placeholder="Jednostka (np. szt, ml)"
                        value={form.unit}
                        onChange={handleChange}
                        className="border rounded p-2"
                        required
                    />

                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="border rounded p-2"
                        required
                    />

                    {/* ✅ Kategoria z emoji */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Kategoria
                        </label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        >
                            <option value="">— wybierz kategorię —</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.emoji} {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Opcjonalnie uwagi */}
                    <textarea
                        name="notes"
                        placeholder="Uwagi"
                        value={form.notes}
                        onChange={handleChange}
                        className="border rounded p-2"
                    />

                    <button
                        type="submit"
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                    >
                        Zapisz zmiany
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
