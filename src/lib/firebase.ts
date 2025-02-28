import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize default users if they don't exist
const initializeDefaultUsers = async () => {
  if (typeof window !== 'undefined') { // Only run on client side
    try {
      await createUserWithEmailAndPassword(auth, 'sirtheprogrammer@moodchat.com', '013199');
    } catch (error: any) {
      // Ignore if user already exists
      if (error.code !== 'auth/email-already-in-use') {
        console.error('Error creating sirtheprogrammer:', error);
      }
    }

    try {
      await createUserWithEmailAndPassword(auth, 'leylah@moodchat.com', '0131');
    } catch (error: any) {
      // Ignore if user already exists
      if (error.code !== 'auth/email-already-in-use') {
        console.error('Error creating leylah:', error);
      }
    }
  }
};

// Call this function when the app starts
if (typeof window !== 'undefined') {
  initializeDefaultUsers();
}

export { db, auth, storage };
