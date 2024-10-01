// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import UserModel from '@/app/model/User';
import dbConnect from '@/app/lib/dbConnect';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.json(); // Use JSON instead of formData
    const userData = {
      name: formData.name,
      age: parseInt(formData.age as string),
      gender: formData.gender,
      location: formData.location, // This will now contain both coordinates and area name
      about: formData.about,
      languages: formData.languages,
      interests: formData.interests,
      image: formData.image // Use the image URL from the form data
    };

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      {
        ...userData,
        isNewUser: false,
      },
      { new: true }
    );

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

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    console.log(session);
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

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.json(); // Use JSON instead of formData
    const userData = {
      name: formData.name,
      age: parseInt(formData.age as string),
      gender: formData.gender,
      location: formData.location, // This will now contain both coordinates and area name
      about: formData.about,
      languages: formData.languages,
      interests: formData.interests,
      image: formData.image // Use the image URL from the form data
    };

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      {
        ...userData,
        isNewUser: false,
      },
      { new: true }
    );

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
