import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/dbConnect';
import Booking from '@/app/model/Booking';

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get all bookings with itinerary data populated
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch all bookings' },
      { status: 500 }
    );
  }
} 