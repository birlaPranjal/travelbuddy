import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mintUserNFT } from '@/web3/nft';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const taskId = formData.get('taskId') as string;

    if (!image || !taskId) {
      return NextResponse.json(
        { error: 'Image and taskId are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // First, try to upload to Cloudinary
    let imageUrl: string;
    try {
      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'travel-tasks',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        
        // Convert buffer to stream for Cloudinary
        const Readable = require('stream').Readable;
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });

      // Set the image URL from Cloudinary
      imageUrl = result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      
      // Fallback: Save to local filesystem
      const fileName = `${Date.now()}-${image.name}`;
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      
      // Ensure the uploads directory exists
      const fs = require('fs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      // Set local URL
      imageUrl = `/uploads/${fileName}`;
    }

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