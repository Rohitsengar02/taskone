// Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDRrsDO5i0QxE5TmFS0cB-P5FOjXMdiFUw",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "healthtracker-f7cdb.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "healthtracker-f7cdb",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "healthtracker-f7cdb.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "273103291349",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:273103291349:web:a7d68f8a49d0e3fd40335c",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-9M0ZE34SCR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
