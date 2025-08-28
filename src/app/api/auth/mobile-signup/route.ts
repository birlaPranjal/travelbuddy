import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/model/User';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'travelbudd';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await UserModel.create({
      username: name,
      email,
      password: hashedPassword,
      isVerified: false,
      isAcceptingMessages: true,
      isNewUser: true,
    });

    // Create JWT token
    const token = jwt.sign(
      {
        userId: newUser._id.toString(),
        email: newUser.email,
        isVerified: newUser.isVerified,
        isAcceptingMessages: newUser.isAcceptingMessages,
        username: newUser.username,
        isNewUser: newUser.isNewUser,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    const userData = {
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.username || '',
      isVerified: newUser.isVerified,
      image: newUser.image,
      age: newUser.age,
      gender: newUser.gender,
      about: newUser.about,
      location: newUser.location,
      phone: newUser.phone,
      instagram: newUser.instagram,
      languages: newUser.languages || [],
      interests: newUser.interests || [],
      travelStyles: newUser.travelStyles || [],
      coordinates: newUser.coordinates,
    };

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        token: token,
      },
    });

  } catch (error) {
    console.error('Mobile signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 