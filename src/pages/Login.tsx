// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged,
} from "firebase/auth";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import { useI18n } from "../i18n/context";
import { auth, db, googleProvider } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();
    const { t } = useI18n();

    // 🔹 jeśli użytkownik jest już zalogowany → przekieruj na /mymeds
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (u) navigate("/mymeds", { replace: true });
        });
        return () => unsub();
    }, [navigate]);

    // 🔹 mapowanie błędów Firebase na komunikaty w bieżącym języku
    function mapAuthError(code?: string) {
        switch (code) {
            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
                return t("login.err.credentials");
            case "auth/invalid-email":
                return t("login.err.email");
            case "auth/popup-closed-by-user":
                return t("login.err.popup");
            default:
                return t("login.err.generic");
        }
    }

    // 🔹 logowanie email + hasło
    async function handleEmailLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            navigate("/mymeds");
        } catch (err: any) {
            setError(mapAuthError(err?.code));
        } finally {
            setBusy(false);
        }
    }

    // 🔹 logowanie przez Google
    async function handleGoogleLogin() {
        setError("");
        setBusy(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { user } = result;
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // 🆕 pierwsze logowanie: tworzymy szkic profilu
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email || "",
                    name: user.displayName || "",
                    gender: "",
                    birth_date: null,
                    createdAt: serverTimestamp(),
                });
            } else {
                navigate("/mymeds");
            }
        } catch (err: any) {
            console.error(err);
            setError(mapAuthError(err?.code));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 dark:from-zinc-950 via-white dark:via-zinc-900 to-slate-50 dark:to-indigo-950">
            <div className="absolute right-4 top-4 flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
            </div>
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-8">
                <div className="mb-6 flex flex-col items-center gap-2">
                    <img src="/logo.svg" alt="" className="h-14 w-14" />
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{t("app.name")}</p>
                    <h1 className="text-2xl font-bold">{t("login.title")}</h1>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder={t("common.email")}
                        className="w-full border dark:border-zinc-700 p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                    <input
                        type="password"
                        placeholder={t("login.password")}
                        className="w-full border dark:border-zinc-700 p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        minLength={6}
                        required
                    />

                    {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {busy ? t("login.busy") : t("login.submit")}
                    </button>
                </form>

                <div className="my-4 text-center text-sm text-gray-500 dark:text-zinc-400">{t("login.or")}</div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={busy}
                    className="w-full border dark:border-zinc-700 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-60"
                >
                    {t("login.google")}
                </button>

                {/* Link do rejestracji */}
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-4 text-center">
                    {t("login.noAccount")}{" "}
                    <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                        {t("login.register")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
