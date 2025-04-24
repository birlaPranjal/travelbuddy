import { NextResponse } from 'next/server';
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";
import OTP from "@/app/model/OTP";
import { sendPasswordResetOTPEmail } from "@/app/lib/mail";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this user
    await OTP.deleteMany({ userId: user._id });

    // Save new OTP
    await OTP.create({
      userId: user._id,
      otp
    });

    // Send OTP email
    await sendPasswordResetOTPEmail(email, otp);

    return NextResponse.json(
      { message: 'Password reset OTP sent to your email' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
} 