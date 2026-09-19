import { NextRequest, NextResponse } from "next/server";
import {
  getMailerTransporter,
  generateMembershipOfferEmailHtml,
  generateMembershipUnlockedEmailHtml,
} from "@/lib/nodemailer/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, fullName, milestone, orderCount } = body;

    if (!email || !milestone) {
      return NextResponse.json(
        { error: "Email and milestone are required" },
        { status: 400 }
      );
    }

    const transporter = getMailerTransporter();

    if (!transporter) {
      console.warn("SMTP Transporter not configured. Skipping email delivery.");
      return NextResponse.json({
        success: true,
        message: "Membership milestone recorded (SMTP not configured in environment)",
      });
    }

    let subject = "";
    let htmlContent = "";

    if (milestone === "offer_3_orders") {
      subject = "Exclusive Invitation: Unlock Valued Client Membership (Special ₹110 Privilege)";
      htmlContent = generateMembershipOfferEmailHtml(fullName || "Valued Client", orderCount || 3);
    } else if (milestone === "auto_5_orders") {
      subject = "🎉 Congratulations! You have unlocked Valued Client Membership (Free Lifetime Access)";
      htmlContent = generateMembershipUnlockedEmailHtml(fullName || "Valued Client", orderCount || 5);
    } else {
      return NextResponse.json(
        { error: "Invalid milestone" },
        { status: 400 }
      );
    }

    const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "concierge@wealthstyle.luxury";
    const senderName = process.env.SMTP_FROM_NAME || "WEALTHY STYLE Luxury";

    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: email,
      subject,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: `Membership email for milestone '${milestone}' sent successfully to ${email}`,
    });
  } catch (error: any) {
    console.error("Error sending membership notification email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send membership email" },
      { status: 500 }
    );
  }
}
