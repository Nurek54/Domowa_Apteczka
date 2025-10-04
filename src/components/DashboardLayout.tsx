// src/components/DashboardLayout.tsx
import {type ReactNode, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [displayName, setDisplayName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [authChecked, setAuthChecked] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (!u) {
                navigate("/login", { replace: true });
                return; // nie ustawiaj dalej stanu
            }
            setDisplayName(u.displayName || "");
            setEmail(u.email || "");
            setAuthChecked(true);
        });
        return () => unsub();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login", { replace: true });
    };

    const pageTitle = useMemo(() => {
        const map: Record<string, string> = {
            "/mymeds": "Moje leki",
            "/addmed": "Dodaj lek",
            "/profile": "Profil",
        };
        const key = Object.keys(map).find((k) => location.pathname.startsWith(k));
        return (key && map[key]) || "Dashboard";
    }, [location.pathname]);

    const navClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-lg transition-colors ${
            isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:text-indigo-600"
        }`;

    if (!authChecked) {
        // prosty loader zanim sprawdzimy sesję / przekierujemy
        return (
            <div className="grid place-items-center h-screen text-gray-500">
                Ładowanie…
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r p-6 flex flex-col gap-5">
                <div>
                    <h2 className="text-lg font-bold">Domowa Apteczka</h2>
                </div>

                <nav className="flex flex-col gap-2 text-sm">
                    <NavLink to="/mymeds" className={navClass}>
                        💊 Moje leki
                    </NavLink>
                    <NavLink to="/addmed" className={navClass}>
                        ➕ Dodaj lek
                    </NavLink>
                    <NavLink to="/profile" className={navClass}>
                        👤 Profil
                    </NavLink>
                </nav>

                <div className="mt-auto rounded-xl bg-gray-50 p-3">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
                            {(displayName || email || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{displayName || "Użytkownik"}</p>
                            <p className="text-xs text-gray-500 truncate">{email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between bg-white border-b p-4">
                    <h1 className="text-xl font-semibold">{pageTitle}</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                    >
                        Wyloguj
                    </button>
                </header>

                {/* Content */}
                <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
