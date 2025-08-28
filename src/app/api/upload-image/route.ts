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

// Configure Cloudinary (this will be attempted only if credentials are provided)
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (error) {
  console.warn('Cloudinary configuration failed:', error);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get the file from form data - support both 'file' and 'image' field names
    const file = formData.get('file') || formData.get('image');
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file uploaded or invalid file' },
        { status: 400 }
      );
    }

    // Get the folder from form data or use default
    const folder = (formData.get('folder') as string) || 'travel-buddy';

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Local file storage is always the primary method in development
    // In production, we'll try Cloudinary first if configured
    let imageUrl: string;
    const isLocalStoragePrimary = process.env.NODE_ENV === 'development' || 
                                  !process.env.CLOUDINARY_CLOUD_NAME;

    if (isLocalStoragePrimary) {
      // Local storage path
      imageUrl = await storeFileLocally(file, buffer);
    } else {
      // Try Cloudinary with fallback to local storage
      try {
        imageUrl = await uploadToCloudinary(buffer, folder);
        console.log('Successfully uploaded to Cloudinary:', imageUrl);
      } catch (error) {
        console.error('Cloudinary upload failed, falling back to local storage:', error);
        imageUrl = await storeFileLocally(file, buffer);
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Uploads a file to Cloudinary
 */
async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  // Check if Cloudinary credentials are configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials not configured');
  }
  
  // Upload to Cloudinary
  const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
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

  return result.secure_url;
}

/**
 * Stores a file locally in the public/uploads directory
 */
async function storeFileLocally(file: File, buffer: Buffer): Promise<string> {
  // Sanitize filename to prevent path traversal attacks
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${Date.now()}-${sanitizedName}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  
  // Ensure the uploads directory exists
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  
  const filePath = join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  
  // Return public URL
  const imageUrl = `/uploads/${fileName}`;
  console.log('File stored locally:', imageUrl);
  return imageUrl;
} 