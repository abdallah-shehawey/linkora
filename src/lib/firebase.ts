import { getApps, getApp, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  connectAuthEmulator,
  type Auth,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True when the six required env vars are present. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

/**
 * Local-dev flag: when NEXT_PUBLIC_FIREBASE_EMULATOR=1, Auth + Firestore
 * connect to the local Firebase Emulator Suite instead of production.
 * Never set this on Vercel.
 */
const useEmulator = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "1";

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function ensureApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Copy .env.local.example to .env.local and fill in your project keys.",
    );
  }
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    const app = ensureApp();
    try {
      // Explicit durable persistence (IndexedDB, then localStorage) so a
      // login survives closing the browser; unavailable layers are skipped
      // automatically (e.g. in Node during e2e tests).
      authInstance = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver,
      });
    } catch {
      // Auth was already initialised for this app — reuse it.
      authInstance = getAuth(app);
    }
    if (useEmulator) {
      connectAuthEmulator(authInstance, "http://127.0.0.1:9099", {
        disableWarnings: true,
      });
    }
  }
  return authInstance;
}

export function getDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(ensureApp());
    if (useEmulator) {
      connectFirestoreEmulator(dbInstance, "127.0.0.1", 8080);
    }
  }
  return dbInstance;
}

export const googleProvider = new GoogleAuthProvider();
