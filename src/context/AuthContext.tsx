
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, getMultiFactorResolver, TotpMultiFactorGenerator } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  termsAgreed: boolean;
  setTermsAgreed: (agreed: boolean) => void;
  signInWithGoogle: () => Promise<any>; // Changed return type
  mfaResolver: any; // Added for MFA
  setMfaResolver: (resolver: any) => void; // Added for MFA
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
  const [mfaResolver, setMfaResolver] = useState<any>(null); // Added for MFA
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setMfaResolver(null); // Clear resolver on sign out
      }
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
      router.push('/');
      return result;
    } catch (error: any) {
      if (error.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, error);
        setMfaResolver(resolver);
        return resolver; // Return resolver to the UI
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    if (!termsAgreed && pathname !== '/' && pathname !== '/signin') {
      router.push('/');
    }
  }, [termsAgreed, pathname, router]);


  return (
    <AuthContext.Provider value={{ user, termsAgreed, setTermsAgreed, signInWithGoogle, mfaResolver, setMfaResolver }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
