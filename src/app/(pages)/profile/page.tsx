"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useWallet } from "@/app/lib/wallet-context";
import { WalletConnect } from "@/app/components/WalletConnect";
import { Spinner } from "@/app/components/Spinner";
import { PageTransition } from "@/app/components/PageTransition";
import { getNFTs, CONTRACT_ADDRESS } from "@/app/lib/contract";
import { getNFTsByOwner, DBNFT } from '@/app/model/NFT';

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

interface BlockchainNFT {
  tokenId: string;
  tokenURI: string;
  taskId: string;
  image?: string;
  name?: string;
  description?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userNFTs, setUserNFTs] = useState<DBNFT[]>([]);
  const [nftsLoading, setNftsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();
  const { isConnected, walletAddress } = useWallet();

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('👤 Starting profile fetch...');
      const session = await getSession();
      if (!session) {
        console.log('❌ No session found, redirecting to login');
        router.push("/api/auth/signin");
        return;
      }
      
      try {
        console.log('📡 Fetching profile data from API...');
        const res = await fetch("/api/user/profile");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (!data.user) {
          throw new Error('No user data returned');
        }
        console.log('✅ Profile data fetched successfully');
        setProfile(data.user);
      } catch (error) {
        console.error('❌ Error fetching profile:', error);
        setProfileError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!walletAddress) {
        setNftsLoading(false);
        return;
      }

      try {
        setNftsLoading(true);
        setError(null);

        // Fetch NFTs from both blockchain and database
        const [blockchainNFTs, dbNFTs] = await Promise.all([
          getNFTs(walletAddress),
          getNFTsByOwner(walletAddress)
        ]);

        if (!blockchainNFTs.success && !dbNFTs.success) {
          throw new Error('Failed to fetch NFTs from both sources');
        }

        if (blockchainNFTs.success && blockchainNFTs.nfts) {
          // Combine and deduplicate NFTs
          const allNFTs = [...(dbNFTs.nfts || [])];
          blockchainNFTs.nfts.forEach((blockchainNFT: BlockchainNFT) => {
            if (!allNFTs.some(dbNFT => dbNFT.tokenId === blockchainNFT.tokenId)) {
              allNFTs.push({
                ...blockchainNFT,
                _id: blockchainNFT.tokenId,
                ownerAddress: walletAddress,
                createdAt: new Date(),
                updatedAt: new Date()
              } as DBNFT);
            }
          });

          setUserNFTs(allNFTs);
        } else if (dbNFTs.success && dbNFTs.nfts) {
          setUserNFTs(dbNFTs.nfts);
        } else {
          setUserNFTs([]);
        }
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError('Failed to load NFTs. Please try again later.');
      } finally {
        setNftsLoading(false);
      }
    };

    fetchNFTs();
  }, [walletAddress]);

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

  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error Loading Profile</h2>
          <p className="mb-8">{profileError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
          >
            Try Again
          </button>
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
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gray-800 rounded-t-2xl p-8 relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500 ring-offset-4 ring-offset-gray-800">
                    {profile.image ? (
                      <div className="relative w-full h-full">
                        <Image 
                          src={profile.image} 
                          alt={profile.name} 
                          fill
                          className="object-cover"
                        />
                      </div>
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

          //edit profile page button
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.push("/update-user")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300"
            >
              Edit Profile
            </button>
          </div>

          {/* Profile Content */}
          <div className="bg-gray-800 rounded-b-2xl shadow-xl overflow-hidden">
            {/* About Section */}
            <div className="p-8 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">About Me</h2>
              <p className="text-gray-300">{profile.about || "No bio added yet"}</p>
            </div>

            {/* NFT Collection Section */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">NFT Collection</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Total NFTs:</span>
                  <span className="text-white font-bold">{userNFTs.length}</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-900/50 rounded-lg">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {nftsLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" color="white" />
                  <span className="ml-3 text-white">Loading your NFTs...</span>
                </div>
              ) : userNFTs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userNFTs.map((nft) => (
                    <motion.div
                      key={nft._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="relative h-48">
                        {nft.metadata?.image && (
                          <Image
                            src={nft.metadata.image}
                            alt={nft.metadata?.name || 'NFT'}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2">{nft.metadata?.name || 'Unnamed NFT'}</h3>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>Token ID: {nft.tokenId}</p>
                          {nft.metadata?.description && <p className="mt-2">{nft.metadata.description}</p>}
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <a
                            href={`https://sepolia.lineascan.build/address/${CONTRACT_ADDRESS}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            View on LineaScan
                          </a>
                          <a
                            href={nft.tokenURI}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-300 text-sm"
                          >
                            View Metadata
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    {isConnected 
                      ? "You haven't minted any NFTs yet. Start your collection!"
                      : "Connect your wallet to view your NFT collection"}
                  </p>
                  {!isConnected && (
                    <div className="mt-4">
                      <WalletConnect />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}