import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase/config';
import { 
  User, 
  onAuthStateChanged, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Define the user data structure
export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  businessName?: string;
  location?: string;
  bio?: string;
  language?: string;
  skills?: string[];
  createdAt?: any;
  lastLogin?: any;
}

// Define the auth context type
interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  clearError: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  signOut: async () => {},
  clearError: () => {},
});

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear any error messages
  const clearError = () => setError(null);

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
    } catch (error) {
      setError('Failed to sign out');
      console.error('Error signing out:', error);
    }
  };

  // Fetch additional user data from Firestore
  const fetchUserData = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserData({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || undefined,
          phoneNumber: user.phoneNumber || undefined,
          ...userSnap.data()
        } as UserData);
      } else {
        // User document doesn't exist in Firestore yet
        setUserData({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || undefined,
          phoneNumber: user.phoneNumber || undefined,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data');
      
      // Set basic user info even if Firestore fetch fails
      setUserData({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || undefined,
        phoneNumber: user.phoneNumber || undefined,
      });
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      setCurrentUser(user);
      
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    isAuthenticated: !!currentUser,
    isLoading,
    error,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 