"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { motion } from "framer-motion";

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  about: string;
  location: string;
  languages: string[];
  interests: string[];
  travelStyles: string[];
  image: string;
  phone: string;
  instagram : string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/api/auth/signin");
        return;
      }
      
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center -mt-5">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No Profile Found</h2>
          <p className="mb-8">Let&apos;s create your travel profile!</p>
          <button
            onClick={() => router.push("/update-user")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 -mt-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-t-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500 ring-offset-4 ring-offset-gray-800">
                  {profile.image ? (
                    <img 
                      src={profile.image} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-4xl text-gray-400">
                      {profile.name[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                  <span>📍</span> {profile.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-gray-800 rounded-b-2xl shadow-xl overflow-hidden -mt-6">
          {/* About Section */}
          <div className="p-8 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">About Me</h2>
            <p className="text-gray-300">{profile.about || "No bio added yet"}</p>
          </div>

          {/* Details Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 -mt-4">
            {/* Personal Info */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
              
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Age</p>
                    <p className="text-white">{profile.age} years</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                    ⚤
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Gender</p>
                    <p className="text-white">{profile.gender}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                    📞
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                    📱
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Instagram</p>
                    <p className="text-white">{profile.instagram}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Preferences */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white mb-4">Travel Preferences</h2>
              
              {/* Languages */}
              <div>
                <p className="text-gray-400 mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {profile.languages?.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <p className="text-gray-400 mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {profile.interests?.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Travel Style</p>
                <div className="flex flex-wrap gap-2">
                  {profile.travelStyles?.map((styles, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm"
                    >
                      {styles}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 bg-gray-800/50">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/update-user")}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>✏️</span> Edit Profile
              </button>
              <button
                onClick={() => router.push("/find-people")}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>🔍</span> Find Travel Buddies
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}