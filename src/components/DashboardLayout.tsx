import { ReactNode } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/login";
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold">Domowa Apteczka</h2>
                <nav className="flex flex-col gap-3 text-sm">
                    <a href="/mymeds" className="hover:text-indigo-600">💊 Moje leki</a>
                    <a href="/addmed" className="hover:text-indigo-600">➕ Dodaj lek</a>
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between bg-white border-b p-4">
                    <h1 className="text-xl font-semibold">Dashboard</h1>
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
