// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore, doc, setDoc } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// ⬇️ nowość
import { getMessaging, getToken, isSupported as isMessagingSupported, type Messaging } from "firebase/messaging";
import { uid } from "../utils/id";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
} as const;

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);

let analytics: Analytics | undefined;
isSupported().then(ok=>{ if (ok) analytics = getAnalytics(app); }).catch(()=>{});

let messaging: Messaging | undefined;
isMessagingSupported().then(ok=>{ if (ok) messaging = getMessaging(app); }).catch(()=>{});

export { app, db, auth, storage, analytics, messaging };

// ———————————————————————————————
// OPCJONALNIE: Web Push (FCM) – wymaga:
// 1) pliku public/firebase-messaging-sw.js
// 2) VITE_FIREBASE_VAPID_KEY
// 3) https lub localhost
export async function askMessagingPermissionAndToken(): Promise<string|undefined> {
    if (!messaging) return undefined;
    if (!("Notification" in window)) return undefined;
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return undefined;

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;
    if (!vapidKey) return undefined;

    const tok = await getToken(messaging, { vapidKey }).catch(()=>undefined);
    if (!tok) return undefined;

    const deviceId = (localStorage.getItem("deviceId") || uid("device"));
    localStorage.setItem("deviceId", deviceId);
    await setDoc(doc(db, "fcm_tokens", deviceId), {
        id: deviceId, token: tok, updatedAt: new Date().toISOString()
    }, { merge: true });

    return tok;
}
