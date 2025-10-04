// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { MyMeds } from "./pages/MyMeds";
import { AddMed } from "./pages/AddMed";
import ProtectedRoute from "./components/ProtectedRoute";
// ⬇️ nowa strona rejestracji — pamiętaj dodać plik src/pages/Register.tsx
import Register from "./pages/Register";

export default function App() {
    return (
        <Routes>
            {/* Publiczne */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Strefa po zalogowaniu */}
            <Route
                path="/mymeds"
                element={
                    <ProtectedRoute>
                        <MyMeds />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/addmed"
                element={
                    <ProtectedRoute>
                        <AddMed />
                    </ProtectedRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
