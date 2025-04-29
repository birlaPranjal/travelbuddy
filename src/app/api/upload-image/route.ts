import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { Readable } from 'stream';
import { mkdirSync, existsSync } from 'fs';

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
}

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

    // Try to upload to Cloudinary
    let imageUrl: string;
    try {
      // Upload to Cloudinary
      const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'travel-tasks',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result as CloudinaryResponse);
            } else {
              reject(new Error('No result from Cloudinary'));
            }
          }
        );
        
        // Convert buffer to stream for Cloudinary
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
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      // Set local URL
      imageUrl = `/uploads/${fileName}`;
    }

    return NextResponse.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
} 