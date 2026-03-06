'use client'

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const HomePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to ClinicPrep</h1>
        <p className="text-lg text-gray-700 mb-8">Your personal health assistant to prepare for your next clinic visit.</p>
        {user ? (
          <div>
            <p className="text-xl mb-4">You are signed in as {user.email}</p>
            <button
              onClick={() => router.push('/prepare')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg focus:outline-none focus:shadow-outline"
            >
              Start Clinic Prep
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xl mb-4">Sign in to get started.</p>
            <button
                onClick={() => router.push('/signin')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg focus:outline-none focus:shadow-outline"
            >
                Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
