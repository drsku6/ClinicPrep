'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithRedirect, signOut as firebaseSignOut, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  termsAgreed: boolean;
  setTermsAgreed: (agreed: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  termsAgreed: false,
  setTermsAgreed: () => {},
  signInWithGoogle: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});

// Safely get the initial value from localStorage, only on the client.
const getInitialTermsAgreed = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('termsAgreed') === 'true';
    }
    return false;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [termsAgreed, setTermsAgreedState] = useState<boolean>(getInitialTermsAgreed);
  const [loading, setLoading] = useState(true);
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      localStorage.setItem('clinicprep_auth_change', Date.now().toString());
    });

    console.log("Checking for redirect result...");
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Caught user from redirect:", result.user.uid);
        }
      })
      .catch((error) => {
        console.error("Error processing redirect result:", error);
      })
      .finally(() => {
        console.log("Finished processing redirect.");
        setIsProcessingRedirect(false);
      });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'clinicprep_auth_change') {
            router.refresh();
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
}, [router]);

  const setTermsAgreed = (agreed: boolean) => {
    localStorage.setItem('termsAgreed', String(agreed));
    setTermsAgreedState(agreed);
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    if (loading || isProcessingRedirect) return;

    const authRoutes = ['/signin', '/signup'];

    if (user && authRoutes.includes(pathname)) {
      console.log("User is logged in, redirecting from auth route to /prepare");
      router.push('/prepare');
      return;
    }

    if (!user && !authRoutes.includes(pathname) && pathname !== '/') {
        console.log("User is not logged in, redirecting to /signin");
      router.push('/signin');
      return;
    }

  }, [user, loading, isProcessingRedirect, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading, termsAgreed, setTermsAgreed, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
