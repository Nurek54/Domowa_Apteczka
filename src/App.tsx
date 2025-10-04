// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { MyMeds } from "./pages/MyMeds";
import { AddMed } from "./pages/AddMed";
import ProtectedRoute from "./components/ProtectedRoute";

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
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
