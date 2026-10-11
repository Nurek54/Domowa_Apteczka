// src/pages/EditMed.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import DashboardLayout from "../components/DashboardLayout";
import { CATEGORIES, categoryLabel } from "../constants/categories";
import { useI18n } from "../i18n/context";

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
    const { t, tryT } = useI18n();

    useEffect(() => {
        const fetchMed = async () => {
            if (!id) return;
            try {
                const ref = doc(db, "medicines", id);
                const snap = await getDoc(ref);
                if (!snap.exists()) {
                    setError(t("medForm.notFound"));
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
                setError(t("medForm.loadError"));
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
            setError(t("medForm.saveError"));
        }
    };

    if (loading)
        return (
            <DashboardLayout>
                <p className="text-center text-gray-500 dark:text-zinc-400">{t("medForm.loading")}</p>
            </DashboardLayout>
        );

    if (error)
        return (
            <DashboardLayout>
                <p className="text-center text-red-500 dark:text-red-400">{error}</p>
            </DashboardLayout>
        );

    return (
        <DashboardLayout>
            <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">{t("medForm.editTitle")}</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        name="name"
                        placeholder={t("medForm.name")}
                        value={form.name}
                        onChange={handleChange}
                        className="border dark:border-zinc-700 rounded p-2"
                        required
                    />

                    <input
                        type="text"
                        name="dose"
                        placeholder={t("medForm.dosePlaceholder")}
                        value={form.dose}
                        onChange={handleChange}
                        className="border dark:border-zinc-700 rounded p-2"
                        required
                    />

                    <input
                        type="number"
                        name="quantity"
                        placeholder={t("medForm.quantity")}
                        value={form.quantity}
                        onChange={handleChange}
                        className="border dark:border-zinc-700 rounded p-2"
                        required
                        min={0}
                    />

                    <select
                        name="unit"
                        value={form.unit}
                        onChange={handleChange}
                        className="border dark:border-zinc-700 rounded p-2"
                        aria-label={t("medForm.unit")}
                        required
                    >
                        {["pcs", "ml", "mg"].map((u) => (
                            <option key={u} value={u}>{tryT(`unit.${u}`) ?? u}</option>
                        ))}
                        {form.unit && !["pcs", "ml", "mg"].includes(form.unit) && (
                            <option value={form.unit}>{form.unit}</option>
                        )}
                    </select>

                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="border dark:border-zinc-700 rounded p-2"
                        required
                    />

                    {/* ✅ Kategoria z emoji */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1">
                            {t("medForm.category")}
                        </label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border dark:border-zinc-700 rounded p-2"
                        >
                            <option value="">{t("medForm.chooseCategory")}</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.emoji} {categoryLabel(cat.id, tryT)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Opcjonalnie uwagi */}
                    <textarea
                        name="notes"
                        placeholder={t("common.notes")}
                        value={form.notes}
                        onChange={handleChange}
                        className="border dark:border-zinc-700 rounded p-2"
                    />

                    <button
                        type="submit"
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                    >
                        {t("common.saveChanges")}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
