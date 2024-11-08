'use client';
import Link from 'next/link';

const successStories = [
  {
    id: 1,
    title: "Backpacking Through Ladakh",
    image: "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
    story: {
      users: [
        { name: "Rahul", age: 28, from: "Mumbai" },
        { name: "Sarah", age: 26, from: "London" }
      ],
      content: "Met through TravelBuddy and explored the breathtaking landscapes of Ladakh together. What started as a travel partnership turned into a lifelong friendship!",
      date: "August 2023"
    }
  },
  {
    id: 2,
    title: "Kerala Group Adventure",
    image: "https://images.pexels.com/photos/5069357/pexels-photo-5069357.jpeg",
    story: {
      users: [
        { name: "Priya", age: 24, from: "Bangalore" },
        { name: "Mike", age: 27, from: "Australia" },
        { name: "Chen", age: 25, from: "Singapore" }
      ],
      content: "Three solo travelers united for an unforgettable Kerala backwaters experience. Shared stories, cultures, and created memories that will last a lifetime.",
      date: "October 2023"
    }
  },
  {
    id: 3,
    title: "Rajasthan Heritage Tour",
    image: "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg",
    story: {
      users: [
        { name: "Emma", age: 29, from: "Canada" },
        { name: "Amit", age: 31, from: "Delhi" }
      ],
      content: "Found each other through destination matching. Emma wanted to explore Indian culture, while Amit knew all the hidden gems of Rajasthan.",
      date: "December 2023"
    }
  }
];

const benefits = [
  {
    icon: "👥",
    title: "Safe & Verified",
    description: "All users are verified through multiple checks for a safe travel experience"
  },
  {
    icon: "🎯",
    title: "Perfect Match",
    description: "Our algorithm matches you with travelers sharing similar interests and travel styles"
  },
  {
    icon: "💰",
    title: "Split Costs",
    description: "Share accommodation and travel expenses to make your journey more affordable"
  },
  {
    icon: "🌟",
    title: "Local Insights",
    description: "Connect with locals or experienced travelers for authentic experiences"
  }
];

export default function FindPeoplePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white -mt-5">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/935835/pexels-photo-935835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Travel Friends"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Your Perfect Travel Companion</h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
            Connect with like-minded travelers and locals to make your journey more memorable
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link 
              href="/find-people/destination" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="block text-2xl mb-2">🌍</span>
              Find by Destination
            </Link>
            <Link 
              href="/find-people/nearby" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="block text-2xl mb-2">📍</span>
              Find Nearby Travelers
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Find a Travel Buddy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-xl hover:bg-gray-600 transition-all duration-300">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Travel Buddy Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="h-48 relative">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{story.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.story.users.map((user, index) => (
                      <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                        {user.name}, {user.age} ({user.from})
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">{story.story.content}</p>
                  <p className="text-gray-400 text-sm">{story.story.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-4">Create Your Profile</h3>
              <p className="text-gray-300">Share your travel preferences, interests, and upcoming plans</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-4">Find Matches</h3>
              <p className="text-gray-300">Connect with travelers heading to your dream destination</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-4">Plan Together</h3>
              <p className="text-gray-300">Chat, plan your itinerary, and embark on your adventure</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Travel Buddy?</h2>
            <p className="text-xl mb-8">Join thousands of travelers who&apos;ve found their perfect travel companions</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/find-people/destination" 
                className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl transition-all duration-300"
              >
                Search by Destination
              </Link>
              <Link 
                href="/find-people/nearby" 
                className="bg-gray-900 text-white hover:bg-gray-800 font-bold py-4 px-8 rounded-xl transition-all duration-300"
              >
                Find Nearby Travelers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}