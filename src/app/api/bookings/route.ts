import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/dbConnect';
import Booking, { BookingData } from '@/app/model/Booking';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Connect to database
    await connectToDatabase();
    
    let query = {};
    if (userId) {
      query = { userId };
    }
    
    // Get bookings
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingData = await request.json();
    
    // Connect to database
    await connectToDatabase();
    
    // Create new booking
    const booking = await Booking.create(bookingData);
    
    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create booking' },
      { status: 500 }
    );
  }
} 