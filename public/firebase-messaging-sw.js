importScripts("https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.21.0/firebase-messaging.js"
);

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDYW11HaQGkh_gw6JWTEFAOxDYg89k0IY8",
  authDomain: "cometchat-push-notifs.firebaseapp.com",
  projectId: "cometchat-push-notifs",
  storageBucket: "cometchat-push-notifs.firebasestorage.app",
  messagingSenderId: "173866097745",
  appId: "1:173866097745:web:8469dfada5f02a67592c70",
  measurementId: "G-JFM69ZLJRX",
};

const app = firebase.initializeApp(FIREBASE_CONFIG);
firebase.messaging();
