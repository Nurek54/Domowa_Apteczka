import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDpx-xCxP0iouLDSLal0BIaU39vDG0k9XA",
    authDomain: "domowa-apteczka-942de.firebaseapp.com",
    projectId: "domowa-apteczka-942de",
    storageBucket: "domowa-apteczka-942de.firebasestorage.app",
    messagingSenderId: "291551289335",
    appId: "1:291551289335:web:2494bd3a6dead9fd2758f2",
    measurementId: "G-KENP20LFKW",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
