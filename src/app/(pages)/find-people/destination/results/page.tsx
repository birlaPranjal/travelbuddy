'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';

interface TravelPlan {
  _id: string;
  destination: string;
  fromDate: string;
  toDate: string;
  budget: number;
  formattedAddress: string;
  distanceInKm: number;
  user: {
    _id: string;
    name: string;
    email: string;
    image: string;
  }
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [matchedPlans, setMatchedPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
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
        console.log(data);
        setMatchedPlans(data.matches);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError('Failed to load travel matches. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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

  if (matchedPlans.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🌍</div>
          <h2 className="text-2xl font-bold text-white mb-4">No Matches Found</h2>
          <p className="text-gray-400">
            We couldn't find any travelers matching your criteria.
            Try adjusting your search parameters!
          </p>
        </div>
      </div>
    );
  }

  const currentPlan = matchedPlans[currentIndex];

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-md mx-auto">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div 
                className="bg-gray-800 rounded-3xl overflow-hidden shadow-2xl"
                onClick={() => setShowDetails(!showDetails)}
              >
                <div className="relative h-[500px]">
                  {currentPlan.user.image ? (
                    <Image
                      src={currentPlan.user.image}
                      alt={currentPlan.user.name}
                      layout="fill"
                      objectFit="cover"
                      className="brightness-90"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-8xl text-gray-500">
                        {currentPlan.user.name[0]}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {currentPlan.user.name}
                    </h2>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="h-5 w-5" />
                      <span>{currentPlan.formattedAddress}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-white/80">
                      <Clock className="h-5 w-5" />
                      <span>
                        {format(new Date(currentPlan.fromDate), 'MMM d')} - 
                        {format(new Date(currentPlan.toDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="mt-2 text-white/80">
                      <span className="text-blue-400">
                        {currentPlan.distanceInKm.toFixed(1)} km away
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
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">Budget</h3>
                      <p className="text-gray-300">
                        ₹{currentPlan.budget.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>Email: {currentPlan.user.email}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  className="w-14 h-14 bg-gray-500/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-gray-500/30 transition-all duration-300"
                  disabled={currentIndex === 0}
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentIndex(Math.min(matchedPlans.length - 1, currentIndex + 1))}
                  className="w-14 h-14 bg-gray-500/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-gray-500/30 transition-all duration-300"
                  disabled={currentIndex === matchedPlans.length - 1}
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
          </div>
        </div>
      );
    }