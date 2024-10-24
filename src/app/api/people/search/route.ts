import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import DestinationModel from '@/app/model/Destination';
import UserModel from '@/app/model/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, destination, travelDate } = await req.json(); // Include travelDate

    // Save the destination search with the travel date
    await DestinationModel.create({
      email,
      searchedDestination: destination,
      travelDate: new Date(travelDate),  // Convert to Date object
    });

    // Find people who live in the destination or have searched for it
    const matchingPeople = await UserModel.find({
      $or: [
        { location: destination },  // People who live at the destination
        { searchedDestination: destination },  // People who searched for the destination
      ],
    });

    return NextResponse.json({ people: matchingPeople });
  } catch (error) {
    console.error('Error searching for people:', error);
    return NextResponse.json({ error: 'Failed to search for people' }, { status: 500 });
  }
}
