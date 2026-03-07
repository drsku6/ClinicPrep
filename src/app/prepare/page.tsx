'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const PreparePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Prepare for your appointment</h1>
        <p>This is a protected route. Only logged-in users can see this.</p>
      </div>
    </div>
  );
};

export default PreparePage;
