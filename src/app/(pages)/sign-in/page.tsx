"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Fetch session data to check if user is new
        const session = await fetch('/api/auth/session');
        const sessionData = await session.json();

        if (sessionData?.user?.isNewUser) {
          router.push('/new-user');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className="pt-16 bg-dark min-h-screen flex items-center justify-center">
      <div className="border-2 border-gray-300 p-8 bg-white rounded-3xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8 text-center">Sign In</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6">
          <button
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 mb-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="scale-150 mr-3"/>
            Sign In with Google
          </button>
          <button
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoLogoGithub className="scale-150 mr-3"/>
            Sign In with Github
          </button>
        </div>
      </div>
    </div>
  );
}