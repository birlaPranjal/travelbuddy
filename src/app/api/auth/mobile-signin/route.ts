import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/model/User';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'travelbudd';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        isVerified: user.isVerified,
        isAcceptingMessages: user.isAcceptingMessages,
        username: user.username,
        isNewUser: user.isNewUser,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.username || '',
      isVerified: user.isVerified,
      image: user.image,
      age: user.age,
      gender: user.gender,
      about: user.about,
      location: user.location,
      phone: user.phone,
      instagram: user.instagram,
      languages: user.languages || [],
      interests: user.interests || [],
      travelStyles: user.travelStyles || [],
      coordinates: user.coordinates,
    };

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        token: token,
      },
    });

  } catch (error) {
    console.error('Mobile signin error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 