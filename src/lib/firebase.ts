import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Safety Check
if (!firebaseConfig.apiKey) {
  console.error("❌ Firebase config missing. Check .env file");
}

// Temporary debug: log Vite env variables to verify they are loaded
// REMOVE these logs before deploying to production
try {
  console.log("import.meta.env keys:", Object.keys(import.meta.env));
  console.log("VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY ? '***loaded***' : 'MISSING');
  console.log("VITE_FIREBASE_PROJECT_ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID || 'MISSING');
} catch (e) {
  console.error('Could not read import.meta.env', e);
}

// Initialize Firebase (Singleton Pattern)
const app = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApp();

// Confirm initialization
try {
  console.log('Firebase initialized. projectId=', firebaseConfig.projectId || (app && (app as any).options && (app as any).options.projectId) || 'unknown');
} catch (e) {
  console.error('Firebase init check failed', e);
}
// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;