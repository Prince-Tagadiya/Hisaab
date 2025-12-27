'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebaseClient';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Sync with backend
        try {
          const token = await firebaseUser.getIdToken();
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          // Handling redirects based on response
          if (data.isNewUser) {
             router.push('/register');
          } else if (window.location.pathname === '/login' || window.location.pathname === '/') {
             // Only redirect to dashboard if currently on public pages
             // Avoid redirecting if user is on specific page already 
             router.push('/dashboard');
          }
        } catch (e) {
          console.error("Failed to sync user", e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Logic handled in onAuthStateChanged
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
    router.push('/');
  };

  const getIdToken = async () => {
    if (!user) throw new Error("No user logged in");
    return user.getIdToken();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut: signOutUser, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
