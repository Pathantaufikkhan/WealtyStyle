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

/**
 * Generates luxury branded HTML email for Valued Client Membership Offer (Milestone: 3 Orders)
 */
export function generateMembershipOfferEmailHtml(
  fullName: string,
  orderCount: number
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exclusive Privilege Offer | WEALTHY STYLE Valued Client</title>
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
      box-shadow: 0 25px 50px -12px rgba(212, 175, 55, 0.25);
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
      letter-spacing: 5px;
      font-weight: 800;
      text-transform: uppercase;
      margin: 0;
    }
    .brand-sub {
      color: #a1a1aa;
      font-size: 11px;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .content {
      padding: 36px 30px;
      text-align: center;
    }
    .badge {
      display: inline-block;
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.4);
      color: #eab308;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 6px 16px;
      border-radius: 9999px;
      margin-bottom: 20px;
    }
    .title {
      font-size: 22px;
      color: #ffffff;
      margin: 0 0 14px 0;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .desc {
      color: #d4d4d8;
      font-size: 14px;
      line-height: 1.7;
      margin-bottom: 24px;
      text-align: left;
    }
    .offer-card {
      background: linear-gradient(180deg, #27272a 0%, #18181b 100%);
      border: 1px solid #d4af37;
      border-radius: 14px;
      padding: 24px;
      margin: 24px 0;
      text-align: left;
    }
    .perk-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      font-size: 13px;
      color: #f4f4f5;
    }
    .perk-bullet {
      color: #eab308;
      font-weight: bold;
      margin-right: 10px;
      font-size: 16px;
    }
    .price-tag {
      display: inline-block;
      font-size: 28px;
      font-weight: 900;
      color: #eab308;
      margin-top: 8px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
      color: #09090b !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 14px 32px;
      border-radius: 8px;
      margin-top: 10px;
      box-shadow: 0 10px 15px -3px rgba(212, 175, 55, 0.3);
    }
    .auto-note {
      background: rgba(39, 39, 42, 0.6);
      border: 1px dashed #52525b;
      border-radius: 10px;
      padding: 14px 18px;
      margin-top: 24px;
      font-size: 12px;
      color: #a1a1aa;
      line-height: 1.6;
      text-align: left;
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
      <div class="brand-sub">Haute Luxury Atelier • Executive Membership</div>
    </div>
    <div class="content">
      <div class="badge">Milestone Unlocked: 3 Orders Completed</div>
      <h1 class="title">Exclusive Invitation to Valued Client Membership</h1>
      <p class="desc">
        Dear <strong>${fullName || "Valued Client"}</strong>,<br/><br/>
        Congratulations on completing <strong>${orderCount} orders</strong> with WEALTHY STYLE! In recognition of your patronage, we are pleased to extend a private invitation to acquire our <strong>Valued Client Membership</strong> at an exclusive promotional rate of just <strong>₹110</strong>.
      </p>

      <div class="offer-card">
        <div style="font-size: 11px; font-weight: 700; color: #d4af37; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">
          Exclusive Valued Client Privileges Included:
        </div>
        <div class="perk-item">
          <span class="perk-bullet">✦</span>
          <span><strong>100% Free Doorstep Cash on Delivery (COD)</strong> — No ₹200 advance deposit needed!</span>
        </div>
        <div class="perk-item">
          <span class="perk-bullet">✦</span>
          <span><strong>Priority Air Courier Dispatch</strong> on all your orders across India</span>
        </div>
        <div class="perk-item">
          <span class="perk-bullet">✦</span>
          <span><strong>Direct 24/7 VIP Concierge Support</strong> & early access to new collections</span>
        </div>
        <div class="perk-item" style="margin-bottom: 0;">
          <span class="perk-bullet">✦</span>
          <span><strong>Gold Client Passport Badge</strong> in your profile</span>
        </div>

        <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #3f3f46; display: flex; align-items: baseline; justify-content: space-between;">
          <div>
            <span style="font-size: 10px; text-transform: uppercase; color: #a1a1aa; letter-spacing: 1px; display: block;">Special Privilege Fee</span>
            <span class="price-tag">₹110</span>
          </div>
          <span style="font-size: 11px; color: #34d399; font-weight: 700;">Zero Expiry / Lifetime VIP</span>
        </div>
      </div>

      <div class="auto-note">
        <strong style="color: #eab308;">Prefer not to purchase right now? No worries at all!</strong><br/>
        You can upgrade whenever you wish to get Free COD. Additionally, if you complete <strong>5 orders</strong> in total, our system will automatically elevate your account to <strong>Valued Client Membership 100% FREE</strong> as a complimentary loyalty reward!
      </div>

      <div style="margin-top: 26px;">
        <a href="http://localhost:3000/account" class="btn">View & Claim in Profile</a>
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} WEALTHY STYLE Luxury Atelier. All rights reserved.<br/>
      Need concierge assistance? Contact us at concierge@wealthstyle.luxury
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generates luxury branded HTML email for Automatic Free Valued Client Membership Grant (Milestone: 5 Orders)
 */
export function generateMembershipUnlockedEmailHtml(
  fullName: string,
  orderCount: number
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Congratulations! Valued Client Membership Granted | WEALTHY STYLE</title>
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
      border: 2px solid #d4af37;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 30px 60px -12px rgba(212, 175, 55, 0.35);
    }
    .header {
      background: linear-gradient(135deg, #1c1917 0%, #0c0a09 100%);
      padding: 40px 30px;
      text-align: center;
      border-bottom: 1px solid #27272a;
    }
    .brand {
      color: #d4af37;
      font-size: 26px;
      letter-spacing: 5px;
      font-weight: 900;
      text-transform: uppercase;
      margin: 0;
    }
    .brand-sub {
      color: #a1a1aa;
      font-size: 11px;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .content {
      padding: 38px 32px;
      text-align: center;
    }
    .celebration-pill {
      display: inline-block;
      background: linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(234,179,8,0.3) 100%);
      border: 1px solid #eab308;
      color: #facc15;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 6px 20px;
      border-radius: 9999px;
      margin-bottom: 20px;
    }
    .title {
      font-size: 24px;
      color: #ffffff;
      margin: 0 0 14px 0;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .desc {
      color: #d4d4d8;
      font-size: 14px;
      line-height: 1.7;
      margin-bottom: 24px;
      text-align: left;
    }
    .vip-card {
      background: linear-gradient(135deg, #27272a 0%, #09090b 100%);
      border: 1.5px solid #d4af37;
      border-radius: 16px;
      padding: 26px;
      margin: 24px 0;
      text-align: left;
      position: relative;
    }
    .perk-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      font-size: 13px;
      color: #f4f4f5;
    }
    .perk-bullet {
      color: #eab308;
      font-weight: bold;
      margin-right: 10px;
      font-size: 16px;
    }
    .status-badge {
      display: inline-block;
      background: #10b981;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
      color: #09090b !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 14px 34px;
      border-radius: 8px;
      margin-top: 10px;
      box-shadow: 0 10px 15px -3px rgba(212, 175, 55, 0.3);
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
      <div class="brand-sub">Maison Privée • Valued Client Circle</div>
    </div>
    <div class="content">
      <div class="celebration-pill">🎉 5 Orders Milestone Reached!</div>
      <h1 class="title">You Are Now a Certified Valued Client!</h1>
      <p class="desc">
        Dear <strong>${fullName || "Esteemed Client"}</strong>,<br/><br/>
        We are thrilled to celebrate your <strong>5th completed acquisition</strong> with WEALTHY STYLE! As our highest expression of gratitude for your loyalty, your account has been <strong>automatically elevated to Valued Client Membership 100% Free of Charge</strong>!
      </p>

      <div class="vip-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div>
            <span style="font-size: 10px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px; display: block;">Membership Status</span>
            <strong style="color: #eab308; font-size: 16px; letter-spacing: 1px;">VALUED CLIENT VIP</strong>
          </div>
          <span class="status-badge">ACTIVE & PERMANENT</span>
        </div>

        <div style="font-size: 11px; font-weight: 700; color: #d4af37; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">
          Your Permanent VIP Privileges:
        </div>
        <div class="perk-item">
          <span class="perk-bullet">👑</span>
          <span><strong>100% Free Cash on Delivery (COD)</strong> on every order — Zero advance needed forever!</span>
        </div>
        <div class="perk-item">
          <span class="perk-bullet">👑</span>
          <span><strong>Complimentary Express Priority Shipping</strong> across India</span>
        </div>
        <div class="perk-item">
          <span class="perk-bullet">👑</span>
          <span><strong>Dedicated VIP Concierge Desk</strong> for bespoke requests & support</span>
        </div>
        <div class="perk-item" style="margin-bottom: 0;">
          <span class="perk-bullet">👑</span>
          <span><strong>VIP Gold Passport Badge</strong> prominently featured in your account</span>
        </div>
      </div>

      <p class="desc" style="font-size: 13px; color: #a1a1aa;">
        You can now use 100% Cash on Delivery on your future purchases directly at checkout without paying any advance deposit.
      </p>

      <div style="margin-top: 26px;">
        <a href="http://localhost:3000/account" class="btn">View Your VIP Profile</a>
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} WEALTHY STYLE Luxury Atelier. All rights reserved.<br/>
      Concierge Desk: concierge@wealthstyle.luxury
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generates luxury GST Tax Invoice & Order Receipt HTML email
 */
export function generateOrderTaxInvoiceEmailHtml(order: any): string {
  const taxableAmount = Math.round(order.subtotal / 1.18);
  const totalTax = order.subtotal - taxableAmount;
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;
  const invoiceNumber = `INV-${order.orderNumber}`;
  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    dateStyle: "long",
  });

  const itemsHtml = (order.items || [])
    .map(
      (item: any, idx: number) => `
    <tr style="border-bottom: 1px solid #27272a;">
      <td style="padding: 12px 8px; text-align: center; color: #a1a1aa; font-size: 11px;">${idx + 1}</td>
      <td style="padding: 12px 8px; color: #f4f4f5; font-size: 12px;">
        <strong style="color: #ffffff; font-size: 13px;">${item.productName}</strong><br/>
        <span style="font-size: 10px; color: #a1a1aa; line-height: 1.4; display: inline-block; margin-top: 2px;">HSN: ${item.category === "sunglasses" ? "90041000" : item.category === "watches" ? "91021100" : "64039190"} ${item.selectedColor ? `• Color: ${item.selectedColor}` : ""} ${item.selectedSize ? `• Size: ${item.selectedSize}` : ""}</span>
      </td>
      <td style="padding: 12px 8px; text-align: center; color: #ffffff; font-size: 12px; font-weight: 600;">${item.quantity}</td>
      <td style="padding: 12px 8px; text-align: right; color: #d4d4d8; font-size: 12px;">₹${item.price.toLocaleString("en-IN")}</td>
      <td style="padding: 12px 8px; text-align: right; color: #eab308; font-weight: 700; font-size: 13px;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GST Tax Invoice & Receipt | WEALTHY STYLE</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #09090b;
      color: #fafaf9;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      max-width: 640px;
      margin: 25px auto;
      background: #18181b;
      border: 1px solid #d4af37;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      background: linear-gradient(135deg, #1c1917 0%, #09090b 100%);
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid #27272a;
    }
    .brand {
      color: #d4af37;
      font-size: 24px;
      letter-spacing: 4px;
      font-weight: 900;
      text-transform: uppercase;
      margin: 0;
    }
    .brand-sub {
      color: #a1a1aa;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .content {
      padding: 30px 24px;
    }
    .inv-badge {
      display: inline-block;
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: #eab308;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 20px;
      margin-bottom: 16px;
    }
    .meta-box-table {
      width: 100%;
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 12px;
      margin: 18px 0;
      font-size: 12px;
    }
    .meta-col {
      line-height: 1.6;
      color: #e4e4e7;
      font-size: 12px;
    }
    .meta-label {
      color: #eab308;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      display: block;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .table-container {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12px;
    }
    .table-header th {
      background: #09090b;
      color: #d4af37;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 10px 8px;
      border-bottom: 1px solid #3f3f46;
    }
    .tax-breakdown-table {
      width: 100%;
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 12px;
      margin: 20px 0;
      font-size: 12px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
      color: #09090b !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 12px 28px;
      border-radius: 8px;
      margin-top: 8px;
    }
    .footer {
      background: #09090b;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #27272a;
      font-size: 11px;
      color: #71717a;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand">WEALTHY STYLE</div>
      <div class="brand-sub">Official GST Tax Invoice & Order Receipt</div>
    </div>
    <div class="content">
      <div class="inv-badge">Tax Invoice: ${invoiceNumber}</div>
      <h2 style="font-size: 20px; color: #ffffff; margin: 0 0 8px 0; font-weight: 700;">
        Thank You for Your Acquisition
      </h2>
      <p style="font-size: 13px; color: #d4d4d8; margin: 0 0 16px 0; line-height: 1.6;">
        Dear <strong style="color: #ffffff;">${order.customerName || "Valued Patron"}</strong>, your order <strong style="color: #eab308;">#${order.orderNumber}</strong> has been successfully confirmed. Please find your itemized GST Tax Invoice below:
      </p>

      <!-- Meta Grid Details Table -->
      <table class="meta-box-table" cellpadding="14" cellspacing="0" style="width: 100%; background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; margin: 18px 0; font-size: 12px;">
        <tr>
          <td class="meta-col" style="width: 50%; vertical-align: top; border-right: 1px solid #27272a; padding: 14px; color: #e4e4e7; line-height: 1.7; font-size: 12px;">
            <span class="meta-label" style="color: #eab308; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; display: block; font-weight: 800; margin-bottom: 8px;">Invoice & Order Details</span>
            <span style="color: #a1a1aa; font-size: 12px;">Invoice No:</span> <strong style="color: #ffffff; font-size: 12px;">${invoiceNumber}</strong><br/>
            <span style="color: #a1a1aa; font-size: 12px;">Date:</span> <strong style="color: #ffffff; font-size: 12px;">${invoiceDate}</strong><br/>
            <span style="color: #a1a1aa; font-size: 12px;">Payment Method:</span> <strong style="color: #ffffff; font-size: 12px;">${order.paymentMethod === "Advance_COD" ? "Advance COD" : order.paymentMethod}</strong><br/>
            <span style="color: #a1a1aa; font-size: 12px;">GSTIN:</span> <strong style="color: #ffffff; font-size: 12px;">07AAACW8891P1Z9</strong>
          </td>
          <td class="meta-col" style="width: 50%; vertical-align: top; padding: 14px; color: #e4e4e7; line-height: 1.7; font-size: 12px;">
            <span class="meta-label" style="color: #eab308; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; display: block; font-weight: 800; margin-bottom: 8px;">Billed & Shipped To</span>
            <strong style="color: #ffffff; font-size: 13px; display: block; margin-bottom: 2px;">${order.shippingAddress?.fullName || order.customerName}</strong>
            <span style="color: #d4d4d8; font-size: 12px;">
              ${order.shippingAddress?.houseFlat || ""}${order.shippingAddress?.houseFlat ? ", " : ""}${order.shippingAddress?.street || ""}<br/>
              ${order.shippingAddress?.city || ""}${order.shippingAddress?.city ? ", " : ""}${order.shippingAddress?.state || ""} - ${order.shippingAddress?.pincode || ""}
            </span><br/>
            <span style="color: #a1a1aa; font-size: 12px;">Phone:</span> <strong style="color: #ffffff; font-size: 12px;">${order.customerPhone || order.shippingAddress?.phone || "N/A"}</strong>
          </td>
        </tr>
      </table>

      <!-- Items Table -->
      <table class="table-container" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px;">
        <thead>
          <tr class="table-header">
            <th style="width: 30px; text-align: center; background-color: #09090b; color: #d4af37; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 10px 8px; border-bottom: 1px solid #3f3f46;">#</th>
            <th style="text-align: left; background-color: #09090b; color: #d4af37; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 10px 8px; border-bottom: 1px solid #3f3f46;">Item Description</th>
            <th style="width: 40px; text-align: center; background-color: #09090b; color: #d4af37; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 10px 8px; border-bottom: 1px solid #3f3f46;">Qty</th>
            <th style="width: 80px; text-align: right; background-color: #09090b; color: #d4af37; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 10px 8px; border-bottom: 1px solid #3f3f46;">Unit Price</th>
            <th style="width: 90px; text-align: right; background-color: #09090b; color: #d4af37; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 10px 8px; border-bottom: 1px solid #3f3f46;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Tax Breakdown Table -->
      <table class="tax-breakdown-table" cellpadding="10" cellspacing="0" style="width: 100%; background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; margin: 20px 0; font-size: 12px;">
        <tr>
          <td style="color: #a1a1aa; padding: 8px 12px; font-size: 12px;">Total Taxable Amount:</td>
          <td style="text-align: right; color: #ffffff; font-weight: 700; padding: 8px 12px; font-size: 12px;">₹${taxableAmount.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td style="color: #a1a1aa; padding: 8px 12px; font-size: 12px;">CGST (9.00%):</td>
          <td style="text-align: right; color: #ffffff; font-weight: 700; padding: 8px 12px; font-size: 12px;">₹${cgst.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td style="color: #a1a1aa; padding: 8px 12px; font-size: 12px;">SGST (9.00%):</td>
          <td style="text-align: right; color: #ffffff; font-weight: 700; padding: 8px 12px; font-size: 12px;">₹${sgst.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td style="color: #a1a1aa; padding: 8px 12px; font-size: 12px;">Total Integrated Taxes (18% Included):</td>
          <td style="text-align: right; color: #eab308; font-weight: 700; padding: 8px 12px; font-size: 12px;">₹${totalTax.toLocaleString("en-IN")}</td>
        </tr>
        ${order.discount ? `
        <tr>
          <td style="color: #34d399; padding: 8px 12px; font-size: 12px;">Privilege Discount:</td>
          <td style="text-align: right; color: #34d399; font-weight: 700; padding: 8px 12px; font-size: 12px;">-₹${order.discount.toLocaleString("en-IN")}</td>
        </tr>` : ''}
        <tr>
          <td style="color: #a1a1aa; padding: 8px 12px; font-size: 12px;">Shipping & Climate Care Handling:</td>
          <td style="text-align: right; color: #34d399; font-weight: 700; padding: 8px 12px; font-size: 12px;">${order.shippingCost === 0 ? "FREE (COMPLIMENTARY)" : `₹${order.shippingCost}`}</td>
        </tr>
        <tr style="border-top: 1px solid #3f3f46;">
          <td style="color: #ffffff; font-size: 14px; font-weight: 800; padding: 12px; border-top: 1px solid #3f3f46;">Grand Total (Net Amount):</td>
          <td style="text-align: right; color: #eab308; font-size: 16px; font-weight: 800; padding: 12px; border-top: 1px solid #3f3f46;">₹${order.grandTotal.toLocaleString("en-IN")}</td>
        </tr>
        ${order.advancePaid ? `
        <tr>
          <td style="color: #34d399; padding: 8px 12px; font-size: 12px;">Advance Security Deposit Paid Online:</td>
          <td style="text-align: right; color: #34d399; font-weight: 700; padding: 8px 12px; font-size: 12px;">₹${order.advancePaid.toLocaleString("en-IN")}</td>
        </tr>` : ''}
        ${order.balanceDue ? `
        <tr>
          <td style="color: #fbbf24; font-weight: 700; padding: 8px 12px; font-size: 12px;">Balance Payable on Delivery (Doorstep):</td>
          <td style="text-align: right; color: #fbbf24; font-weight: 700; padding: 8px 12px; font-size: 12px;">₹${order.balanceDue.toLocaleString("en-IN")}</td>
        </tr>` : ''}
      </table>

      <div style="text-align: center; margin: 24px 0 10px 0;">
        <a href="http://localhost:3000/account/orders" class="btn">View & Download Official Invoice</a>
      </div>
    </div>
    <div class="footer">
      WEALTHY STYLE Luxury Atelier • CIN: U18101DL2024PTC392810<br/>
      Need tax or billing assistance? Contact: <a href="mailto:concierge@wealthstyle.luxury" style="color: #d4af37; text-decoration: none;">concierge@wealthstyle.luxury</a><br/>
      &copy; ${new Date().getFullYear()} WEALTHY STYLE Luxury. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generates Order Shipped / Dispatched notification email
 */
export function generateOrderShippedEmailHtml(
  order: any,
  recipientType: "customer" | "admin" = "customer"
): string {
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";
  const itemsHtml = (order.items || [])
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 10px 8px; border-bottom: 1px solid #27272a; color: #ffffff; font-weight: 600;">
          ${item.productName || item.name || "Luxury Item"}
          ${item.selectedSize ? `<span style="font-size: 10px; color: #a1a1aa; display: block;">Size: ${item.selectedSize}</span>` : ""}
          ${item.selectedColor ? `<span style="font-size: 10px; color: #a1a1aa; display: block;">Color: ${item.selectedColor}</span>` : ""}
        </td>
        <td style="text-align: center; padding: 10px 8px; border-bottom: 1px solid #27272a; color: #e4e4e7;">
          ${item.quantity || 1}
        </td>
        <td style="text-align: right; padding: 10px 8px; border-bottom: 1px solid #27272a; color: #d4af37; font-weight: 700;">
          ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  const isAdmin = recipientType === "admin";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isAdmin ? `[Admin Alert] Order #${order.orderNumber} Shipped` : `Your Order #${order.orderNumber} Has Been Shipped!`}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #fafaf9; margin: 0; padding: 0; }
    .wrapper { max-width: 620px; margin: 24px auto; background: #121215; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1c1917 0%, #09090b 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #27272a; }
    .brand { color: #d4af37; font-size: 22px; letter-spacing: 4px; font-weight: 900; text-transform: uppercase; margin: 0; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-top: 12px; }
    .content { padding: 30px 24px; }
    .card { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 18px; margin: 18px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #000000 !important; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3); }
    .footer { text-align: center; padding: 20px; font-size: 11px; color: #71717a; border-top: 1px solid #27272a; background: #0c0a09; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand">WEALTHY STYLE</div>
      <div class="badge">🚀 ORDER DISPATCHED & IN TRANSIT</div>
    </div>
    <div class="content">
      <h2 style="font-size: 20px; color: #ffffff; margin-top: 0;">
        ${isAdmin ? `Admin Alert: Order #${order.orderNumber} Dispatched` : `Great news, ${order.customerName || "Valued Client"}!`}
      </h2>
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
        ${
          isAdmin
            ? `Order <strong>#${order.orderNumber}</strong> for customer <strong>${order.customerName}</strong> (${order.customerEmail}) has been dispatched and handed over to the courier partner.`
            : `Your bespoke acquisition <strong>#${order.orderNumber}</strong> has been carefully inspected, securely packaged in our luxury presentation box, and handed over for express priority transit.`
        }
      </p>

      <div class="card">
        <table style="width: 100%; font-size: 13px;">
          <tr>
            <td style="color: #a1a1aa; padding: 6px 0;">Order Number:</td>
            <td style="text-align: right; color: #ffffff; font-weight: 700; font-family: monospace;">#${order.orderNumber}</td>
          </tr>
          <tr>
            <td style="color: #a1a1aa; padding: 6px 0;">Courier Tracking ID:</td>
            <td style="text-align: right; color: #60a5fa; font-weight: 700; font-family: monospace;">${order.trackingNumber || "BD-" + Math.floor(10000000 + Math.random() * 90000000)}</td>
          </tr>
          <tr>
            <td style="color: #a1a1aa; padding: 6px 0;">Estimated Delivery:</td>
            <td style="text-align: right; color: #34d399; font-weight: 700;">${order.estimatedDelivery || "Within 2-3 Business Days"}</td>
          </tr>
          <tr>
            <td style="color: #a1a1aa; padding: 6px 0;">Delivery Address:</td>
            <td style="text-align: right; color: #e4e4e7;">
              ${order.shippingAddress?.city || "Customer Address"}, ${order.shippingAddress?.state || ""} ${order.shippingAddress?.pincode || ""}
            </td>
          </tr>
        </table>
      </div>

      <h3 style="font-size: 14px; color: #d4af37; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 10px 0;">
        Items in Transit
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="border-bottom: 1px solid #3f3f46; color: #a1a1aa; text-transform: uppercase; font-size: 10px;">
            <th style="text-align: left; padding: 8px 4px;">Item</th>
            <th style="text-align: center; padding: 8px 4px;">Qty</th>
            <th style="text-align: right; padding: 8px 4px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: center; margin: 28px 0 10px 0;">
        <a href="${storeUrl}/account/orders" class="btn">View Live Order Tracking</a>
      </div>
    </div>
    <div class="footer">
      WEALTHY STYLE Luxury Concierge • Need help? <a href="mailto:concierge@wealthstyle.luxury" style="color: #d4af37;">concierge@wealthstyle.luxury</a><br/>
      &copy; ${new Date().getFullYear()} WEALTHY STYLE Luxury. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generates Out for Delivery notification email with interactive "Confirm Delivery" button
 */
export function generateOrderOutForDeliveryEmailHtml(
  order: any,
  confirmDeliveryUrl: string
): string {
  const itemsHtml = (order.items || [])
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 8px 6px; border-bottom: 1px solid #27272a; color: #ffffff; font-weight: 600;">
          ${item.productName || item.name || "Luxury Item"}
        </td>
        <td style="text-align: center; padding: 8px 6px; border-bottom: 1px solid #27272a; color: #e4e4e7;">
          x${item.quantity || 1}
        </td>
        <td style="text-align: right; padding: 8px 6px; border-bottom: 1px solid #27272a; color: #d4af37; font-weight: 700;">
          ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  const isCodOrAdvance = order.paymentMethod === "Advance_COD" || order.paymentMethod === "COD";
  const balanceDue = order.balanceDue || 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚚 Out for Delivery Today: Order #${order.orderNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #fafaf9; margin: 0; padding: 0; }
    .wrapper { max-width: 620px; margin: 24px auto; background: #121215; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1c1917 0%, #09090b 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #27272a; }
    .brand { color: #d4af37; font-size: 22px; letter-spacing: 4px; font-weight: 900; text-transform: uppercase; margin: 0; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; background: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.5); color: #facc15; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-top: 12px; }
    .content { padding: 30px 24px; }
    .card { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 18px; margin: 18px 0; }
    .confirm-box { background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%); border: 2px solid #d4af37; border-radius: 14px; padding: 24px 20px; text-align: center; margin: 24px 0; }
    .confirm-btn { display: inline-block; background: #10b981; color: #ffffff !important; font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 1.5px; padding: 16px 32px; border-radius: 10px; text-decoration: none; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); margin-top: 14px; }
    .footer { text-align: center; padding: 20px; font-size: 11px; color: #71717a; border-top: 1px solid #27272a; background: #0c0a09; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand">WEALTHY STYLE</div>
      <div class="badge">🚚 ARRIVING TODAY: OUT FOR DELIVERY</div>
    </div>
    <div class="content">
      <h2 style="font-size: 20px; color: #ffffff; margin-top: 0; text-align: center;">
        Your Order is Arriving Today!
      </h2>
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; text-align: center;">
        Dear <strong>${order.customerName || "Valued Patron"}</strong>, our courier executive is in your neighborhood and will attempt doorstep delivery today for Order <strong>#${order.orderNumber}</strong>.
      </p>

      ${
        isCodOrAdvance && balanceDue > 0
          ? `
        <div style="background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 10px; padding: 14px; margin: 16px 0; text-align: center;">
          <span style="color: #facc15; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: block;">💵 Doorstep Payment Due</span>
          <strong style="font-size: 22px; color: #ffffff; display: block; margin-top: 4px;">₹${balanceDue.toLocaleString("en-IN")}</strong>
          <span style="color: #a1a1aa; font-size: 11px; display: block; margin-top: 2px;">Please keep cash or UPI QR scanner ready for courier partner.</span>
        </div>
      `
          : `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 12px; margin: 16px 0; text-align: center;">
          <span style="color: #34d399; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">✅ 100% PREPAID • ZERO DOORSTEP PAYMENT REQUIRED</span>
        </div>
      `
      }

      <div class="card">
        <table style="width: 100%; font-size: 13px;">
          <tr>
            <td style="color: #a1a1aa; padding: 6px 0;">Order Ref:</td>
            <td style="text-align: right; color: #ffffff; font-weight: 700; font-family: monospace;">#${order.orderNumber}</td>
          </tr>
          <tr>
            <td style="color: #a1a1aa; padding: 6px 0;">Courier Tracking:</td>
            <td style="text-align: right; color: #60a5fa; font-weight: 700; font-family: monospace;">${order.trackingNumber || "BD-" + Math.floor(10000000 + Math.random() * 90000000)}</td>
          </tr>
          <tr>
            <td style="color: #a1a1aa; padding: 6px 0;">Destination:</td>
            <td style="text-align: right; color: #e4e4e7;">
              ${order.shippingAddress?.houseFlat || ""}, ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""} ${order.shippingAddress?.pincode || ""}
            </td>
          </tr>
        </table>
      </div>

      <!-- Action Confirmation Box for Customer -->
      <div class="confirm-box">
        <div style="font-size: 16px; font-weight: 800; color: #d4af37; text-transform: uppercase; letter-spacing: 1px;">
          📦 Received Your Package?
        </div>
        <p style="color: #d4d4d8; font-size: 13px; margin: 8px auto 0 auto; max-width: 440px; line-height: 1.5;">
          Once the courier delivers your package, please tap the button below to confirm receipt. This will automatically update your order to <strong>Delivered</strong> on our atelier portal.
        </p>
        <div>
          <a href="${confirmDeliveryUrl}" class="confirm-btn">
            ✅ I Received My Parcel
          </a>
        </div>
      </div>

      <h3 style="font-size: 13px; color: #d4af37; text-transform: uppercase; letter-spacing: 1px; margin: 16px 0 8px 0;">
        Package Contents
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>
    <div class="footer">
      WEALTHY STYLE Luxury Concierge • CIN: U18101DL2024PTC392810<br/>
      Need delivery assistance? <a href="mailto:concierge@wealthstyle.luxury" style="color: #d4af37;">concierge@wealthstyle.luxury</a><br/>
      &copy; ${new Date().getFullYear()} WEALTHY STYLE Luxury. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generates Delivery Confirmation notification email
 */
export function generateOrderDeliveredEmailHtml(
  order: any,
  recipientType: "customer" | "admin" = "customer"
): string {
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";
  const isAdmin = recipientType === "admin";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isAdmin ? `[Admin Alert] Order #${order.orderNumber} Confirmed Delivered` : `Order #${order.orderNumber} Delivered Successfully!`}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #fafaf9; margin: 0; padding: 0; }
    .wrapper { max-width: 620px; margin: 24px auto; background: #121215; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1c1917 0%, #09090b 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #27272a; }
    .brand { color: #d4af37; font-size: 22px; letter-spacing: 4px; font-weight: 900; text-transform: uppercase; margin: 0; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-top: 12px; }
    .content { padding: 30px 24px; text-align: center; }
    .btn { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #000000 !important; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3); }
    .footer { text-align: center; padding: 20px; font-size: 11px; color: #71717a; border-top: 1px solid #27272a; background: #0c0a09; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand">WEALTHY STYLE</div>
      <div class="badge">🎉 DELIVERED & CONFIRMED</div>
    </div>
    <div class="content">
      <h2 style="font-size: 22px; color: #ffffff; margin-top: 0;">
        ${isAdmin ? `Order #${order.orderNumber} Confirmed Delivered` : `Parcel Received! Thank You, ${order.customerName || "Valued Client"}`}
      </h2>
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; max-width: 480px; margin: 0 auto 20px auto;">
        ${
          isAdmin
            ? `Customer <strong>${order.customerName}</strong> (${order.customerEmail}) has confirmed receipt of order <strong>#${order.orderNumber}</strong>. Status in database marked as <strong>Delivered</strong>.`
            : `We are delighted that your WEALTHY STYLE acquisition has arrived. We hope your new luxury pieces elevate your daily style with timeless elegance.`
        }
      </p>

      <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 18px; margin: 18px auto; max-width: 480px; text-align: left; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #a1a1aa;">Order Number:</span>
          <strong style="color: #ffffff; font-family: monospace;">#${order.orderNumber}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #a1a1aa;">Customer:</span>
          <strong style="color: #ffffff;">${order.customerName}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #a1a1aa;">Total Value:</span>
          <strong style="color: #d4af37;">₹${(order.grandTotal || 0).toLocaleString("en-IN")}</strong>
        </div>
      </div>

      <div style="margin: 28px 0 10px 0;">
        <a href="${storeUrl}/${isAdmin ? "admin/orders" : "sunglasses"}" class="btn">
          ${isAdmin ? "View Admin Orders Dashboard" : "Explore New Arrivals"}
        </a>
      </div>
    </div>
    <div class="footer">
      WEALTHY STYLE Luxury Atelier • Need assistance? <a href="mailto:concierge@wealthstyle.luxury" style="color: #d4af37;">concierge@wealthstyle.luxury</a><br/>
      &copy; ${new Date().getFullYear()} WEALTHY STYLE Luxury. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
}
