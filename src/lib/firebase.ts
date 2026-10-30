"use client";

import { initializeApp, getApps } from "firebase/app";
import { initializeFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, GoogleAuthProvider, type Auth } from "firebase/auth";

const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === "1";

/** Web-app config from .env.local (see .env.example) — kept out of git. Access is enforced by firestore.rules. */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (useEmulators ? "emulator" : ""),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (useEmulators ? "demo-aj" : ""),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};
if (!firebaseConfig.apiKey || !firebaseConfig.projectId)
  throw new Error("Firebase config missing: copy .env.example to .env.local and fill in the NEXT_PUBLIC_FIREBASE_* values.");

let _db: Firestore | null = null;
let _auth: Auth | null = null;

function app() {
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

export function db() {
  if (!_db) {
    _db = initializeFirestore(app(), { ignoreUndefinedProperties: true });
    if (useEmulators) connectFirestoreEmulator(_db, "127.0.0.1", 8080);
  }
  return _db;
}

export function auth() {
  if (!_auth) {
    _auth = getAuth(app());
    if (useEmulators) connectAuthEmulator(_auth, "http://127.0.0.1:9099", { disableWarnings: true });
  }
  return _auth;
}

export const googleProvider = () => {
  const p = new GoogleAuthProvider();
  p.setCustomParameters({ prompt: "select_account" });
  return p;
};
