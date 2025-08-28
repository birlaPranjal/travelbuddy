import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/model/User';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'travelbudd';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      // Find user by ID from token
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      // Return user data
      const userData = {
        id: user._id.toString(),
        email: user.email,
        name: user.username || '',
        isVerified: user.isVerified,
        image: user.image,
        age: user.age,
        gender: user.gender,
        about: user.about,
        location: user.location,
        phone: user.phone,
        instagram: user.instagram,
        languages: user.languages || [],
        interests: user.interests || [],
        travelStyles: user.travelStyles || [],
        coordinates: user.coordinates,
      };

      return NextResponse.json({
        success: true,
        data: userData,
      });

    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Mobile profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 