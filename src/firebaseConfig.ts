import firebase from "firebase/compat/app";
import "firebase/compat/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDYW11HaQGkh_gw6JWTEFAOxDYg89k0IY8",
  authDomain: "cometchat-push-notifs.firebaseapp.com",
  projectId: "cometchat-push-notifs",
  storageBucket: "cometchat-push-notifs.firebasestorage.app",
  messagingSenderId: "173866097745",
  appId: "1:173866097745:web:8469dfada5f02a67592c70",
  measurementId: "G-JFM69ZLJRX",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const messaging = firebase.messaging();
export default firebase;
