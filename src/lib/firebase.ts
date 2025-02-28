'use client';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, connectAuthEmulator } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only on the client side and only once
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Get Auth, Firestore, and Storage instances
let auth = getAuth(app);
let db = getFirestore(app);
let storage = getStorage(app);

// Initialize default users
const initializeDefaultUsers = async () => {
  try {
    await createUserWithEmailAndPassword(auth, 'sirtheprogrammer@moodchat.com', '013199');
  } catch (error: any) {
    if (error.code !== 'auth/email-already-in-use') {
      console.error('Error creating sirtheprogrammer:', error);
    }
  }

  try {
    await createUserWithEmailAndPassword(auth, 'leylah@moodchat.com', '0131');
  } catch (error: any) {
    if (error.code !== 'auth/email-already-in-use') {
      console.error('Error creating leylah:', error);
    }
  }
};

if (typeof window !== 'undefined') {
  initializeDefaultUsers();
}

export { db, auth, storage };
