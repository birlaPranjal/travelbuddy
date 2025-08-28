import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/dbConnect';
import Itinerary, { ItineraryData } from '@/app/model/Itinerary';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Connect to database
    await connectToDatabase();
    
    // Get specific itinerary
    const itinerary = await Itinerary.findById(id);
    
    if (!itinerary) {
      return NextResponse.json(
        { success: false, error: 'Itinerary not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, itinerary });
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch itinerary' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const updateData: Partial<ItineraryData> = await request.json();
    
    // Connect to database
    await connectToDatabase();
    
    // Update itinerary
    const itinerary = await Itinerary.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!itinerary) {
      return NextResponse.json(
        { success: false, error: 'Itinerary not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, itinerary });
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update itinerary' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Connect to database
    await connectToDatabase();
    
    // Delete itinerary
    const itinerary = await Itinerary.findByIdAndDelete(id);
    
    if (!itinerary) {
      return NextResponse.json(
        { success: false, error: 'Itinerary not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Itinerary deleted successfully' });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete itinerary' },
      { status: 500 }
    );
  }
} 