'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaWhatsapp, FaHeart, FaTimes } from 'react-icons/fa';
import { MdLocationOn, MdInterests } from 'react-icons/md';

interface User {
  latitude: number;
  longitude: number;
  _id: string;
}

interface Person {
  image?: string;
  name: string;
  age: number;
  location?: string;
  distance: number;
  about?: string;
  interests?: string[];
  travelStyles?: string[];
  instagram?: string;
  phone: string;
}

const FindPeople = ({ currentUser }: { currentUser: User }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNearbyPeople();
  });

  const fetchNearbyPeople = async () => {
    try {
      const response = await fetch('/api/nearby-people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: currentUser.latitude,
          longitude: currentUser.longitude,
          userId: currentUser._id,
        }),
      });
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error('Error fetching nearby people:', error);
    } finally {
      setLoading(false);
    }
  };

  interface SwipeHandler {
    (swipeDirection: number): Promise<void>;
  }

  const handleSwipe: SwipeHandler = async (swipeDirection) => {
    setDirection(swipeDirection);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setDirection(0);
      setShowDetails(false);
    }, 300);
  };

  interface WhatsAppClickHandler {
    (phoneNumber: string): void;
  }

  const handleWhatsAppClick: WhatsAppClickHandler = (phoneNumber) => {
    const whatsappUrl = `https://wa.me/+91${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-6">🌍</div>
        <h2 className="text-2xl font-bold text-white mb-4">No Travelers Found</h2>
        <p className="text-gray-400">Try expanding your search radius or check back later!</p>
      </div>
    );
  }

  if (currentIndex >= people.length) {
    return (
      <div className="text-center py-20">
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
    );
  }

  const currentPerson = people[currentIndex];

  return (
    <div className="max-w-md mx-auto relative">
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
              {currentPerson.image ? (
                <Image
                  src={currentPerson.image}
                  alt={currentPerson.name}
                  layout="fill"
                  objectFit="cover"
                  className="brightness-90"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-8xl text-gray-500">{currentPerson.name[0]}</span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentPerson.name}, {currentPerson.age}
                </h2>
                <div className="flex items-center gap-2 text-white/80">
                  <MdLocationOn className="text-lg" />
                  <span>{currentPerson.location || 'Location not specified'}</span>
                  <span>•</span>
                  <span>{currentPerson.distance} km away</span>
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
                  <p className="text-gray-300">{currentPerson.about || 'No description provided'}</p>
                </div>

                {currentPerson.interests && currentPerson.interests.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MdInterests className="text-xl" />
                      <h3 className="text-xl font-semibold">Interests</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentPerson.interests.map((interest, idx) => (
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

                {currentPerson.travelStyles && currentPerson.travelStyles.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Travel Style</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentPerson.travelStyles.map((style, idx) => (
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

                {currentPerson.instagram && (
                  <div className="text-sm text-gray-400">
                    <p>Instagram: {currentPerson.instagram}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe(-1)}
              className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-red-500/30 transition-all duration-300"
            >
              <FaTimes className="text-white text-xl" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleWhatsAppClick(currentPerson.phone)}
              className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-green-500/30 transition-all duration-300"
            >
              <FaWhatsapp className="text-white text-xl" />
            </motion.button>

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
        {people.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-blue-500' : 'w-4 bg-gray-700'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FindPeople;