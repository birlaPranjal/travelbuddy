import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import DestinationModel from '@/app/model/Destination';
import UserModel from '@/app/model/User';

interface PostRequestBody {
  email: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
  budgetRange: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    await dbConnect();
    const { email, destination, dateFrom, dateTo, budgetRange }: PostRequestBody = await req.json();

    await DestinationModel.create({
      email,
      searchedDestination: destination,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
      budgetRange,
    });

    const matchingPeople = await UserModel.find({
      $or: [
        { location: destination },
        { searchedDestination: destination },
      ],
      budgetRange: { $lte: budgetRange },
      travelDate: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
    });

    return NextResponse.json({ people: matchingPeople });
  } catch (error) {
    console.error('Error searching for people:', error);
    return NextResponse.json({ error: 'Failed to search for people' }, { status: 500 });
  }
}
