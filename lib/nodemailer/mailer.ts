import nodemailer from "nodemailer";

// In-memory OTP storage for fast verification & expiry handling
// (Maps email -> { otp: string, expiresAt: number, fullName: string })
interface OtpRecord {
  otp: string;
  expiresAt: number;
  fullName: string;
}

// Global OTP store to survive hot-reloads in development
const globalForOtp = global as unknown as { otpStore?: Map<string, OtpRecord> };
export const otpStore = globalForOtp.otpStore || new Map<string, OtpRecord>();
if (process.env.NODE_ENV !== "production") globalForOtp.otpStore = otpStore;

/**
 * Creates Nodemailer Transporter using SMTP environment variables
 */
export function getMailerTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_SERVER_PORT || "587", 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_SERVER_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_SERVER_PASSWORD;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Generates luxury branded HTML email for OTP verification
 */
export function generateOtpEmailHtml(fullName: string, otp: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GLAMSTEP Verification Passcode</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0c0a09;
      color: #fafaf9;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      max-width: 580px;
      margin: 30px auto;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #1c1917 0%, #0c0a09 100%);
      padding: 36px 30px;
      text-align: center;
      border-bottom: 1px solid #27272a;
    }
    .brand {
      color: #d4af37;
      font-size: 24px;
      letter-spacing: 4px;
      font-weight: 800;
      text-transform: uppercase;
      margin: 0;
    }
    .brand-sub {
      color: #a1a1aa;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .content {
      padding: 36px 32px;
      text-align: center;
    }
    .greeting {
      font-size: 18px;
      color: #f4f4f5;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .desc {
      color: #a1a1aa;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .otp-container {
      background: #09090b;
      border: 1px solid #3f3f46;
      border-radius: 12px;
      padding: 24px 16px;
      margin: 24px 0;
      text-align: center;
    }
    .otp-code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 36px;
      letter-spacing: 10px;
      color: #eab308;
      font-weight: 800;
      margin: 0;
      display: inline-block;
    }
    .expiry {
      color: #71717a;
      font-size: 12px;
      margin-top: 10px;
    }
    .footer {
      background: #09090b;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #27272a;
      font-size: 12px;
      color: #71717a;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand">GLAMSTEP</div>
      <div class="brand-sub">Maison of Luxury & Horology</div>
    </div>
    <div class="content">
      <div class="greeting">Welcome to GLAMSTEP, ${fullName || "Honored Guest"}</div>
      <p class="desc">
        Please enter the one-time verification passcode (OTP) below to complete your exclusive account registration:
      </p>
      
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
        <div class="expiry">Valid for 10 minutes. Do not share this code with anyone.</div>
      </div>

      <p class="desc" style="font-size: 12px; color: #71717a; margin-top: 24px;">
        If you did not request this registration, please safely ignore this email.
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} GLAMSTEP Luxury. All rights reserved.<br/>
      Need concierge assistance? Contact us at concierge@glamstep.luxury
    </div>
  </div>
</body>
</html>
`;
}
