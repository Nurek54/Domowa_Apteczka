// src/pages/AddMedicine.tsx
import { useState } from "react";
import { db, auth } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AddMedicine() {
    const nav = useNavigate();
    const [form, setForm] = useState({
        name: "",
        dose: "",
        quantity: "",
        unit: "",
        date: "",
        category: "",
        notes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const save = async () => {
        if (!auth.currentUser) return alert("Musisz być zalogowany!");
        await addDoc(collection(db, "medicines"), {
            ...form,
            quantity: Number(form.quantity),
            owner: auth.currentUser.uid,
        });
        nav("/medicines");
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Dodaj lek</h1>
            <input name="name" placeholder="Nazwa" onChange={handleChange} className="input" />
            <input name="dose" placeholder="Dawka" onChange={handleChange} className="input" />
            <input name="quantity" placeholder="Ilość" onChange={handleChange} className="input" />
            <input name="unit" placeholder="Jednostka" onChange={handleChange} className="input" />
            <input type="date" name="date" onChange={handleChange} className="input" />
            <input name="category" placeholder="Kategoria" onChange={handleChange} className="input" />
            <input name="notes" placeholder="Notatki" onChange={handleChange} className="input" />
            <button onClick={save} className="btn-primary mt-4">Zapisz</button>
        </div>
    );
}
