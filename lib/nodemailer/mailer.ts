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
      <div class="brand">WEALTHY STYLE</div>
      <div class="brand-sub">Haute Luxury & Horology Atelier</div>
    </div>
    <div class="content">
      <div class="greeting">Welcome to WEALTHY STYLE, ${fullName || "Honored Guest"}</div>
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
      &copy; ${new Date().getFullYear()} WEALTHY STYLE Luxury. All rights reserved.<br/>
      Need concierge assistance? Contact us at concierge@wealthstyle.luxury
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generates luxury branded HTML email for direct client inquiry notifications
 */
export function generateContactInquiryHtml(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Client Message | WEALTHY STYLE Concierge</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0c0a09;
      color: #fafaf9;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      max-width: 600px;
      margin: 30px auto;
      background: #18181b;
      border: 1px solid #d4af37;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #1c1917 0%, #0c0a09 100%);
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid #27272a;
    }
    .brand {
      color: #d4af37;
      font-size: 22px;
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
      margin-top: 4px;
    }
    .content {
      padding: 32px 28px;
    }
    .alert-pill {
      display: inline-block;
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: #eab308;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 16px;
    }
    .meta-box {
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 12px;
      padding: 18px;
      margin: 18px 0;
    }
    .meta-row {
      margin-bottom: 8px;
      font-size: 13px;
      line-height: 1.5;
    }
    .meta-row:last-child {
      margin-bottom: 0;
    }
    .meta-label {
      color: #a1a1aa;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 1px;
      display: block;
    }
    .meta-value {
      color: #f4f4f5;
      font-weight: 600;
    }
    .message-box {
      background: #0c0a09;
      border-left: 3px solid #d4af37;
      border-radius: 4px 8px 8px 4px;
      padding: 16px;
      margin: 20px 0;
      color: #e4e4e7;
      font-size: 14px;
      line-height: 1.7;
      white-space: pre-wrap;
    }
    .footer {
      background: #09090b;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #27272a;
      font-size: 11px;
      color: #71717a;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand">WEALTHY STYLE</div>
      <div class="brand-sub">Direct Client Concierge Inquiry</div>
    </div>
    <div class="content">
      <div class="alert-pill">New Client Direct Message</div>
      <h2 style="font-size: 18px; color: #ffffff; margin: 0 0 12px 0;">
        Inquiry received from ${data.name}
      </h2>

      <div class="meta-box">
        <div class="meta-row">
          <span class="meta-label">Client Name</span>
          <span class="meta-value">${data.name}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Client Email (Reply-To)</span>
          <span class="meta-value"><a href="mailto:${data.email}" style="color: #eab308; text-decoration: none;">${data.email}</a></span>
        </div>
        ${data.phone ? `
        <div class="meta-row">
          <span class="meta-label">Client Phone / WhatsApp</span>
          <span class="meta-value">${data.phone}</span>
        </div>` : ''}
        ${data.subject ? `
        <div class="meta-row">
          <span class="meta-label">Subject / Topic</span>
          <span class="meta-value">${data.subject}</span>
        </div>` : ''}
      </div>

      <div style="font-size: 12px; font-weight: 700; color: #d4af37; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px;">
        Direct Message Content:
      </div>
      <div class="message-box">${data.message}</div>

      <p style="font-size: 11px; color: #71717a; margin-top: 24px;">
        To respond directly to this client, simply click <strong>Reply</strong> in your email client to email <a href="mailto:${data.email}" style="color: #d4af37;">${data.email}</a>.
      </p>
    </div>
    <div class="footer">
      Delivered to Concierge Inbox: glamstepofficial1@gmail.com<br/>
      &copy; ${new Date().getFullYear()} WEALTHY STYLE Luxury Atelier.
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generates luxury branded HTML email for Password Reset verification
 */
export function generatePasswordResetEmailHtml(
  fullName: string,
  otp: string,
  accountEmail: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your WEALTHY STYLE Password</title>
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
      border: 1px solid #d4af37;
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
      margin-bottom: 24px;
    }
    .otp-container {
      background: #09090b;
      border: 1px solid #eab308;
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
    .account-badge {
      display: inline-block;
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: #f4f4f5;
      font-size: 12px;
      padding: 6px 14px;
      border-radius: 8px;
      margin-bottom: 16px;
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
      <div class="brand">WEALTHY STYLE</div>
      <div class="brand-sub">Client Account Recovery Concierge</div>
    </div>
    <div class="content">
      <div class="greeting">Password Reset Request</div>
      <div class="account-badge">
        Account: <strong>${accountEmail}</strong>
      </div>
      <p class="desc">
        We received a request to reset the password for your WEALTHY STYLE account. Enter the 6-digit recovery passcode below to set a new password:
      </p>
      
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
        <div class="expiry">Valid for 10 minutes. If you did not request this, please ignore this email.</div>
      </div>

      <p class="desc" style="font-size: 12px; color: #71717a; margin-top: 24px;">
        Sent to your verified recovery destination.
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} WEALTHY STYLE Luxury. All rights reserved.<br/>
      Concierge Support: concierge@wealthstyle.luxury
    </div>
  </div>
</body>
</html>
`;
}

