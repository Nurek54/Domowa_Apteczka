// src/pages/Login.tsx
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleEmailLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/mymeds"); // ✅ po zalogowaniu od razu do MyMeds
        } catch (err: any) {
            setError("Błąd logowania: " + err.message);
        }
    }

    async function handleGoogleLogin() {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/mymeds"); // ✅ po zalogowaniu od razu do MyMeds
        } catch (err: any) {
            setError("Nie udało się zalogować przez Google.");
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
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        className="w-full border p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                    >
                        Zaloguj się
                    </button>
                </form>
                <div className="my-4 text-center text-sm text-gray-500">lub</div>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full border py-2 rounded hover:bg-gray-100"
                >
                    Zaloguj przez Google
                </button>
            </div>
        </div>
    );
}
