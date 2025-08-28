'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import FindPeople from './FindPeople';
import { motion } from 'framer-motion';

const FindPeoplePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const userData = await response.json();
        setCurrentUser(userData.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center -mt-10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Finding travel companions near you...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-6">👤</div>
          <h2 className="text-2xl font-bold text-white mb-4">Profile Required</h2>
          <p className="text-gray-400 mb-8">Please complete your profile to find travel companions</p>
          <button 
            onClick={() => router.push('/new-user')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 -mt-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white mb-4">Find Travel Companions</h1>
          <p className="text-gray-400 text-lg">Discover like-minded travelers in your area</p>
        </div>
        <FindPeople currentUser={currentUser} />
      </motion.div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(FindPeoplePage), { ssr: false });
