'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'waiting' | 'loading' | 'success' | 'error'>('waiting');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async () => {
    setStatus('loading');
    setError('');
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: localStorage.getItem('verificationEmail'),
          otp: otp.join('')
        }),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          router.push('/new-user');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Verification failed');
        setStatus('error');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An unexpected error occurred');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Enter Verification Code
        </h2>
        <p className="text-gray-400 text-center mb-8">
          We've sent a verification code to your email
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-12 h-12 text-center text-2xl font-bold rounded-lg border-2 border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && (
          <div className="text-red-400 text-center mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={status === 'loading' || otp.some(digit => !digit)}
          className="w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Verifying...' : 'Verify Email'}
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              // Implement resend OTP logic
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
} 