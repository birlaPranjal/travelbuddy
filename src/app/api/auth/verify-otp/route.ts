import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";
import OTP from "@/app/model/OTP";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, otp, newPassword, isPasswordReset } = await req.json();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otpRecord = await OTP.findOne({ 
      userId: user._id,
      otp
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id });
    
    // If this is a password reset request
    if (isPasswordReset && newPassword) {
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update user password
      await UserModel.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );
      
      return NextResponse.json({ message: "Password reset successful" });
    }
    
    // If this is just email verification
    await UserModel.updateOne(
      { _id: user._id },
      { 
        $set: { 
          isVerified: true,
          isNewUser: false
        } 
      }
    );

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
} 