import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import UserModel from '@/app/model/User';
import dbConnect from '@/app/lib/dbConnect';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

interface Coordinates {
  latitude?: string;
  longitude?: string;
}

interface FormData {
  name: string;
  age: string;
  gender: string;
  location: string;
  coordinates?: Coordinates;
  phone: string;
  about: string;
  languages: string[];
  interests: string[];
  image: string;
  instagram: string;
  travelStyles: string[];
}

import { Session as AuthSession } from 'next-auth';

interface Session extends AuthSession {
  user: {
    _id: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    username: string;
    isNewUser?: boolean;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

async function handleUserData(formData: FormData, session: Session) {
  // Ensure coordinates are properly processed
  const lat = parseFloat(formData.coordinates?.latitude ?? '') || 0;
  const lon = parseFloat(formData.coordinates?.longitude ?? '') || 0;

  // Construct the user data object to be saved with new fields
  const userData = {
    name: formData.name,
    age: parseInt(formData.age),
    gender: formData.gender,
    location: formData.location,
    latitude: lat,
    longitude: lon,
    phone: formData.phone,
    about: formData.about,
    languages: formData.languages,
    interests: formData.interests,
    image: formData.image,
    instagram: formData.instagram,
    travelStyles: formData.travelStyles
  };

  console.log("form data is", formData);
  // Update user profile in the database
  const updatedUser = await UserModel.findOneAndUpdate(
    { email: session.user.email },
    {
      ...userData,
      isNewUser: false,
    },
    { new: true }
  );

  // Log the updated user to verify the saved data
  console.log("Updated user data:", updatedUser);

  return updatedUser;
}

// POST route to update the user profile
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const formData = await req.json();
    const updatedUser = await handleUserData(formData, session as Session);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// PUT route to update the user profile
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.json();
    const updatedUser = await handleUserData(formData, session);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// GET route to fetch the user profile
export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
      message: 'Profile fetched successfully',
      user,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}