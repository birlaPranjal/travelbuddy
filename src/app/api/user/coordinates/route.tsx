import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/model/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'travelbudd';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get authorization header for mobile app
    const authHeader = request.headers.get('authorization');
    let userId: string;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Mobile app authentication
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.userId;
      } catch (jwtError) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    } else {
      // Web app authentication
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const user = await UserModel.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      userId = user._id.toString();
    }

    // Find user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user's coordinates
    return NextResponse.json({
      message: 'User coordinates fetched successfully',
      coordinates: user.coordinates || null,
    });
  } catch (error) {
    console.error('Error fetching user coordinates:', error);
    return NextResponse.json({ error: 'Failed to fetch user coordinates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const userId = decoded.userId;
      
      // Get coordinates from request body
      const { latitude, longitude } = await request.json();
      
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return NextResponse.json({ 
          error: 'Invalid coordinates. Latitude and longitude must be numbers.' 
        }, { status: 400 });
      }
      
      // Update user coordinates
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { 
          coordinates: { latitude, longitude },
          location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
        },
        { new: true }
      );
      
      if (!updatedUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Coordinates updated successfully',
        coordinates: { latitude, longitude }
      });
      
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
  } catch (error) {
    console.error('Error updating user coordinates:', error);
    return NextResponse.json({ error: 'Failed to update coordinates' }, { status: 500 });
  }
}
