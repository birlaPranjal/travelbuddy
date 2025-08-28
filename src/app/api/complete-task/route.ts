import { NextRequest, NextResponse } from 'next/server';
import { mintUserNFT } from '@/web3/nft';

export async function POST(request: NextRequest) {
  try {
    // For now, we'll use a mock approach since FormData handling is complex in Node.js
    // In a real implementation, you'd use a library like formidable or multer
    const taskId = request.nextUrl.searchParams.get('taskId');
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'TaskId is required as a query parameter' },
        { status: 400 }
      );
    }

    // For demonstration purposes, we'll use a placeholder image URL
    // In a real app, you'd handle the file upload properly
    const imageUrl = 'https://via.placeholder.com/400x300?text=Task+Completed';

    // For demonstration purposes, we'll use a placeholder image URL
    // In a real app, you'd handle the file upload properly

    // For demonstration, we'll use a hardcoded wallet address
    // In a real app, you'd get this from the user's session
    const userWallet = process.env.USER_WALLET_ADDRESS || '0x1234567890123456789012345678901234567890';

    // Mint the NFT
    try {
      const nftResult = await mintUserNFT(userWallet, imageUrl, taskId);
      
      return NextResponse.json({
        success: true,
        imageUrl,
        nftUrl: nftResult.tokenUri,
        transactionHash: nftResult.transactionHash,
        tokenId: nftResult.tokenId,
        taskId: nftResult.taskId
      });
    } catch (error) {
      console.error('NFT minting failed:', error);
      
      return NextResponse.json({
        success: true,
        imageUrl,
        error: 'Image uploaded successfully, but NFT minting failed'
      });
    }
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
} 