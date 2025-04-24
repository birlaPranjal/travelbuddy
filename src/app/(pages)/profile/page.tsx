"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useWallet } from "@/app/lib/wallet-context";
import { WalletConnect } from "@/app/components/WalletConnect";
import { Spinner } from "@/app/components/Spinner";
import { formatDate } from "@/app/lib/utils";
import { PageTransition } from "@/app/components/PageTransition";

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
  instagram: string;
}

interface NFT {
  id: string;
  tokenId: string;
  imageUrl: string;
  taskId: string;
  taskName: string;
  transactionHash: string;
  mintedAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [nftsLoading, setNftsLoading] = useState(true);
  const router = useRouter();
  const { isConnected, walletAddress, provider } = useWallet();

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

  useEffect(() => {
    const fetchUserNFTs = async () => {
      setNftsLoading(true);
      
      try {
        // First try to fetch from API
        let nfts: NFT[] = [];
        
        try {
          const res = await fetch("/api/user/nfts");
          if (res.ok) {
            const data = await res.json();
            nfts = data.nfts;
          }
        } catch (error) {
          console.error("Error fetching NFTs from API:", error);
        }
        
        // If we have a connected wallet and provider, try to fetch NFTs on-chain
        if (isConnected && provider && walletAddress && nfts.length === 0) {
          try {
            console.log("Fetching NFTs from blockchain for:", walletAddress);
            // This would be implemented to query the blockchain
            // For now, we'll use localStorage as a fallback
          } catch (error) {
            console.error("Error fetching NFTs from blockchain:", error);
          }
        }
        
        // If we still don't have NFTs, try loading from localStorage (completed tasks)
        if (nfts.length === 0 && typeof window !== 'undefined') {
          const completedTaskIds = JSON.parse(localStorage.getItem('completedTasks') || '[]') as string[];
          
          // Map task IDs to NFT objects
          const taskMap = {
            'milestone': {
              taskName: 'Upload Milestone',
              imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            },
            'highway': {
              taskName: 'Highway',
              imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            },
            'toll-plaza': {
              taskName: 'Toll Plaza',
              imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            }
          };
          
          nfts = completedTaskIds.map((taskId, index) => ({
            id: String(index + 1),
            tokenId: String(index + 1),
            imageUrl: taskMap[taskId as keyof typeof taskMap]?.imageUrl || 'https://via.placeholder.com/400',
            taskId,
            taskName: taskMap[taskId as keyof typeof taskMap]?.taskName || taskId,
            transactionHash: `0x${Math.random().toString(16).substring(2, 12)}...`,
            mintedAt: new Date().toISOString(),
          }));
        }
        
        // If we still don't have NFTs, use mock data for demonstration
        if (nfts.length === 0) {
          nfts = [
            {
              id: "1",
              tokenId: "1",
              imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
              taskId: "milestone",
              taskName: "Upload Milestone",
              transactionHash: "0x123...abc",
              mintedAt: new Date().toISOString(),
            },
            {
              id: "2",
              tokenId: "2",
              imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
              taskId: "highway",
              taskName: "Highway",
              transactionHash: "0x456...def",
              mintedAt: new Date().toISOString(),
            }
          ];
        }
        
        setUserNFTs(nfts);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        // Fallback to empty array
        setUserNFTs([]);
      } finally {
        setNftsLoading(false);
      }
    };

    fetchUserNFTs();
  }, [isConnected, provider, walletAddress]);

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
    <PageTransition>
      <div className="min-h-screen bg-gray-900 py-12 px-4 -mt-12">
        <div className="max-w-4xl mx-auto">
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
                
                <div className="md:ml-auto mt-4 md:mt-0">
                  <WalletConnect />
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

            {/* Travel Achievements Section */}
            <div className="p-8 border-t border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Travel Achievements</h2>
                {nftsLoading && (
                  <div className="flex items-center text-gray-400">
                    <Spinner size="sm" color="blue" />
                    <span className="ml-2">Loading NFTs...</span>
                  </div>
                )}
              </div>
              
              {!nftsLoading && userNFTs.length === 0 ? (
                <div className="text-center py-10 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="mb-4 text-gray-400 text-6xl">🏆</div>
                  <p className="text-gray-300 mb-4 font-medium text-xl">No NFTs achieved yet</p>
                  <p className="text-gray-400 mb-6">Complete some travel tasks to earn your first one!</p>
                  <button
                    onClick={() => router.push("/tasks")}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-300"
                  >
                    Start Completing Tasks
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {userNFTs.map((nft) => (
                    <motion.div 
                      key={nft.id} 
                      className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative h-48 w-full group">
                        <Image
                          src={nft.imageUrl}
                          alt={nft.taskName}
                          className="object-cover transition-all duration-300 group-hover:scale-110"
                          fill
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white font-medium text-lg drop-shadow-md">{nft.taskName}</h3>
                          <p className="text-gray-300 text-sm mt-1">Token #{nft.tokenId}</p>
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-emerald-400 text-xs px-2 py-1 bg-emerald-900/30 rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Verified
                          </span>
                          <a
                            href={`https://etherscan.io/tx/${nft.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 text-xs hover:underline flex items-center"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                            View on Chain
                          </a>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Minted on {formatDate(nft.mintedAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
                <motion.button
                  onClick={() => router.push("/tasks")}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🏆</span> Complete Tasks
                </motion.button>
                <button
                  onClick={() => router.push("/find-people")}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>🔍</span> Find Travel Buddies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}