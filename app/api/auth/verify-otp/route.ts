import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "@/lib/nodemailer/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, fullName, phone } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and 6-digit OTP are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const token = otp.toString().trim();

    const record = otpStore.get(normalizedEmail);

    if (!record) {
      return NextResponse.json(
        { error: "No OTP was requested for this email or it has expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedEmail);
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (record.otp !== token) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // OTP is valid - consume it
    otpStore.delete(normalizedEmail);

    const user = {
      id: `usr-${Date.now()}`,
      email: normalizedEmail,
      fullName: fullName || record.fullName || "Valued Customer",
      phone: phone || "",
      role: "customer",
      savedAddresses: [],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Account verified successfully",
      user,
    });
  } catch (error: any) {
    console.error("[Verify OTP Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Verification failed" },
      { status: 500 }
    );
  }
}
