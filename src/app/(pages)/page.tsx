"use client"
import React from "react";
import { useRouter } from 'next/navigation';
import RevealText from "@/components/RevealText";
import HomeImageSwiper from "@/components/HomeImageSwiper";
import FaqSection from "@/components/FaqSection";
import { motion } from "framer-motion";
import Image from "next/image";

const popularDestinations = [
  {
    name: "Taj Mahal, Agra",
    image: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg",
    description: "Symbol of eternal love, this ivory-white marble mausoleum is a UNESCO World Heritage site."
  },
  {
    name: "Varanasi Ghats",
    image: "https://images.pexels.com/photos/8112558/pexels-photo-8112558.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Ancient spiritual capital with mesmerizing Ganga aarti ceremonies."
  },
  {
    name: "Kerala Backwaters",
    image: "https://images.pexels.com/photos/5069357/pexels-photo-5069357.jpeg",
    description: "Serene waterways perfect for houseboat cruises through tropical landscapes."
  },
  {
    name: "Rajasthan Palaces",
    image: "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg",
    description: "Royal heritage sites showcasing magnificent architecture and culture."
  },
  {
    name: "Goa Beaches",
    image: "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg",
    description: "Paradise for beach lovers with golden sands and vibrant nightlife."
  }
];

const luxuryHotels = [
  {
    name: "The Oberoi Udaivilas",
    location: "Udaipur",
    image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
    rating: 4.9,
    price: "₹45,000/night"
  },
  {
    name: "Taj Lake Palace",
    location: "Udaipur",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    rating: 4.8,
    price: "₹38,000/night"
  },
  {
    name: "The Leela Palace",
    location: "New Delhi",
    image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    rating: 4.7,
    price: "₹32,000/night"
  }
];

const testimonials = [
  {
    name: "Priya Singh",
    location: "Mumbai",
    text: "TravelBuddy helped me find the perfect travel companion for my trip to Manali. We had an amazing experience exploring the mountains together!",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    name: "Raj Sharma",
    location: "Delhi",
    text: "Through TravelBuddy, I discovered hidden gems in Goa that I would have completely missed. The AI companion was incredibly helpful!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Ananya Patel",
    location: "Bangalore",
    text: "My solo trip to Kerala turned into an unforgettable adventure thanks to TravelBuddy's matched travel partners. Will definitely use again!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

export default function Page() {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex flex-col items-center justify-center min-h-screen text-center px-4 -mt-8 md:-mt-24 relative"
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg')] bg-cover bg-center opacity-20 brightness-75">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900"></div>
        </div>
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-clip-text text-transparent text-center bg-gradient-to-b from-blue-300 via-blue-500 to-indigo-600 text-4xl md:text-5xl lg:text-8xl font-sans py-2 md:py-10 font-bold tracking-tight"
          >
            Discover India<br />One Journey at a Time!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg mt-5 md:mt-0 mx-8 md:mx-0 md:text-2xl max-w-3xl mb-8 text-gray-300"
          >
            Experience the magic of ancient traditions, diverse cultures, and breathtaking landscapes 
            across the incredible subcontinent.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => router.push('/destinations')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <span>Explore Destinations</span>
              <span className="ml-2">→</span>
            </button>
            <button 
              onClick={() => router.push('/find-people')}
              className="bg-transparent hover:bg-white/10 border-2 border-white/30 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
            >
              Find Travel Buddies
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-gray-400 mb-2">Scroll to explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </motion.section>

      {/* Reveal Text Animation */}
      <section className="py-20">
        <RevealText />
      </section>

      {/* Image Swiper */}
      <section className="py-20 bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 z-0"></div>
        <div className="relative z-10">
          <HomeImageSwiper />
        </div>
      </section>

      {/* Popular Destinations */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
        className="max-w-7xl mx-auto mt-20 px-4 py-16"
      >
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Popular Indian Destinations
          </span>
        </h2>
        <p className="text-gray-400 text-center max-w-3xl mx-auto mb-12">
          Explore the most iconic locations across India, from ancient temples to pristine beaches
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularDestinations.map((dest, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-[400px] relative">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{dest.name}</h3>
                  <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {dest.description}
                  </p>
                  <button className="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all duration-300 flex items-center">
                    <span>Explore</span>
                    <span className="ml-1">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Luxury Stays */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
        className="max-w-7xl mx-auto mt-20 px-4 py-16"
      >
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600">
            Luxury Stays
          </span>
        </h2>
        <p className="text-gray-400 text-center max-w-3xl mx-auto mb-12">
          Experience world-class hospitality at India&apos;s most luxurious hotels and resorts
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {luxuryHotels.map((hotel, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="h-64 relative overflow-hidden">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 font-bold rounded-full h-10 w-10 flex items-center justify-center">
                  {hotel.rating}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
                <p className="text-gray-400 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.5L16.5 18L15.5 13.5L20 10.5H15L12 6L9 10.5H4L8.5 13.5L7.5 18L12 13.5Z" fill="currentColor"/>
                  </svg>
                  {hotel.location}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className="text-blue-400 font-medium">{hotel.price}</span>
                  <button className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full text-sm transition-colors duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features/Why Choose India? */}
      <section className="max-w-7xl mx-auto mt-20 px-4 py-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-100 mb-4">
            Why Choose India?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover what makes India one of the most diverse and fascinating destinations in the world
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              title: "Rich Heritage",
              icon: "🏛️",
              desc: "5000+ years of history and culture"
            },
            {
              title: "Diverse Cuisine",
              icon: "🍛",
              desc: "Experience countless flavors and spices"
            },
            {
              title: "Spiritual Journey",
              icon: "🕉️",
              desc: "Find peace in ancient temples and practices"
            },
            {
              title: "Natural Beauty",
              icon: "🏔️",
              desc: "From Himalayas to tropical beaches"
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/50 hover:border-blue-500/30 group"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors duration-300">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
        className="max-w-7xl mx-auto mt-20 px-4 py-16"
      >
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-600">
            Traveler Stories
          </span>
        </h2>
        <p className="text-gray-400 text-center max-w-3xl mx-auto mb-12">
          Read how TravelBuddy has transformed the way people explore India
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl"
            >
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-4">
                  <Image 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover border-2 border-blue-500"
                  />
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-gray-300">&ldquo;{testimonial.text}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* AI Companion Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
        className="max-w-7xl mx-auto mt-20 px-4 py-20 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-3xl overflow-hidden relative"
      >
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
        
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-4xl font-bold text-gray-100 mb-6">
            Meet Gantavya AI - Your Personal Travel Companion
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the hidden gems of India with our AI-powered guide. From historical facts to local customs, 
            Gantavya knows it all!
          </p>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-xl max-w-4xl mx-auto border border-gray-800 shadow-xl relative z-10">
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-full flex-shrink-0">🤖</div>
              <div className="bg-gray-800 rounded-2xl p-4 flex-1">
                <p className="text-gray-300">
                  Namaste! I&apos;m Gantavya, your AI travel companion for India. I can help you discover:
                </p>
                <ul className="mt-2 space-y-2 text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Hidden local attractions and secret spots
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Cultural insights and local traditions
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Personalized itinerary recommendations
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button 
              onClick={() => router.push('/chatbot')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Chat with Gantavya &nbsp;&rarr;
            </button>
          </div>
        </div>

        {/* Quote Card */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
          className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-2xl max-w-lg mx-auto mt-12 text-center shadow-xl border border-purple-500/20"
        >
          <p className="text-xl text-gray-200 mb-4 italic">
            &ldquo;The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.&rdquo;
          </p>
          <p className="text-gray-400">- Marcel Proust</p>
        </motion.div>
      </motion.section>

      {/* FAQ Section */}
      <section className="py-20">
        <FaqSection />
      </section>

      {/* Call to Action */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
        className="py-20 text-center"
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Indian Adventure?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of travelers discovering the beauty and culture of India with TravelBuddy
          </p>
          <button 
            onClick={() => router.push('/sign-in')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started Now
          </button>
        </div>
      </motion.section>
    </div>
  );
}