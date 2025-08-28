import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/dbConnect';
import Itinerary, { ItineraryData } from '@/app/model/Itinerary';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Connect to database
    await connectToDatabase();
    
    if (id) {
      // Get specific itinerary
      const itinerary = await Itinerary.findById(id);
      
      if (!itinerary) {
        return NextResponse.json(
          { success: false, error: 'Itinerary not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, itinerary });
    } else {
      // Get all published itineraries
      const isAdmin = searchParams.get('isAdmin') === 'true';
      
      let query = {};
      if (!isAdmin) {
        query = { isPublished: true };
      }
      
      const itineraries = await Itinerary.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, itineraries });
    }
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const itineraryData: ItineraryData = await request.json();
    
    // Connect to database
    await connectToDatabase();
    
    // Create new itinerary
    const itinerary = await Itinerary.create(itineraryData);
    
    return NextResponse.json({ success: true, itinerary });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create itinerary' },
      { status: 500 }
    );
  }
} 