import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { auth, db } from "../lib/firebase";
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    deleteField,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

type Role = "owner" | "admin" | "member" | "viewer";
type FamilyDoc = {
    name: string;
    users_id: string[];
    roles?: Record<string, Role>;
    inviteCode?: string; // dołączanie kodem
    owner?: string;
    createdAt?: any;
    updatedAt?: any;
};

type Member = { uid: string; name: string; email?: string | null; role: Role };
type FamilyVM = { id: string; name: string; myRole: Role; inviteCode?: string; members: Member[] };

const randomCode = (len = 6) =>
    Array.from({ length: len }, () =>
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".charAt(Math.floor(Math.random() * 32))
    ).join("");

export default function Family() {
    const [families, setFamilies] = useState<FamilyVM[]>([]);
    const [loading, setLoading] = useState(true);

    // tworzenie / dołączenie
    const [newName, setNewName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const me = auth.currentUser;

    const canManage = (f: FamilyVM) => f.myRole === "owner" || f.myRole === "admin";

    useEffect(() => {
        (async () => {
            const u = auth.currentUser;
            if (!u) return;
            const qFamilies = query(collection(db, "family"), where("users_id", "array-contains", u.uid));
            const snap = await getDocs(qFamilies);

            const res: FamilyVM[] = [];
            for (const f of snap.docs) {
                const data = f.data() as FamilyDoc;
                const roles = data.roles || {};
                const myRole = (roles[u.uid] || "member") as Role;

                // wczytaj członków
                const members: Member[] = [];
                for (const uid of data.users_id || []) {
                    const uref = doc(db, "users", uid);
                    const usnap = await getDoc(uref);
                    const udata = (usnap.exists() ? usnap.data() : {}) as DocumentData;
                    const display =
                        (udata as any)?.name ||
                        (udata as any)?.displayName ||
                        (udata as any)?.email?.split?.("@")?.[0] ||
                        "User";
                    members.push({
                        uid,
                        name: display,
                        email: (udata as any)?.email || null,
                        role: (roles[uid] || "member") as Role,
                    });
                }

                res.push({
                    id: f.id,
                    name: data.name || "Family",
                    inviteCode: data.inviteCode,
                    myRole,
                    members,
                });
            }
            setFamilies(res);
            setLoading(false);
        })();
    }, []);

    // ── Actions ───────────────────────────────────────────────────────────────
    const createFamily = async () => {
        if (!me || !newName.trim()) return;
        const code = randomCode();
        const docRef = await addDoc(collection(db, "family"), {
            name: newName.trim(),
            users_id: [me.uid],
            roles: { [me.uid]: "owner" as Role },
            inviteCode: code,
            owner: me.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        } as FamilyDoc);
        setFamilies((prev) => [
            ...prev,
            {
                id: docRef.id,
                name: newName.trim(),
                inviteCode: code,
                myRole: "owner",
                members: [
                    { uid: me.uid, name: me.displayName || "Ty", email: me.email, role: "owner" },
                ],
            },
        ]);
        setNewName("");
    };

    const joinFamilyByCode = async () => {
        if (!me || !joinCode.trim()) return;
        const qCode = query(collection(db, "family"), where("inviteCode", "==", joinCode.trim().toUpperCase()));
        const match = await getDocs(qCode);
        if (match.empty) return alert("Nie znaleziono rodziny o podanym kodzie.");
        const ref = match.docs[0].ref as any;

        await updateDoc(ref, {
            users_id: arrayUnion(me.uid),
            [`roles.${me.uid}`]: "member",
            updatedAt: serverTimestamp(),
        });

        // dołóż lokalnie (pobierz świeżo)
        const fresh = await getDoc(ref);
        const d = fresh.data() as FamilyDoc;
        setFamilies((prev) => {
            const exists = prev.some((x) => x.id === ref.id);
            const item: FamilyVM = {
                id: ref.id,
                name: d.name,
                myRole: "member",
                inviteCode: d.inviteCode,
                members: [{ uid: me.uid, name: me.displayName || "Ty", email: me.email, role: "member" }],
            };
            return exists ? prev : [...prev, item];
        });
        setJoinCode("");
    };

    const renameFamily = async (familyId: string, name: string) => {
        await updateDoc(doc(db, "family", familyId), { name, updatedAt: serverTimestamp() });
        setFamilies((prev) => prev.map((f) => (f.id === familyId ? { ...f, name } : f)));
    };

    const rotateInvite = async (familyId: string) => {
        const code = randomCode();
        await updateDoc(doc(db, "family", familyId), { inviteCode: code, updatedAt: serverTimestamp() });
        setFamilies((p) => p.map((f) => (f.id === familyId ? { ...f, inviteCode: code } : f)));
    };

    const addMemberByEmail = async (familyId: string, email: string, role: Role = "member") => {
        // znajdź użytkownika po emailu
        const qU = query(collection(db, "users"), where("email", "==", email.trim().toLowerCase()));
        const res = await getDocs(qU);
        if (res.empty) return alert("Nie znaleziono użytkownika o tym e-mailu.");
        const targetId = res.docs[0].id;

        await updateDoc(doc(db, "family", familyId), {
            users_id: arrayUnion(targetId),
            [`roles.${targetId}`]: role,
            updatedAt: serverTimestamp(),
        });

        // odśwież lokalnie (płytko)
        setFamilies((prev) =>
            prev.map((f) =>
                f.id !== familyId
                    ? f
                    : {
                        ...f,
                        members: [
                            ...f.members.filter((m) => m.uid !== targetId),
                            { uid: targetId, name: email.split("@")[0], email, role },
                        ],
                    }
            )
        );
    };

    const setRole = async (familyId: string, uid: string, role: Role) => {
        await updateDoc(doc(db, "family", familyId), { [`roles.${uid}`]: role, updatedAt: serverTimestamp() });
        setFamilies((prev) =>
            prev.map((f) =>
                f.id === familyId ? { ...f, members: f.members.map((m) => (m.uid === uid ? { ...m, role } : m)) } : f
            )
        );
    };

    const removeMember = async (familyId: string, uid: string) => {
        await updateDoc(doc(db, "family", familyId), {
            users_id: arrayRemove(uid),
            [`roles.${uid}`]: deleteField(),
            updatedAt: serverTimestamp(),
        });
        setFamilies((prev) =>
            prev.map((f) =>
                f.id === familyId ? { ...f, members: f.members.filter((m) => m.uid !== uid) } : f
            )
        );
    };

    const leaveFamily = async (familyId: string) => {
        if (!me) return;
        await removeMember(familyId, me.uid);
        setFamilies((prev) => prev.filter((f) => f.id !== familyId));
    };

    const deleteFamily = async (familyId: string) => {
        if (!confirm("Na pewno usunąć rodzinę?")) return;
        await deleteDoc(doc(db, "family", familyId));
        setFamilies((prev) => prev.filter((f) => f.id !== familyId));
    };

    // ── UI ────────────────────────────────────────────────────────────────────
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">👨‍👩‍👧 Rodzina</h1>
                    <p className="text-sm text-zinc-500">Zarządzaj rodzinami, rolami i członkami.</p>
                </div>

                {/* Tworzenie / Dołączanie */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="card">
                        <h3 className="font-medium mb-2">➕ Utwórz rodzinę</h3>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 rounded-lg border px-3 py-2"
                                placeholder="Nazwa rodziny"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <button onClick={createFamily} className="btn-primary">Utwórz</button>
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="font-medium mb-2">🔗 Dołącz kodem</h3>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 rounded-lg border px-3 py-2 uppercase"
                                placeholder="KOD"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            />
                            <button onClick={joinFamilyByCode} className="btn">Dołącz</button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <p className="text-zinc-500">Ładowanie…</p>
                ) : families.length === 0 ? (
                    <p className="text-zinc-500">Nie należysz jeszcze do żadnej rodziny.</p>
                ) : (
                    <div className="space-y-6">
                        {families.map((fam) => (
                            <div key={fam.id} className="card">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">{fam.name}</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="pill-ok">Twoja rola: {fam.myRole}</span>
                                            {fam.inviteCode && (
                                                <span className="pill-warn">Kod: {fam.inviteCode}</span>
                                            )}
                                        </div>
                                    </div>
                                    {canManage(fam) && (
                                        <div className="flex gap-2">
                                            <button
                                                className="btn"
                                                onClick={() => {
                                                    const newN = prompt("Nowa nazwa rodziny", fam.name);
                                                    if (newN && newN.trim()) renameFamily(fam.id, newN.trim());
                                                }}
                                            >
                                                ✏️ Zmień nazwę
                                            </button>
                                            <button className="btn" onClick={() => rotateInvite(fam.id)}>
                                                ♻️ Odśwież kod
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Lista członków */}
                                <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {fam.members.map((m) => (
                                        <div key={m.uid} className="py-3 flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">{m.name}</div>
                                                <div className="text-xs text-zinc-500">{m.email}</div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <select
                                                    className="rounded-lg border px-2 py-1 text-sm"
                                                    value={m.role}
                                                    onChange={(e) => setRole(fam.id, m.uid, e.target.value as Role)}
                                                    disabled={!canManage(fam) || m.uid === fam.members.find(x=>x.role==="owner")?.uid}
                                                    title={!canManage(fam) ? "Brak uprawnień" : ""}
                                                >
                                                    <option value="owner" disabled>owner</option>
                                                    <option value="admin">admin</option>
                                                    <option value="member">member</option>
                                                    <option value="viewer">viewer</option>
                                                </select>

                                                {me?.uid === m.uid ? (
                                                    <button className="btn" onClick={() => leaveFamily(fam.id)}>🚪 Opuść</button>
                                                ) : canManage(fam) ? (
                                                    <button className="btn" onClick={() => removeMember(fam.id, m.uid)}>🗑️ Usuń</button>
                                                ) : null}

                                                <Link to={`/family/${fam.id}/member/${m.uid}`} className="btn">
                                                    💊 Leki
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Dodawanie po e-mailu (dla admin/owner) */}
                                {canManage(fam) && (
                                    <div className="mt-4 flex items-center gap-2">
                                        <input
                                            className="flex-1 rounded-lg border px-3 py-2"
                                            placeholder="E-mail użytkownika"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    const input = e.currentTarget as HTMLInputElement;
                                                    addMemberByEmail(fam.id, input.value, "member");
                                                    input.value = "";
                                                }
                                            }}
                                        />
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                const email = prompt("Podaj e-mail użytkownika do dodania");
                                                if (email) addMemberByEmail(fam.id, email, "member");
                                            }}
                                        >
                                            ➕ Dodaj po e-mailu
                                        </button>

                                        {fam.myRole === "owner" && (
                                            <button className="btn" onClick={() => deleteFamily(fam.id)}>
                                                ❌ Usuń rodzinę
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
