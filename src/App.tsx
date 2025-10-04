// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import {MyMeds} from "./pages/MyMeds";
import {AddMed} from "./pages/AddMed";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <Routes>
            {/* Strona startowa = login */}
            <Route path="/" element={<Login />} />

            {/* Po zalogowaniu startujemy od MyMeds */}
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

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
