
'use client'

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          Health App
        </Link>
        <div>
          <Link href="/symptom-checker" className="text-gray-300 hover:text-white mr-4">
            Symptom Checker
          </Link>
          <Link href="/specialist-finder" className="text-gray-300 hover:text-white mr-4">
            Specialist Finder
          </Link>
          {user ? (
            <button
              onClick={() => auth.signOut()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          ) : (
            <Link href="/signin" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
