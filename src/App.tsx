// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { MyMeds } from "./pages/MyMeds";
import { AddMed } from "./pages/AddMed";
import ProtectedRoute from "./components/ProtectedRoute";
import Plans from "./pages/Plans";
import AddPlan from "./pages/AddPlan";
import EditPlan from "./pages/EditPlan";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

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
                path="/plans"
                element={
                    <ProtectedRoute>
                        <Plans />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/addplan"
                element={
                    <ProtectedRoute>
                        <AddPlan />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/editplan/:id"
                element={
                    <ProtectedRoute>
                        <EditPlan />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
