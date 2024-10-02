import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import UserModel from '@/app/model/User';
import dbConnect from '@/app/lib/dbConnect';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

async function handleUserData(formData: any, session: any) {
  // Ensure coordinates are properly processed
  const lat = parseFloat(formData.coordinates?.latitude) || 0; // Convert to number
  const lon = parseFloat(formData.coordinates?.longitude) || 0; // Convert to number

  console.log("this is form data ", formData);

  // Construct the user data object to be saved
  const userData = {
    name: formData.name,
    age: parseInt(formData.age as string),
    gender: formData.gender,
    location: formData.location,
    latitude: lat,  // Store latitude as a separate field
    longitude: lon,  // Store longitude as a separate field
    about: formData.about,
    languages: formData.languages,
    interests: formData.interests,
    image: formData.image,
  };

  // Log to verify that coordinates are being passed correctly
  console.log("Coordinates being saved:", { latitude: lat, longitude: lon });

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
    // Connect to the database
    await dbConnect();
    
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authorized
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data from request
    const formData = await req.json();
    
    // Update user data
    const updatedUser = await handleUserData(formData, session);

    // Handle case where the user is not found
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return success response with updated user data
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    // Handle any errors
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
    // Connect to the database
    await dbConnect();
    
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authorized
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data from request
    const formData = await req.json();
    
    // Update user data
    const updatedUser = await handleUserData(formData, session);

    // Handle case where the user is not found
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return success response with updated user data
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    // Handle any errors
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
    // Connect to the database
    await dbConnect();
    
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authorized
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user's profile from the database
    const user = await UserModel.findOne({ email: session.user.email });

    // Handle case where the user is not found
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return success response with the user's profile
    return NextResponse.json({
      message: 'Profile fetched successfully',
      user,
    });
  } catch (error) {
    // Handle any errors
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
