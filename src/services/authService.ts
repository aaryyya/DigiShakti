import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role?: string;
  createdAt?: any;
  lastLogin?: any;
}

// Register with email and password
export const registerWithEmail = async (
  email: string, 
  password: string, 
  name: string
): Promise<UserData> => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName: name });
    
    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email || email,
      displayName: name,
      photoURL: user.photoURL || '',
      role: 'user',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };
    
    await setDoc(doc(db, "users", user.uid), userData);
    
    return userData;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login with email and password
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login timestamp
    const userRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Login with Google
export const loginWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if this is a new user
    const userRef = doc(db, "users", userCredential.user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // First time Google login, create user document
      const userData: UserData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName || '',
        photoURL: userCredential.user.photoURL || '',
        role: 'user',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };
      
      await setDoc(userRef, userData);
    } else {
      // Existing user, update last login
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
    
    return userCredential.user;
  } catch (error) {
    console.error("Error with Google sign in:", error);
    throw error;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (): Promise<UserData | null> => {
  const user = auth.currentUser;
  
  if (!user) return null;
  
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
}; 