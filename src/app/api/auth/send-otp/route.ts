import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";
import OTP from "@/app/model/OTP";
import { sendOTPEmail } from "@/app/lib/mail";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
    await sendOTPEmail(email, otp);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
} 