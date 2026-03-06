
'use client'

import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to ClinicPrep</h1>
        <p className="text-lg text-gray-700 mb-8">Your personal health assistant to prepare for your next clinic visit.</p>
        {user ? (
          <div>
            <p className="text-xl">You are signed in as {user.email}</p>
          </div>
        ) : (
          <div>
            <p className="text-xl">Sign in to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
