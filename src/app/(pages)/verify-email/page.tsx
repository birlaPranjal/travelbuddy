'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus('success');
          setTimeout(() => {
            router.push('/new-user');
          }, 3500);
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
        console.log('Error verifying email:', error);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Verifying your email...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Email Verified!</h2>
            <p className="text-gray-300">Your email has been successfully verified. Redirecting to your profile...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Verification Failed</h2>
            <p className="text-gray-300 mb-4">The verification link is invalid or has expired.</p>
            <button
              onClick={() => router.push('/sign-in')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 