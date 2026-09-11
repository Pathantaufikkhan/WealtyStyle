import { NextRequest, NextResponse } from "next/server";
import { getMailerTransporter, generatePasswordResetEmailHtml, otpStore } from "@/lib/nodemailer/mailer";

export async function POST(req: NextRequest) {
  try {
    const { accountEmail, recoveryEmail, fullName } = await req.json();

    if (!accountEmail || typeof accountEmail !== "string") {
      return NextResponse.json(
        { error: "Account email address is required." },
        { status: 400 }
      );
    }

    const normalizedAccountEmail = accountEmail.toLowerCase().trim();
    const normalizedRecoveryEmail = recoveryEmail
      ? recoveryEmail.toLowerCase().trim()
      : normalizedAccountEmail;

    // Generate secure 6-digit OTP for password reset
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Save reset OTP record mapped to account email
    otpStore.set(`reset_${normalizedAccountEmail}`, {
      otp,
      expiresAt,
      fullName: fullName || "Valued Patron",
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
        await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: normalizedRecoveryEmail,
          subject: `Reset Your Password - Verification Code: ${otp}`,
          text: `A password reset was requested for account ${normalizedAccountEmail}. Your verification code is: ${otp}. It expires in 10 minutes.`,
          html: generatePasswordResetEmailHtml(fullName || "Valued Patron", otp, normalizedAccountEmail),
        });
        emailSent = true;
        console.log(`[Password Reset Success]: Dispatched reset code to ${normalizedRecoveryEmail}`);
      } catch (err: any) {
        console.error(`[Password Reset Warning]: Delivery failed to ${normalizedRecoveryEmail}:`, err.message);
        emailError = err?.message;
      }
    }

    // Mask the recovery email for safe display (e.g. j***e@domain.com)
    const [userPart, domainPart] = normalizedRecoveryEmail.split("@");
    const maskedUser =
      userPart.length > 2
        ? `${userPart[0]}${"*".repeat(Math.min(userPart.length - 2, 4))}${userPart[userPart.length - 1]}`
        : `${userPart[0]}*`;
    const maskedEmail = `${maskedUser}@${domainPart}`;

    return NextResponse.json({
      success: true,
      emailSent,
      maskedEmail,
      message: `Reset passcode sent to ${maskedEmail}. Please check your inbox and spam folder.`,
      deliveryNote: emailError ? `Note: ${emailError}` : undefined,
    });
  } catch (error: any) {
    console.error("[Password Reset API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process password reset request." },
      { status: 500 }
    );
  }
}
