// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { addDoc, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

type Gender = "male" | "female" | "other";

function computeAge(isoDate: string): number {
    // isoDate: YYYY-MM-DD
    const today = new Date();
    const [y, m, d] = isoDate.split("-").map((v) => parseInt(v, 10));
    if (!y || !m || !d) return 0;
    let age = today.getFullYear() - y;
    const mDiff = today.getMonth() + 1 - m;
    const dDiff = today.getDate() - d;
    if (mDiff < 0 || (mDiff === 0 && dDiff < 0)) age--;
    return Math.max(age, 0);
}

export default function Register() {
    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState(""); // YYYY-MM-DD
    const [gender, setGender] = useState<Gender>("other");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();

    function mapFirebaseError(e: FirebaseError): string {
        switch (e.code) {
            case "auth/email-already-in-use":
                return "Ten email jest już zajęty.";
            case "auth/invalid-email":
                return "Nieprawidłowy adres email.";
            case "auth/weak-password":
                return "Hasło jest zbyt słabe (min. 6 znaków).";
            default:
                return `Błąd rejestracji: ${e.message}`;
        }
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setBusy(true);

        try {
            // 1) konto w Firebase Auth
            const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const uid = cred.user.uid;

            try {
                await updateProfile(cred.user, { displayName: name.trim() });
            } catch {
                /* kosmetyka */
            }

            // 2) profil użytkownika w Firestore
            const age = birthDate ? computeAge(birthDate) : null;

            await setDoc(doc(db, "users", uid), {
                uid,
                email: email.trim().toLowerCase(),
                name: name.trim(),
                birth_date: birthDate || null, // YYYY-MM-DD
                age,                           // wyliczony wiek (lata)
                gender,                        // 'male' | 'female' | 'other'
                createdAt: serverTimestamp(),
            });

            // 3) starter dla apteczki (pusty zestaw leków) — jeśli nie chcesz, usuń ten blok
            await addDoc(collection(db, "medicines_sets"), {
                owner: uid,
                medicines_id: [],
                createdAt: serverTimestamp(),
            });

            // 4) dalej do aplikacji
            navigate("/mymeds");
        } catch (err) {
            if (err instanceof FirebaseError) setError(mapFirebaseError(err));
            else setError("Nieznany błąd rejestracji.");
        } finally {
            setBusy(false);
        }
    }

    const todayISO = new Date().toISOString().slice(0, 10);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Rejestracja</h1>

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* 1) Imię i nazwisko */}
                    <div>
                        <label className="block text-sm font-medium">Imię i nazwisko</label>
                        <input
                            className="w-full border rounded p-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </div>

                    {/* 2) Data urodzenia */}
                    <div>
                        <label className="block text-sm font-medium">Data urodzenia</label>
                        <input
                            type="date"
                            className="w-full border rounded p-2"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            max={todayISO}
                            required
                        />
                        {birthDate && (
                            <p className="text-xs text-gray-500 mt-1">
                                Wiek: <b>{computeAge(birthDate)}</b> lat
                            </p>
                        )}
                    </div>

                    {/* 3) Płeć */}
                    <div>
                        <label className="block text-sm font-medium">Płeć</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value as Gender)}
                            className="w-full h-10 rounded-md border px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                            <option value="male">Mężczyzna</option>
                            <option value="female">Kobieta</option>
                            <option value="other">Inna / nie chcę podawać</option>
                        </select>
                    </div>

                    {/* 4) Email */}
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded p-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            inputMode="email"
                        />
                    </div>

                    {/* 5) Hasło */}
                    <div>
                        <label className="block text-sm font-medium">Hasło</label>
                        <input
                            type="password"
                            className="w-full border rounded p-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            minLength={6}
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {busy ? "Zakładam konto…" : "Zarejestruj"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    Masz już konto?{" "}
                    <Link to="/login" className="text-indigo-600 hover:underline">
                        Zaloguj się
                    </Link>
                </p>
            </div>
        </div>
    );
}
