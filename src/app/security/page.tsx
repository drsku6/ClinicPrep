'use client'

import { useAuth } from '@/context/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState } from 'react';

const SecurityPage = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const handlePasswordReset = async () => {
    if (user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        setMessage('A password reset link has been sent to your email.');
      } catch (error) {
        setMessage('Failed to send password reset email. Please try again.');
        console.error('Error sending password reset email:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-6">Account Settings</h1>
        {user ? (
          <div className="text-center">
            <p className="text-lg mb-4">Manage your account settings below.</p>
            <button
              onClick={handlePasswordReset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Reset Password
            </button>
            {message && <p className="text-green-500 text-center mt-4">{message}</p>}
          </div>
        ) : (
          <p className="text-center">Please sign in to manage your account settings.</p>
        )}
      </div>
    </div>
  );
};

export default SecurityPage;
