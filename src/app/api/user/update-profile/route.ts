import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/dbConnect';
import UserModel from '@/app/model/User';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'travelbudd';

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Find user by ID from token
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      // Get update data from request body
      const updateData = await request.json();
      
      // Validate required fields
      if (!updateData.name) {
        return NextResponse.json(
          { success: false, error: 'Name is required' },
          { status: 400 }
        );
      }

      // Update user profile
      const updatedUser = await UserModel.findByIdAndUpdate(
        decoded.userId,
        {
          username: updateData.name,
          age: updateData.age,
          gender: updateData.gender,
          about: updateData.about,
          location: updateData.location,
          phone: updateData.phone,
          instagram: updateData.instagram,
          languages: updateData.languages || [],
          interests: updateData.interests || [],
          travelStyles: updateData.travelStyles || [],
          coordinates: updateData.coordinates,
        },
        { new: true }
      );

      // Return updated user data
      const userData = {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        name: updatedUser.username || '',
        isVerified: updatedUser.isVerified,
        image: updatedUser.image,
        age: updatedUser.age,
        gender: updatedUser.gender,
        about: updatedUser.about,
        location: updatedUser.location,
        phone: updatedUser.phone,
        instagram: updatedUser.instagram,
        languages: updatedUser.languages || [],
        interests: updatedUser.interests || [],
        travelStyles: updatedUser.travelStyles || [],
        coordinates: updatedUser.coordinates,
      };

      return NextResponse.json({
        success: true,
        data: userData,
        message: 'Profile updated successfully',
      });

    } catch (jwtError) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 