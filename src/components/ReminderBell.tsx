// src/components/ReminderBell.tsx
import { useEffect, useState } from "react";
import { useMedStore } from "../store/medStore";
import { usePlanStore } from "../store/planStore";
import { yyyyMmDd } from "../utils/schedule";
import { askMessagingPermissionAndToken } from "../lib/firebase";

export default function ReminderBell() {
    const meds = useMedStore((s) => s.meds);
    const { getDayAgenda } = usePlanStore();
    const [perm, setPerm] = useState<NotificationPermission>(
        typeof Notification === "undefined" ? "denied" : Notification.permission
    );

    useEffect(() => {
        if (typeof Notification === "undefined") return;
        setPerm(Notification.permission);
    }, []);

    const enableLocal = async () => {
        if (typeof Notification === "undefined") {
            alert("Ta przeglądarka nie wspiera Notification API.");
            return;
        }
        const p = await Notification.requestPermission();
        setPerm(p);
        if (p !== "granted") return;
        scheduleNext24h();
    };

    const scheduleNext24h = () => {
        const now = new Date();
        const startYmd = yyyyMmDd(now);
        const next = new Date(now.getTime() + 24 * 3600 * 1000);
        const endYmd = yyyyMmDd(next);

        const days = Array.from(new Set([startYmd, endYmd]));
        for (const day of days) {
            const items = getDayAgenda(day, meds);
            for (const it of items) {
                const due = new Date(it.dueAt).getTime();
                const delay = due - Date.now();
                if (delay > 1000 && delay < 24 * 3600 * 1000) {
                    setTimeout(() => {
                        try {
                            new Notification("Przypomnienie o leku", {
                                body: `${it.time} — ${it.medName} (${it.dose} ${it.unit})`,
                            });
                        } catch (err) {
                            console.warn("Notification show error", err);
                        }
                    }, delay);
                }
            }
        }
        alert("Zaplanowano lokalne przypomnienia na 24h (aktywną kartę trzymaj otwartą).");
    };

    const enablePush = async () => {
        try {
            const token = await askMessagingPermissionAndToken();
            if (!token) {
                alert("Push: brak tokenu (sprawdź VAPID key i https/localhost).");
            } else {
                alert("Push włączony. Token zapisany w Firestore (device).");
            }
        } catch (e: any) {
            alert("Push error: " + (e?.message || e));
        }
    };

    /*return (
        <div className="flex items-center gap-2">
            <button onClick={enableLocal} className="btn">🔔 Lokalnie</button>
            <button onClick={enablePush} className="btn">📲 Web Push</button>
            <span className="text-xs text-zinc-500">Stan: {perm}</span>
        </div>
    );*/
}
