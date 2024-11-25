"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";
import { motion } from "framer-motion";

const travelFeatures = [
  {
    icon: "🌏",
    title: "Global Community",
    description: "Connect with travelers from over 190+ countries"
  },
  {
    icon: "🤝",
    title: "Verified Profiles",
    description: "Safe and secure community of genuine travelers"
  },
  {
    icon: "✈️",
    title: "Trip Planning",
    description: "Create and share itineraries with travel buddies"
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    location: "Singapore",
    image: "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg",
    text: "Found amazing travel companions for my backpacking trip across India!"
  },
  {
    name: "Mike Rodriguez",
    location: "Spain",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    text: "Met lifetime friends through this platform. Unforgettable experiences!"
  }
];

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
        const session = await fetch('/api/auth/session');
        const sessionData = await session.json();
        
        if (!sessionData?.user?.isVerified) {
          // Send verification email
          await fetch('/api/auth/send-verification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
          
          router.push('/verify-email');
        } else {
          router.push('/profile');
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
    <div className="min-h-screen bg-gray-900 -mt-28">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg"
            alt="Travel Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-900"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Your Journey Begins Here
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
              Join thousands of travelers connecting, sharing experiences, and exploring together
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sign In Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 text-white p-8 rounded-3xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back, Explorer!</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium  mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border text-black border-gray-300 transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium  mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 space-y-4">
              <button
                onClick={() => handleOAuthSignIn('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300"
              >
                <FcGoogle className="text-2xl mr-3"/>
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>

              <button
                onClick={() => handleOAuthSignIn('github')}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300"
              >
                <IoLogoGithub className="text-2xl mr-3 text-black"/>
                <span className="text-gray-700 font-medium">Continue with Github</span>
              </button>
            </div>
          </motion.div>

          {/* Features & Testimonials */}
          <div className="space-y-8">
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {travelFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 p-6 rounded-2xl"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-gray-800 p-6 rounded-2xl flex items-center gap-4"
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-yellow-400 text-sm mb-1">★★★★★</div>
                    <p className="text-gray-300 mb-2">{testimonial.text}</p>
                    <div className="text-sm">
                      <span className="text-white font-medium">{testimonial.name}</span>
                      <span className="text-gray-400"> • {testimonial.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-1">50K+</div>
                  <div className="text-gray-400">Active Travelers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-1">190+</div>
                  <div className="text-gray-400">Countries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-1">100K+</div>
                  <div className="text-gray-400">Connections Made</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of passionate travelers and explore the world together
          </p>
          <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-all duration-300">
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
}