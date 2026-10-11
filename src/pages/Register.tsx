// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { addDoc, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import { useI18n } from "../i18n/context";
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
    const { t, tn } = useI18n();

    function mapFirebaseError(e: FirebaseError): string {
        switch (e.code) {
            case "auth/email-already-in-use":
                return t("register.err.inUse");
            case "auth/invalid-email":
                return t("register.err.email");
            case "auth/weak-password":
                return t("register.err.weak");
            default:
                return t("register.err.firebase", { message: e.message });
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

            // 3) starter dla apteczki (pusty zestaw leków)
            await addDoc(collection(db, "medicines_sets"), {
                owner: uid,
                medicines_id: [],
                createdAt: serverTimestamp(),
            });

            // 4) dalej do aplikacji
            navigate("/mymeds");
        } catch (err) {
            if (err instanceof FirebaseError) setError(mapFirebaseError(err));
            else setError(t("register.err.unknown"));
        } finally {
            setBusy(false);
        }
    }

    const todayISO = new Date().toISOString().slice(0, 10);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 dark:from-zinc-950 via-white dark:via-zinc-900 to-slate-50 dark:to-indigo-950">
            <div className="absolute right-4 top-4 flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
            </div>
            <div className="w-full max-w-lg bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-8">
                <div className="mb-6 flex flex-col items-center gap-2">
                    <img src="/logo.svg" alt="" className="h-14 w-14" />
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{t("app.name")}</p>
                    <h1 className="text-2xl font-bold">{t("register.title")}</h1>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* 1) Imię i nazwisko */}
                    <div>
                        <label className="block text-sm font-medium">{t("person.fullName")}</label>
                        <input
                            className="w-full border dark:border-zinc-700 rounded p-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </div>

                    {/* 2) Data urodzenia */}
                    <div>
                        <label className="block text-sm font-medium">{t("person.birthDate")}</label>
                        <input
                            type="date"
                            className="w-full border dark:border-zinc-700 rounded p-2"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            max={todayISO}
                            required
                        />
                        {birthDate && (
                            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                                {tn("person.age", computeAge(birthDate))}
                            </p>
                        )}
                    </div>

                    {/* 3) Płeć */}
                    <div>
                        <label className="block text-sm font-medium">{t("person.gender")}</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value as Gender)}
                            className="w-full h-10 rounded-md border dark:border-zinc-700 px-3 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                            <option value="male">{t("gender.male")}</option>
                            <option value="female">{t("gender.female")}</option>
                            <option value="other">{t("gender.other")}</option>
                        </select>
                    </div>

                    {/* 4) Email */}
                    <div>
                        <label className="block text-sm font-medium">{t("common.email")}</label>
                        <input
                            type="email"
                            className="w-full border dark:border-zinc-700 rounded p-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            inputMode="email"
                        />
                    </div>

                    {/* 5) Hasło */}
                    <div>
                        <label className="block text-sm font-medium">{t("login.password")}</label>
                        <input
                            type="password"
                            className="w-full border dark:border-zinc-700 rounded p-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            minLength={6}
                        />
                    </div>

                    {error && <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {busy ? t("register.busy") : t("register.submit")}
                    </button>
                </form>

                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-4 text-center">
                    {t("register.haveAccount")}{" "}
                    <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        {t("register.login")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
