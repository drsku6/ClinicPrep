
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  termsAgreed: boolean;
  setTermsAgreed: (agreed: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  termsAgreed: false,
  setTermsAgreed: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [termsAgreed, setTermsAgreedState] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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

  useEffect(() => {
    if (!termsAgreed && pathname !== '/' && pathname !== '/signin') {
      router.push('/');
    }
  }, [termsAgreed, pathname, router]);


  return (
    <AuthContext.Provider value={{ user, termsAgreed, setTermsAgreed }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
