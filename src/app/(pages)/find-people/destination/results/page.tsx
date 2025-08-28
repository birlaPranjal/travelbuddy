"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaWhatsapp, FaHeart, FaTimes } from 'react-icons/fa';
import { MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  age?: number;
  gender?: string;
  location?: string;
  about?: string;
  languages?: string[];
  interests?: string[];
  travelStyles?: string[];
  instagram?: string;
  phone?: string;
  isAcceptingMessages?: boolean;
}

interface TravelPlan {
  destination: string;
  fromDate: string;
  toDate: string;
  budget: number;
  formattedAddress: string;
  coordinates: {
    type: string;
    coordinates: number[];
  };
  distanceInKm: number;
}

interface Match {
  user: User;
  travelPlans: TravelPlan[];
}

export default function ResultsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/destination-matches', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }

        const data = await response.json();
        setMatches(data.matches);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError('Failed to load travel matches. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleSwipe = async (swipeDirection: number) => {
    setDirection(swipeDirection);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setDirection(0);
      setShowDetails(false);
    }, 300);
  };

  const handleWhatsAppClick = (phoneNumber?: string) => {
    if (!phoneNumber) return;
    const whatsappUrl = `https://wa.me/+91${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Oops!</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🌍</div>
          <h2 className="text-2xl font-bold text-white mb-4">No Matches Found</h2>
          <p className="text-gray-400">
            We couldn&apos;t find any travelers matching your criteria.
            Try adjusting your search parameters!
          </p>
        </div>
      </div>
    );
  }

  if (currentIndex >= matches.length) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-2xl font-bold text-white mb-4">You&apos;ve Seen Everyone!</h2>
          <p className="text-gray-400 mb-8">Check back later for new travel companions</p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const currentMatch = matches[currentIndex];
  const currentPlan = currentMatch.travelPlans[0];

  return (
    <div className="min-h-screen bg-gray-900 py-12 -mt-16">
      <h1 className="text-3xl font-bold text-center text-white mt-8 -my-7">
        Matched People Travelling near your destination
      </h1>
      <div className="max-w-md mx-auto px-4 py-16 relative">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ 
              x: direction === 1 ? 200 : -200,
              opacity: 0,
              scale: 0.95
            }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div 
              className="bg-gray-800 rounded-3xl overflow-hidden shadow-2xl"
              onClick={() => setShowDetails(!showDetails)}
            >
              <div className="relative h-[500px]">
                {currentMatch.user.image ? (
                  <Image
                    src={currentMatch.user.image}
                    alt={currentMatch.user.name}
                    layout="fill"
                    objectFit="cover"
                    className="brightness-90"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-8xl text-gray-500">
                      {currentMatch.user.name[0]}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {currentMatch.user.name}, {currentMatch.user.age}
                  </h2>
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="h-5 w-5" />
                    <span>Wants to travel to {currentPlan.formattedAddress}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-white/80">
                    <Clock className="h-5 w-5" />
                    <span>
                      From {format(new Date(currentPlan.fromDate), 'MMM d')} - 
                      {format(new Date(currentPlan.toDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="mt-2 text-white/80">
                    <span className="text-blue-400">
                      {currentPlan.distanceInKm.toFixed(1)} km away from your destination
                    </span>
                  </div>
                </div>
              </div>

              <motion.div
                initial={false}
                animate={{ height: showDetails ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 text-white">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">About</h3>
                    <p className="text-gray-300">
                      {currentMatch.user.about || 'No description provided'}
                    </p>
                  </div>

                  {currentMatch.user.interests && currentMatch.user.interests.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentMatch.user.interests.map((interest, idx) => (
                          <span 
                            key={idx}
                            className="bg-blue-900/30 px-3 py-1 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentMatch.user.travelStyles && currentMatch.user.travelStyles.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">Travel Style</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentMatch.user.travelStyles.map((style, idx) => (
                          <span 
                            key={idx}
                            className="bg-purple-900/30 px-3 py-1 rounded-full text-sm"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Budget</h3>
                    <p className="text-gray-300">
                      ₹{currentPlan.budget.toLocaleString()}
                    </p>
                  </div>

                  {currentMatch.user.instagram && (
                    <div className="text-sm text-gray-400">
                      <p>Instagram: {currentMatch.user.instagram}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="translate-x-1/4 flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe(-1)}
                className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-red-500/30 transition-all duration-300"
              >
                <FaTimes className="text-white text-xl" />
              </motion.button>

              {currentMatch.user.phone && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleWhatsAppClick(currentMatch.user.phone)}
                  className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-green-500/30 transition-all duration-300"
                >
                  <FaWhatsapp className="text-white text-xl" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe(1)}
                className="w-14 h-14 bg-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-pink-500/30 transition-all duration-300"
              >
                <FaHeart className="text-white text-xl" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-center gap-2">
          {matches.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-blue-500' : 'w-4 bg-gray-700'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}