// src/pages/Profile.tsx
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, updateProfile, onAuthStateChanged } from "firebase/auth";

type Gender = "male" | "female" | "other";
type UserDoc = { name?: string; birth_date?: string | null; gender?: Gender };

function computeAge(isoDate: string): number {
    if (!isoDate) return 0;
    const [y, m, d] = isoDate.split("-").map((v) => parseInt(v, 10));
    if (!y || !m || !d) return 0;
    const today = new Date();
    let age = today.getFullYear() - y;
    const mDiff = (today.getMonth() + 1) - m;
    const dDiff = today.getDate() - d;
    if (mDiff < 0 || (mDiff === 0 && dDiff < 0)) age--;
    return Math.max(age, 0);
}

export default function Profile() {
    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState<string>("");
    const [gender, setGender] = useState<Gender>("other");
    const [email, setEmail] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    const [msg, setMsg] = useState<string>("");
    const [msgType, setMsgType] = useState<"ok" | "err">("ok");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPwd, setChangingPwd] = useState(false);

    const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
    const age = useMemo(() => computeAge(birthDate), [birthDate]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setLoading(true);
            setMsg("");
            try {
                if (!u) return;
                setEmail(u.email || "");
                const ref = doc(db, "users", u.uid);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data() as UserDoc;
                    setName(data.name || u.displayName || "");
                    setBirthDate(data.birth_date || "");
                    setGender(data.gender || "other");
                } else {
                    setName(u.displayName || "");
                }
            } catch {
                setMsgType("err");
                setMsg("Nie udało się pobrać profilu.");
            } finally {
                setLoading(false);
            }
        });
        return () => unsub();
    }, []);

    function flash(type: "ok" | "err", text: string) {
        setMsgType(type);
        setMsg(text);
    }

    async function handleSaveProfile() {
        setSaving(true);
        setMsg("");
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Brak zalogowanego użytkownika.");

            if (user.displayName !== name.trim()) {
                await updateProfile(user, { displayName: name.trim() });
            }

            await updateDoc(doc(db, "users", user.uid), {
                name: name.trim(),
                birth_date: birthDate || null,
                age: birthDate ? computeAge(birthDate) : null,
                gender,
            });

            flash("ok", "Dane zapisane ✅");
        } catch (e: unknown) {
            const err = e as { message?: string };
            flash("err", err?.message ? `Błąd: ${err.message}` : "Nie udało się zapisać danych.");
        } finally {
            setSaving(false);
        }
    }

    async function handleChangePassword() {
        setChangingPwd(true);
        setMsg("");
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Brak zalogowanego użytkownika.");
            if (newPassword.length < 6) throw new Error("Nowe hasło powinno mieć co najmniej 6 znaków.");
            if (newPassword !== newPassword2) throw new Error("Hasła nie są identyczne.");
            await updatePassword(user, newPassword); // bez aktualnego hasła (jeśli sesja świeża)
            setNewPassword(""); setNewPassword2("");
            flash("ok", "Hasło zostało zmienione 🎉");
        } catch (e: unknown) {
            const err = e as { code?: string; message?: string };
            if (err.code === "auth/requires-recent-login") {
                flash("err", "Sesja jest nieaktualna. Wyloguj się i zaloguj ponownie, a następnie zmień hasło.");
            } else {
                flash("err", err?.message ? `Błąd: ${err.message}` : "Nie udało się zmienić hasła.");
            }
        } finally {
            setChangingPwd(false);
        }
    }

    return (
        <DashboardLayout>
            {loading ? (
                <div className="min-h-[40vh] grid place-items-center text-gray-500">Ładowanie profilu…</div>
            ) : (
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-semibold mb-6">Twój profil</h1>

                    {/* Dwa boxy obok siebie */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Box: Dane osobowe */}
                        <section className="bg-white rounded-2xl shadow p-6">
                            <h2 className="text-lg font-medium mb-4">Dane osobowe</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Imię i nazwisko</label>
                                    <input
                                        className="w-full border rounded p-2"
                                        value={name}
                                        onChange={(ev) => setName(ev.target.value)}
                                        autoComplete="name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Data urodzenia</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded p-2"
                                        value={birthDate}
                                        max={todayISO}
                                        onChange={(ev) => setBirthDate(ev.target.value)}
                                    />
                                    {birthDate && (
                                        <p className="text-xs text-gray-500 mt-1">Wiek: <b>{age}</b> lat</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Płeć</label>
                                    <select
                                        value={gender}
                                        onChange={(ev) => setGender(ev.target.value as Gender)}
                                        className="w-full h-10 rounded-md border px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="male">Mężczyzna</option>
                                        <option value="female">Kobieta</option>
                                        <option value="other">Inna / nie chcę podawać</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Email</label>
                                    <input className="w-full border rounded p-2 bg-gray-50" value={email} disabled />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Zmiana emaila zwykle wymaga ponownego logowania.
                                    </p>
                                </div>

                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
                                >
                                    {saving ? "Zapisywanie…" : "Zapisz dane"}
                                </button>
                            </div>
                        </section>

                        {/* Box: Zmiana hasła */}
                        <section className="bg-white rounded-2xl shadow p-6">
                            <h2 className="text-lg font-medium mb-4">Zmiana hasła</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Nowe hasło</label>
                                    <input
                                        type="password"
                                        className="w-full border rounded p-2"
                                        value={newPassword}
                                        onChange={(ev) => setNewPassword(ev.target.value)}
                                        autoComplete="new-password"
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Powtórz nowe hasło</label>
                                    <input
                                        type="password"
                                        className="w-full border rounded p-2"
                                        value={newPassword2}
                                        onChange={(ev) => setNewPassword2(ev.target.value)}
                                        autoComplete="new-password"
                                        minLength={6}
                                    />
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={changingPwd}
                                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
                                >
                                    {changingPwd ? "Zmiana hasła…" : "Zmień hasło"}
                                </button>
                            </div>
                        </section>
                    </div>

                    {msg && (
                        <p className={`mt-6 text-sm ${msgType === "ok" ? "text-emerald-600" : "text-red-600"}`}>
                            {msg}
                        </p>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}
