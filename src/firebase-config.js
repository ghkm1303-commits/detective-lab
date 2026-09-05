// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAL3ZxQCG3Wvd3IC224jglLSIPMpAeLcUA",
  authDomain: "detective-labs.firebaseapp.com",
  projectId: "detective-labs",
  storageBucket: "detective-labs.firebasestorage.app",
  messagingSenderId: "31887148396",
  appId: "1:31887148396:web:24388f222ed7686f091f49",
  measurementId: "G-6WS43HG0PQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services used across the app
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (only works in the browser, not during server-side rendering)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;