// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/model/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in.' },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    await dbConnect();
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user._id,
      {
        name: data.name,
        age: data.age,
        gender: data.gender,
        location: data.location,
        about: data.about,
        languages: data.languages,
        interests: data.interests,
        image: data.image,
      },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}