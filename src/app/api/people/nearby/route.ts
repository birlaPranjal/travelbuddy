import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/model/User';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'travelbudd';

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

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

    const token = authHeader.substring(7);

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      // Get query parameters
      const { searchParams } = new URL(request.url);
      const radius = parseFloat(searchParams.get('radius') || '50'); // Default 50km radius
      const maxResults = parseInt(searchParams.get('limit') || '20'); // Default 20 results
      const latitude = searchParams.get('latitude');
      const longitude = searchParams.get('longitude');
      
      let userLat: number, userLon: number;
      
      // Check if coordinates are provided in query params
      if (latitude && longitude) {
        userLat = parseFloat(latitude);
        userLon = parseFloat(longitude);
      } else {
        // Find current user and get coordinates from profile
        const currentUser = await UserModel.findById(decoded.userId);
        if (!currentUser || !currentUser.coordinates) {
          return NextResponse.json(
            { success: false, error: 'User coordinates not found. Please update your profile with location or provide coordinates in the request.' },
            { status: 400 }
          );
        }
        userLat = parseFloat(currentUser.coordinates.latitude);
        userLon = parseFloat(currentUser.coordinates.longitude);
      }

      // Find nearby users
      const nearbyUsers = await UserModel.find({
        _id: { $ne: decoded.userId }, // Exclude current user
        coordinates: { $exists: true },
        isAcceptingMessages: true,
      });

      // Calculate distances and filter by radius
      const usersWithDistance = nearbyUsers
        .map(user => {
          if (!user.coordinates) return null;
          
          const distance = calculateDistance(
            userLat,
            userLon,
            parseFloat(user.coordinates.latitude),
            parseFloat(user.coordinates.longitude)
          );
          
          return {
            user,
            distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
          };
        })
        .filter((item): item is { user: { _id: string | number; username?: string; email: string; age?: number; gender?: string; about?: string; location?: string; languages?: string[]; interests?: string[]; travelStyles?: string[]; coordinates?: { latitude: string | number; longitude: string | number }; isVerified?: boolean }; distance: number } => item !== null && item.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxResults);

      // Format user data
      const formattedUsers = usersWithDistance.map(({ user, distance }) => ({
        id: user._id.toString(),
        name: user.username || 'Anonymous',
        email: user.email,
        age: user.age,
        gender: user.gender,
        about: user.about,
        location: user.location,
        languages: user.languages || [],
        interests: user.interests || [],
        travelStyles: user.travelStyles || [],
        coordinates: user.coordinates,
        distance: distance,
        isVerified: user.isVerified,
      }));

      return NextResponse.json({
        success: true,
        data: {
          users: formattedUsers,
          total: formattedUsers.length,
          radius: radius,
          userLocation: {
            latitude: userLat,
            longitude: userLon,
          },
        },
      });

    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Nearby people error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 