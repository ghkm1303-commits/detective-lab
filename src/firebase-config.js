import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHkcDuxYNqak9L2V8y2SN-FAUm6G5uRJE",
  authDomain: "medical-game133003.firebaseapp.com",
  projectId: "medical-game133003",
  storageBucket: "medical-game133003.firebasestorage.app",
  messagingSenderId: "66759480785",
  appId: "1:66759480785:web:b225c95c91dbd661f53cf0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with proper persistence
export const auth = getAuth(app);

// Set persistence to localStorage (more reliable than IndexedDB)
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting persistence:', error);
    // Firebase will still work, just won't persist sessions
  });

// Initialize Firestore
export const db = getFirestore(app);

export default app;