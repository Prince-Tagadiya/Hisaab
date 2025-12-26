import { createContext, useContext, useEffect, useState } from "react";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // The user is signed in. processUser handles profile creation.
      return result.user;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  /**
   * Checks if user/profile exists in Firestore, creates it if not.
   */


  useEffect(() => {
    let profileUnsub = null;

    const authUnsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Listen to user profile changes in real-time
        const userRef = doc(db, "users", user.uid);
        profileUnsub = onSnapshot(userRef, (docSnap) => {
           if (docSnap.exists()) {
             setUserProfile(docSnap.data());
             // Update last active quietly
             setDoc(userRef, { lastActiveAt: serverTimestamp() }, { merge: true }).catch(console.error);
           } else {
             setUserProfile(null); // User verified, but no profile -> Needs Create Account
           }
           setLoading(false);
        }, (error) => {
           console.error("Profile listen error:", error);
           setLoading(false);
        });
      } else {
        // Logged out
        if (profileUnsub) profileUnsub();
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authUnsub();
      if (profileUnsub) profileUnsub();
    };
  }, []);

  const value = {
    currentUser,
    userProfile,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
