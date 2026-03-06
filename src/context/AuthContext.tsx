'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, getMultiFactorResolver, TotpMultiFactorGenerator } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  termsAgreed: boolean;
  setTermsAgreed: (agreed: boolean) => void;
  signInWithGoogle: () => Promise<any>;
  mfaResolver: any;
  setMfaResolver: (resolver: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  termsAgreed: false,
  setTermsAgreed: () => {},
  signInWithGoogle: () => Promise.resolve(),
  mfaResolver: null,
  setMfaResolver: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [termsAgreed, setTermsAgreedState] = useState<boolean>(false);
  const [mfaResolver, setMfaResolver] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setMfaResolver(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error: any) {
      if (error.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, error);
        setMfaResolver(resolver);
        return resolver;
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    if (loading) return; // Wait for auth state to load

    const publicRoutes = ['/signin', '/signup', '/'];

    // MFA enforcement
    if (mfaResolver && pathname !== '/signin') {
      router.push('/signin');
      return;
    }

    // Terms of Use and Auth enforcement
    if (!user && !publicRoutes.includes(pathname)) {
        router.push('/signin');
        return;
    }

    if (user && !termsAgreed && !publicRoutes.includes(pathname)) {
        router.push('/');
        return;
    }

  }, [user, termsAgreed, mfaResolver, pathname, router, loading]);


  return (
    <AuthContext.Provider value={{ user, termsAgreed, setTermsAgreed, signInWithGoogle, mfaResolver, setMfaResolver }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
