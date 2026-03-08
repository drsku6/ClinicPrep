'use client'

import { useAuth } from '@/context/AuthContext';
import type { User } from 'firebase/auth';

// This component contains the actual UI for the page, shown only to authenticated users.
const PrepareDashboard = ({ user }: { user: User }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Prepare for your appointment</h1>
        <p className="text-lg">Welcome, {user.displayName || user.email}.</p>
        <p>You have successfully accessed the protected clinical preparation area.</p>
        {/* The rest of your dashboard UI will go here */}
      </div>
    </div>
  );
};


const PreparePage = () => {
  const { user, loading } = useAuth();

  // 1. Loading State Gate: Display a message while auth status is being confirmed.
  if (loading) {
    return <div className="flex justify-center p-10">Verifying Clinical Credentials...</div>;
  }

  // 2. Unauthenticated State Gate: Show an error if the user is not logged in.
  // The AuthProvider will handle the redirect to the sign-in page.
  if (!user) {
    return <div className="p-10 text-red-600 font-bold">This is a protected route. Please sign in.</div>;
  }

  // 3. Authenticated State: Render the main dashboard content.
  return <PrepareDashboard user={user} />;
};

export default PreparePage;
