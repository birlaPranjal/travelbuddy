import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";
import VerificationToken from "@/app/model/VerificationToken";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { token } = await req.json();

    const verificationToken = await VerificationToken.findOne({ token });
    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

  
    // Update user verification status
    await UserModel.updateOne(
      { _id: verificationToken.userId },
      { 
        $set: { 
          isVerified: true,
          isNewUser: false
        } 
      }
    );

    // Delete the verification token
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 });
  }
} 