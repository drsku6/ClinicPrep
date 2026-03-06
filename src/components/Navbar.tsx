
'use client'

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white p-4 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-gray-900 text-2xl font-bold">ClinicPrep</Link>
        <div>
          {user ? (
            <div className="flex items-center">
              <Link href="/security" className="text-gray-900 mr-4">Security</Link>
              <button
                onClick={() => auth.signOut()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              <Link href="/signin" className="text-gray-900 mr-4">Sign In</Link>
              <Link href="/signup" className="text-gray-900">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
