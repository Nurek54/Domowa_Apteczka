// src/App.tsx
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddMed from "./pages/AddMed";
import MedDetails from "./pages/MedDetails";
import CalendarPage from "./pages/Calendar";
import DayView from "./pages/DayView";
import NewPlan from "./pages/NewPlan";
import ReminderBell from "./components/ReminderBell";
import { useEffect } from "react";
import { useMedStore } from "./store/medStore";
import { usePlanStore } from "./store/planStore";

export default function App() {
    const startMedSync = useMedStore(s=>s.startSync);
    const startPlanSync = usePlanStore(s=>s.startSync);

    useEffect(()=>{ startMedSync(); startPlanSync(); }, [startMedSync, startPlanSync]);

    return (
        <div className="min-h-dvh bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
            <div className="mx-auto max-w-6xl p-6">
                <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <Link to="/" className="text-2xl font-bold">Domowa Apteczka</Link>
                    <nav className="flex flex-wrap items-center gap-2">
                        <Link to="/calendar" className="btn">Kalendarz</Link>
                        <Link to="/add" className="btn-primary">Dodaj lek</Link>
                        <Link to="/" className="btn">Lista</Link>
                        <ReminderBell />
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/add" element={<AddMed />} />
                    <Route path="/med/:medId" element={<MedDetails />} />

                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/day/:ymd" element={<DayView />} />
                    <Route path="/plans/new" element={<NewPlan />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </div>
    );
}
