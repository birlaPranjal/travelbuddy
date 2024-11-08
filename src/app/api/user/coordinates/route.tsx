import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/model/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by email
    const user = await UserModel.findOne({ email: session.user.email });
    console.log(user);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user's coordinates
    return NextResponse.json({
      message: 'User coordinates fetched successfully',
      coordinates : {
        latitude: user.latitude,
        longitude: user.longitude,
      },
    });
  } catch (error) {
    console.error('Error fetching user coordinates:', error);
    return NextResponse.json({ error: 'Failed to fetch user coordinates' }, { status: 500 });
  }
}
