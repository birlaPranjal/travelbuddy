import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";
import VerificationToken from "@/app/model/VerificationToken";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/lib/mail";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');

    // Save token to database
    await VerificationToken.create({
      userId: user._id,
      token
    });

    // Send verification email
    const verificationLink = `https://travelbudyy.vercel.app/verify-email?token=${token}`;
    await sendVerificationEmail(email, verificationLink);

    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
} 