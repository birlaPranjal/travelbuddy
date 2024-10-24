'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

const FindPeople = ({ currentUser }) => {
  const [people, setPeople] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // Track swipe direction for animations
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    fetchNearbyPeople();
  }, []);

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
      console.log('Nearby people:', data);
      setPeople(data);
    } catch (error) {
      console.error('Error fetching nearby people:', error);
    }
  };

  const handleSwipe = async (swipeDirection) => {
    // Set direction for animation (-1 for left, 1 for right)
    setDirection(swipeDirection);

    // Simulate swipe action delay for animation to complete
    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1); // Move to next person
      setDirection(0); // Reset direction
    }, 300); // Ensure delay matches animation duration
  };

  const handleWhatsAppClick = (phoneNumber) => {
    // Redirect to WhatsApp chat with the person
    const whatsappUrl = `https://wa.me/+91${phoneNumber}`;
    window.open(whatsappUrl, '_blank'); // Open in a new tab
  };

  if (people.length === 0) {
    return <div className="text-center py-10">Loading nearby people...</div>;
  }

  if (currentIndex >= people.length) {
    return <div className="text-center py-10">No more people nearby!</div>;
  }

  const currentPerson = people[currentIndex];

  return (
    <div className="max-w-md mx-auto p-4 relative">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute w-full"
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === 1 ? 500 : -500, opacity: 0 }} // Exit left or right
          transition={{ duration: 0.3 }}
        >
          <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-72 relative">
              {currentPerson.image ? (
                <Image
                  src={currentPerson.image}
                  alt={currentPerson.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-4xl">{currentPerson.name[0]}</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-2xl font-bold">{currentPerson.name}, {currentPerson.age}</h2>
              <p className="text-gray-600">{currentPerson.location}</p>
              <p className="text-gray-600">{currentPerson.distance} km</p>
              <p className="mt-2">{currentPerson.about}</p>
              {currentPerson.interests && currentPerson.interests.length > 0 && (
                <div className="mt-2">
                  <h3 className="font-semibold">Interests:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentPerson.interests.map((interest, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center p-4 gap-4">
              <button
                onClick={() => handleSwipe(-1)} // Swipe left
                className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
              <button
                onClick={() => handleSwipe(1)} // Swipe right
                className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
              >
                ♥
              </button>
              <button
                onClick={() => handleWhatsAppClick(currentPerson.phone)} // Redirect to WhatsApp
                className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FindPeople;
