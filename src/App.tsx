import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import MedicinesList from "./pages/Medicines";
import AddMedicine from "./pages/AddMedicine";

export default function App() {
    return (
        <div>
            <header className="p-4 flex justify-between border-b">
                <Link to="/" className="font-bold text-xl">
                    Domowa Apteczka
                </Link>
                <nav className="flex gap-3">
                    <Link to="/medicines">Moje leki</Link>
                    <Link to="/add">Dodaj lek</Link>
                    <Link to="/login">Login</Link>
                </nav>
            </header>

            <main className="p-6">
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/medicines"
                        element={
                            <ProtectedRoute>
                                <MedicinesList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add"
                        element={
                            <ProtectedRoute>
                                <AddMedicine />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Login />} />
                </Routes>
            </main>
        </div>
    );
}
