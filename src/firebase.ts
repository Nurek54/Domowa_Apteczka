import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDpx-xCxP0iouLDSLal0BIaU39vDG0k9XA",
    authDomain: "domowa-apteczka-942de.firebaseapp.com",
    projectId: "domowa-apteczka-942de",
    storageBucket: "domowa-apteczka-942de.firebasestorage.app",
    messagingSenderId: "291551289335",
    appId: "1:291551289335:web:2494bd3a6dead9fd2758f2",
    measurementId: "G-KENP20LFKW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}
export { analytics };
