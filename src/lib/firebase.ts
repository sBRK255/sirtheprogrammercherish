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

// Initialize Firebase
let app;
let auth;
let db;
let storage;

if (typeof window !== 'undefined') {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

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

    initializeDefaultUsers();
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { db, auth, storage };
