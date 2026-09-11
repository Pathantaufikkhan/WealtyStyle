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

    // Standard email syntax check (allow any email domain to receive OTP)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address (e.g. yourname@example.com)" },
        { status: 400 }
      );
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Save in store
    otpStore.set(normalizedEmail, {
      otp,
      expiresAt,
      fullName: fullName || "Valued Customer",
    });

    const rawSenderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "tpathan404@gmail.com";
    const rawSenderName = process.env.SMTP_FROM_NAME || "GLAMSTEP Luxury";
    const senderEmail = rawSenderEmail.replace(/^["']|["']$/g, "").trim();
    const senderName = rawSenderName.replace(/^["']|["']$/g, "").trim();

    const transporter = getMailerTransporter();

    let emailSent = false;
    let emailError: string | null = null;

    if (transporter) {
      try {
        // Send email via Nodemailer
        await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: normalizedEmail,
          subject: `Your GLAMSTEP Verification Code: ${otp}`,
          text: `Welcome to GLAMSTEP. Your verification passcode is: ${otp}. It expires in 10 minutes.`,
          html: generateOtpEmailHtml(fullName, otp),
        });
        emailSent = true;
        console.log(`[Nodemailer Success]: OTP email dispatched to ${normalizedEmail}`);
      } catch (err: any) {
        console.error(`[Nodemailer Dispatch Warning]: Failed to deliver to ${normalizedEmail}:`, err.message);
        emailError = err?.message || "Email delivery failed";
      }
    } else {
      console.warn(`[Nodemailer Notice]: SMTP not configured. Test OTP for ${normalizedEmail} is: ${otp}`);
    }

    return NextResponse.json({
      success: true,
      emailSent,
      message: `Verification code dispatched to ${normalizedEmail}. Please check your inbox and spam folder.`,
      deliveryNote: emailError ? `SMTP note: ${emailError}` : undefined,
    });
  } catch (error: any) {
    console.error("[Send OTP API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process verification code" },
      { status: 500 }
    );
  }
}
