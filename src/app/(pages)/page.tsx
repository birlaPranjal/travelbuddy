"use client"
import React from "react";
import { useRouter } from 'next/navigation';
import RevealText from "@/components/RevealText";
import HomeImageSwiper from "@/components/HomeImageSwiper";
import FaqSection from "@/components/FaqSection";

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

export default function Page() {
  const router = useRouter();

  return (
    <div className="bg-gray-900 text-gray-100">
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-4 -mt-8 md:-mt-24 relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10">
          <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 text-4xl md:text-5xl lg:text-8xl font-sans py-2 md:py-10 font-bold tracking-tight">
            Discover India<br />One Journey at a Time!
          </h1>
          <p className="text-lg mt-5 md:mt-0 mx-8 md:mx-0 md:text-2xl max-w-3xl mb-8 text-gray-300">
            Experience the magic of ancient traditions, diverse cultures, and breathtaking landscapes 
            across the incredible subcontinent.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
            Start Your Journey
          </button>
        </div>
      </section>

      <section className="py-20">
        <RevealText />
      </section>

      <section className="py-20 bg-gray-800">
        <HomeImageSwiper />
      </section>

      <section className="max-w-7xl mx-auto mt-20 px-4">
        <h2 className="text-4xl font-bold text-gray-100 text-center mb-12">
          Popular Indian Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularDestinations.map((dest, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="h-[400px] relative">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{dest.name}</h3>
                  <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {dest.description}
                  </p>
                  <button className="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-all duration-300">
                    Explore More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto mt-20 px-4">
        <h2 className="text-4xl font-bold text-gray-100 text-center mb-12">
          Luxury Stays
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {luxuryHotels.map((hotel, index) => (
            <div key={index} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="h-64 relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                <p className="text-gray-400 mb-2">{hotel.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">★ {hotel.rating}</span>
                  <span className="text-blue-400">{hotel.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto mt-20 px-4">
        <h2 className="text-4xl font-bold text-gray-100 text-center mb-12">
          Why Choose India?
        </h2>
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
            <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto mt-20 px-4 py-20 bg-gray-800 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-100 mb-6">
            Meet Gantavya AI - Your Personal Travel Companion
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the hidden gems of India with our AI-powered guide. From historical facts to local customs, 
            Gantavya knows it all!
          </p>
        </div>
        <div className="bg-gray-900 p-8 rounded-xl max-w-4xl mx-auto">
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 p-3 rounded-full">🤖</div>
              <div className="bg-gray-800 rounded-2xl p-4 flex-1">
                <p className="text-gray-300">
                  Namaste! I&apos;m Gantavya, your AI travel companion for India. I can help you discover:
                </p>
                <ul className="mt-2 space-y-2 text-gray-400">
                  <li>• Hidden local attractions and secret spots</li>
                  <li>• Cultural insights and historical facts</li>
                  <li>• Best times to visit any destination</li>
                  <li>• Local customs and etiquette tips</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button 
              onClick={() => router.push('/chatbot')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Chat with Gantavya AI
            </button>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <FaqSection/>
      </section>

      <section className="bg-blue-900 text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Experience India?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of travelers who have discovered the magic of India</p>
          <button className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full hover:bg-blue-100 transition-all duration-300">
            Plan Your Trip Now
          </button>
        </div>
      </section>
    </div>
  );
}