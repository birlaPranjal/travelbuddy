import mongoose from 'mongoose';
import { NFTMetadata } from '@/app/lib/contract';

export interface NFTData {
  tokenId: string;
  tokenURI: string;
  taskId: string;
  ownerAddress: string;
  metadata?: NFTMetadata;
}

const NFTSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true },
  tokenURI: { type: String, required: true },
  taskId: { type: String, required: true },
  ownerAddress: { type: String, required: true },
  metadata: {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    attributes: [{
      trait_type: { type: String, required: true },
      value: { type: String, required: true }
    }]
  }
}, {
  timestamps: true
});

export interface DBNFT extends NFTData, mongoose.Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Check if the model exists before creating it
let NFT: mongoose.Model<DBNFT>;
try {
  NFT = mongoose.model<DBNFT>('NFT');
} catch {
  NFT = mongoose.model<DBNFT>('NFT', NFTSchema);
}

export default NFT;

export const createNFT = async (nftData: NFTData): Promise<{ success: boolean; nft?: DBNFT; error?: string }> => {
  try {
    // Validate required fields
    if (!nftData.tokenId || !nftData.tokenURI || !nftData.taskId || !nftData.ownerAddress) {
      throw new Error('Missing required NFT data');
    }

    // Validate metadata if present
    if (nftData.metadata) {
      if (!nftData.metadata.name || !nftData.metadata.description || !nftData.metadata.image) {
        throw new Error('Invalid metadata format');
      }
    }

    const response = await fetch('/api/nfts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nftData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating NFT:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create NFT',
    };
  }
};

export const getNFTsByOwner = async (ownerAddress: string): Promise<{ success: boolean; nfts?: DBNFT[]; error?: string }> => {
  try {
    if (!ownerAddress) {
      throw new Error('Owner address is required');
    }

    const response = await fetch(`/api/nfts?ownerAddress=${ownerAddress}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch NFTs',
    };
  }
}; 