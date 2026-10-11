import { type ReactNode, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useI18n } from "../i18n/context";
import type { TranslationKey } from "../i18n/translations";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";

// Kolejność ma znaczenie: dłuższe ścieżki przed krótszymi o tym samym początku.
const TITLES: [RegExp, TranslationKey][] = [
    [/^\/family\/[^/]+\/member\/[^/]+/, "title.memberMeds"],
    [/^\/family/, "title.family"],
    [/^\/mymeds/, "title.myMeds"],
    [/^\/addmed/, "title.addMed"],
    [/^\/edit-med/, "title.editMed"],
    [/^\/plans/, "title.plans"],
    [/^\/addplan/, "title.addPlan"],
    [/^\/editplan/, "title.editPlan"],
    [/^\/profile/, "title.profile"],
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [displayName, setDisplayName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [authChecked, setAuthChecked] = useState(false);
    const { t } = useI18n();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (!u) {
                // strona logowania jest pod "/"
                navigate("/", { replace: true });
                return;
            }
            setDisplayName(u.displayName || "");
            setEmail(u.email || "");
            setAuthChecked(true);
        });
        return () => unsub();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/", { replace: true });
    };

    const pageTitle = useMemo(() => {
        const match = TITLES.find(([re]) => re.test(location.pathname));
        return t(match ? match[1] : "title.dashboard");
    }, [location.pathname, t]);

    const navClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-lg transition-colors ${
            isActive
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                : "text-gray-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
        }`;

    if (!authChecked) {
        return (
            <div className="grid place-items-center h-screen text-gray-500 dark:text-zinc-400">
                {t("common.loading")}
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2.5">
                    <img src="/logo.svg" alt="" className="h-8 w-8 shrink-0" />
                    <h2 className="whitespace-nowrap text-base font-bold">{t("app.name")}</h2>
                </div>

                <nav className="flex flex-col gap-2 text-sm">
                    <NavLink to="/mymeds" className={navClass}>💊 {t("nav.myMeds")}</NavLink>
                    <NavLink to="/addmed" className={navClass}>🧪 {t("nav.addMed")}</NavLink>
                    <NavLink to="/plans" className={navClass}>🗓️ {t("nav.plans")}</NavLink>
                    <NavLink to="/addplan" className={navClass}>🩺 {t("nav.addPlan")}</NavLink>
                    <NavLink to="/family" className={navClass}>👨‍👩‍👧 {t("nav.family")}</NavLink>
                    <NavLink to="/profile" className={navClass}>👤 {t("nav.profile")}</NavLink>
                </nav>

                <div className="mt-auto rounded-xl bg-gray-50 dark:bg-zinc-800/60 p-3">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
                            {(displayName || email || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{displayName || t("common.user")}</p>
                            <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">{email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 p-4">
                    <h1 className="text-xl font-semibold">{pageTitle}</h1>
                    <div className="flex items-center gap-3">
                        <LanguageToggle />
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                        >
                            {t("nav.logout")}
                        </button>
                    </div>
                </header>

                <main className="p-6 bg-gray-50 dark:bg-zinc-950 flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
