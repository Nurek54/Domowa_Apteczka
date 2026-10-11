import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useI18n } from "../i18n/context";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { t } = useI18n();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) return <div>{t("common.loading")}</div>;
    if (!user) return <Navigate to="/" replace />;

    return <>{children}</>;
}
