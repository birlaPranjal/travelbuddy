import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/dbConnect';
import NFT, { NFTData } from '@/app/model/NFT';
import { getNFTs } from '@/app/lib/contract';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerAddress = searchParams.get('ownerAddress');

    if (!ownerAddress) {
      return NextResponse.json(
        { success: false, error: 'Owner address is required' },
        { status: 400 }
      );
    }

    // First try to get NFTs from the blockchain
    const blockchainNFTs = await getNFTs(ownerAddress);
    
    // Connect to database
    await connectToDatabase();
    
    // Get NFTs from database
    const dbNFTs = await NFT.find({ ownerAddress }).lean();

    // Combine and deduplicate NFTs
    const allNFTs = [...(blockchainNFTs.nfts || [])];
    for (const dbNFT of dbNFTs) {
      if (!allNFTs.some(nft => nft.tokenId === dbNFT.tokenId)) {
        allNFTs.push(dbNFT);
      }
    }

    return NextResponse.json({ success: true, nfts: allNFTs });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const nftData: NFTData = await request.json();

    // Validate required fields
    if (!nftData.tokenId || !nftData.tokenURI || !nftData.taskId || !nftData.ownerAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required NFT data' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if NFT already exists
    const existingNFT = await NFT.findOne({ tokenId: nftData.tokenId });
    if (existingNFT) {
      return NextResponse.json(
        { success: false, error: 'NFT already exists' },
        { status: 409 }
      );
    }

    // Create new NFT
    const nft = await NFT.create(nftData);

    return NextResponse.json({ success: true, nft });
  } catch (error) {
    console.error('Error creating NFT:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create NFT' },
      { status: 500 }
    );
  }
} 