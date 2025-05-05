"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getAllItineraries } from '@/app/model/Itinerary';
import { DBItinerary } from '@/app/model/Itinerary';
import Image from 'next/image';
import { PageTransition } from '@/app/components/PageTransition';
import { Spinner } from '@/app/components/Spinner';

const ItinerariesPage = () => {
  const [itineraries, setItineraries] = useState<DBItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getAllItineraries();
        
        if (result.success && result.itineraries) {
          setItineraries(result.itineraries);
        } else {
          throw new Error(result.error || 'Failed to fetch itineraries');
        }
      } catch (err) {
        console.error('Error fetching itineraries:', err);
        setError('Failed to load itineraries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  const handleViewDetails = (id: string) => {
    router.push(`/itineraries/${id}`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Travel Itineraries</h1>
            <p className="text-gray-300">
              Explore our curated travel packages and find your next adventure!
            </p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg mb-8">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" color="white" />
              <span className="ml-3 text-white">Loading itineraries...</span>
            </div>
          ) : itineraries.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold text-white mb-2">No Itineraries Available</h2>
              <p className="text-gray-400">
                Check back soon for new travel packages and adventures.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {itineraries.map((itinerary) => (
                <motion.div 
                  key={itinerary._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    {itinerary.images && itinerary.images.length > 0 ? (
                      <Image
                        src={itinerary.images[0]}
                        alt={itinerary.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500">No image available</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-blue-600 text-white py-1 px-3 rounded-full text-sm font-bold">
                      ${itinerary.price}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-2">{itinerary.title}</h2>
                    <div className="flex items-center text-gray-400 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{itinerary.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400 mb-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{itinerary.duration} {itinerary.duration === 1 ? 'day' : 'days'}</span>
                    </div>
                    
                    <p className="text-gray-400 mb-6 line-clamp-3">{itinerary.description}</p>
                    
                    <button
                      onClick={() => handleViewDetails(itinerary._id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ItinerariesPage; 