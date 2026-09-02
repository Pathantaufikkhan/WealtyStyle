import { NextRequest, NextResponse } from "next/server";
import { getMailerTransporter, generateOtpEmailHtml, otpStore } from "@/lib/nodemailer/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email, fullName } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Save in store
    otpStore.set(normalizedEmail, {
      otp,
      expiresAt,
      fullName: fullName || "Valued Customer",
    });

    const transporter = getMailerTransporter();

    if (!transporter) {
      // If SMTP is not yet configured in .env.local, provide demo fallback
      console.warn(
        `[Nodemailer Notice]: SMTP configuration missing. Demo OTP for ${normalizedEmail} is: ${otp}`
      );
      return NextResponse.json({
        success: true,
        isDemo: true,
        demoOtp: otp,
        message:
          "SMTP credentials not configured in .env.local. Demo OTP generated for instant testing.",
      });
    }

    const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "concierge@glamstep.luxury";
    const senderName = process.env.SMTP_FROM_NAME || "GLAMSTEP Luxury";

    // Send email via Nodemailer
    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: normalizedEmail,
      subject: `Your GLAMSTEP Verification Code: ${otp}`,
      text: `Welcome to GLAMSTEP. Your verification passcode is: ${otp}. It expires in 10 minutes.`,
      html: generateOtpEmailHtml(fullName, otp),
    });

    return NextResponse.json({
      success: true,
      isDemo: false,
      message: `Verification code sent to ${normalizedEmail}`,
    });
  } catch (error: any) {
    console.error("[Nodemailer Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to dispatch verification email via Nodemailer" },
      { status: 500 }
    );
  }
}
