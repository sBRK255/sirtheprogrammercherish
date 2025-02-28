import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKx6uCd5UUxW5fc0OuchupH9J_nWJ7YGc",
  authDomain: "somefunnyinmymood.firebaseapp.com",
  projectId: "somefunnyinmymood",
  storageBucket: "somefunnyinmymood.appspot.com",
  messagingSenderId: "326710263086",
  appId: "1:326710263086:web:63c6f6f569443f50750ebf",
  measurementId: "G-D3SMTYZ1K4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize default users if they don't exist
const initializeDefaultUsers = async () => {
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
};

// Call this function when the app starts
initializeDefaultUsers();
