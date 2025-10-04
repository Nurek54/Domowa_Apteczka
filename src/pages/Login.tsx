// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();

    // Jeśli już zalogowany → od razu do /mymeds
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (u) navigate("/mymeds", { replace: true });
        });
        return () => unsub();
    }, [navigate]);

    function mapAuthError(code?: string) {
        switch (code) {
            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
                return "Nieprawidłowy email lub hasło.";
            case "auth/invalid-email":
                return "Nieprawidłowy adres email.";
            case "auth/popup-closed-by-user":
                return "Okno logowania zostało zamknięte.";
            default:
                return "Wystąpił błąd logowania. Spróbuj ponownie.";
        }
    }

    async function handleEmailLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            navigate("/mymeds"); // ✅ po zalogowaniu od razu do MyMeds
        } catch (err: any) {
            setError(mapAuthError(err?.code));
        } finally {
            setBusy(false);
        }
    }

    async function handleGoogleLogin() {
        setError("");
        setBusy(true);
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/mymeds"); // ✅ po zalogowaniu od razu do MyMeds
        } catch (err: any) {
            setError(mapAuthError(err?.code) || "Nie udało się zalogować przez Google.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Zaloguj się</h1>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        className="w-full border p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        minLength={6}
                        required
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {busy ? "Logowanie…" : "Zaloguj się"}
                    </button>
                </form>

                <div className="my-4 text-center text-sm text-gray-500">lub</div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={busy}
                    className="w-full border py-2 rounded hover:bg-gray-100 disabled:opacity-60"
                >
                    Zaloguj przez Google
                </button>

                {/* Link do rejestracji */}
                <p className="text-sm text-gray-500 mt-4 text-center">
                    Nie masz konta?{" "}
                    <Link to="/register" className="text-indigo-600 hover:underline">
                        Zarejestruj się
                    </Link>
                </p>
            </div>
        </div>
    );
}
