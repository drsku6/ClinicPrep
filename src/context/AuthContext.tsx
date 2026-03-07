'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithRedirect, signOut as firebaseSignOut } from 'firebase/auth';
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [termsAgreed, setTermsAgreedState] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      localStorage.setItem('clinicprep_auth_change', Date.now().toString());
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

  useEffect(() => {
    const agreed = localStorage.getItem('termsAgreed') === 'true';
    setTermsAgreedState(agreed);
  }, []);

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
    if (loading) return;

    const authRoutes = ['/signin', '/signup'];

    if (user && authRoutes.includes(pathname)) {
      router.push('/');
      return;
    }

    if (!user && !authRoutes.includes(pathname) && pathname !== '/') {
      router.push('/signin');
      return;
    }

    if (user && !termsAgreed && pathname !== '/') {
      router.push('/');
      return;
    }
  }, [user, termsAgreed, pathname, router, loading]);

  return (
    <AuthContext.Provider value={{ user, loading, termsAgreed, setTermsAgreed, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
