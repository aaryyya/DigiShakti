import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyDUMMY-KEY-REPLACE-ME123456",
  authDomain: "your-app-name.firebaseapp.com",
  projectId: "your-app-name",
  storageBucket: "your-app-name.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:dummyappid123456"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 
