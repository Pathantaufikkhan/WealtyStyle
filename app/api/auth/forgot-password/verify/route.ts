import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "@/lib/nodemailer/mailer";

export async function POST(req: NextRequest) {
  try {
    const { accountEmail, otp } = await req.json();

    if (!accountEmail || !otp) {
      return NextResponse.json(
        { error: "Account email and 6-digit OTP code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = accountEmail.toLowerCase().trim();
    const token = otp.trim();

    const record = otpStore.get(`reset_${normalizedEmail}`);

    if (!record) {
      return NextResponse.json(
        { error: "No active password reset request found. Please request a new code." },
        { status: 400 }
      );
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(`reset_${normalizedEmail}`);
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (record.otp !== token) {
      return NextResponse.json(
        { error: "Invalid verification passcode. Please verify the 6 digits and try again." },
        { status: 400 }
      );
    }

    // Successfully verified, clean up token
    otpStore.delete(`reset_${normalizedEmail}`);

    return NextResponse.json({
      success: true,
      message: "Reset passcode verified successfully.",
    });
  } catch (error: any) {
    console.error("[Password Reset Verify Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify passcode." },
      { status: 500 }
    );
  }
}
