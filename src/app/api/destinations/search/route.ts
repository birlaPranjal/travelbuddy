import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/dbConnect';
import DestinationModel from '@/app/model/Destination';

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

    try {
      // Verify JWT token
      jwt.verify(authHeader.substring(7), JWT_SECRET);
      
      // Get query parameters
      const { searchParams } = new URL(request.url);
      const query = searchParams.get('q') || '';
      const category = searchParams.get('category') || '';
      const country = searchParams.get('country') || '';
      const maxResults = parseInt(searchParams.get('limit') || '20');
      
      // Build search query
      const searchQuery: Record<string, unknown> = {};
      
      if (query) {
        searchQuery.$or = [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { country: { $regex: query, $options: 'i' } },
          { city: { $regex: query, $options: 'i' } },
        ];
      }
      
      if (category) {
        searchQuery.category = { $regex: category, $options: 'i' };
      }
      
      if (country) {
        searchQuery.country = { $regex: country, $options: 'i' };
      }
      
      // Find destinations
      const destinations = await DestinationModel.find(searchQuery)
        .limit(maxResults)
        .sort({ rating: -1, name: 1 });

      // Format destination data
      const formattedDestinations = destinations.map(dest => ({
        id: dest._id.toString(),
        name: dest.name,
        description: dest.description,
        country: dest.country,
        city: dest.city,
        category: dest.category,
        rating: dest.rating,
        image: dest.image,
        coordinates: dest.coordinates,
        bestTimeToVisit: dest.bestTimeToVisit,
        averageCost: dest.averageCost,
        currency: dest.currency,
        language: dest.language,
        timezone: dest.timezone,
      }));

      return NextResponse.json({
        success: true,
        data: {
          destinations: formattedDestinations,
          total: formattedDestinations.length,
          query: query,
          category: category,
          country: country,
        },
      });

    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Destination search error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 