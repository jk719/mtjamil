'use client';

import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, loading, sendVerificationEmail } = useAuth();
  const router = useRouter();
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleVerifyEmail = async () => {
    try {
      await sendVerificationEmail();
      setVerificationSent(true);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="space-x-4">
              {user && !user.emailVerified && (
                <button
                  onClick={handleVerifyEmail}
                  disabled={verificationSent}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
                >
                  {verificationSent ? 'Verification Email Sent' : 'Verify Email'}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Welcome, {user?.email}</p>
            {user && (
              <p className={`text-sm mt-2 ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                {user.emailVerified ? '✓ Email verified' : '! Email not verified'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 