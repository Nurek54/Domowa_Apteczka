/* public/firebase-messaging-sw.js */
/* global importScripts, firebase */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: self.location.search.match(/apiKey=([^&]+)/)?.[1],
    authDomain: self.location.search.match(/authDomain=([^&]+)/)?.[1],
    projectId: self.location.search.match(/projectId=([^&]+)/)?.[1],
    messagingSenderId: self.location.search.match(/messagingSenderId=([^&]+)/)?.[1],
    appId: self.location.search.match(/appId=([^&]+)/)?.[1]
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const title = payload?.notification?.title || "Przypomnienie o leku";
    const body  = payload?.notification?.body  || "";
    self.registration.showNotification(title, { body });
});
