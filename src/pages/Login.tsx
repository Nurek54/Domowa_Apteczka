// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db, googleProvider } from "../lib/firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCred.user.uid;

            // sprawdź czy user istnieje w kolekcji
            const ref = doc(db, "users", uid);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
                await setDoc(ref, {
                    name: userCred.user.displayName || "",
                    email: userCred.user.email || "",
                    createdAt: new Date().toISOString(),
                });
            }

            navigate("/medicines");
        } catch (err) {
            setError(
                err instanceof FirebaseError
                    ? `Błąd logowania: ${err.message}`
                    : "Nieznany błąd logowania"
            );
        }
    }

    async function handleGoogleLogin() {
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { user } = result;

            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
                await setDoc(ref, {
                    name: user.displayName || "",
                    email: user.email || "",
                    createdAt: new Date().toISOString(),
                });
            }

            navigate("/medicines");
        } catch (err) {
            console.error(err);
            setError("Nie udało się zalogować przez Google.");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Domowa Apteczka</h1>

            <form onSubmit={handleLogin} className="flex flex-col gap-3 w-80">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded p-2"
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" className="bg-blue-600 text-white py-2 rounded">
                    Zaloguj
                </button>
            </form>

            <div className="mt-4">
                <button
                    onClick={handleGoogleLogin}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Zaloguj przez Google
                </button>
            </div>
        </div>
    );
}
