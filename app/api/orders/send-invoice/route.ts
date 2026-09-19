import { NextRequest, NextResponse } from "next/server";
import {
  getMailerTransporter,
  generateOrderTaxInvoiceEmailHtml,
} from "@/lib/nodemailer/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order } = body;

    if (!order || !order.customerEmail) {
      return NextResponse.json(
        { error: "Order details and customer email are required" },
        { status: 400 }
      );
    }

    const transporter = getMailerTransporter();

    if (!transporter) {
      console.warn("SMTP Transporter not configured. Skipping Tax Invoice email.");
      return NextResponse.json({
        success: true,
        message: "Tax Invoice recorded (SMTP not configured in environment)",
      });
    }

    const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "concierge@wealthstyle.luxury";
    const senderName = process.env.SMTP_FROM_NAME || "WEALTHY STYLE Luxury";

    const subject = `GST Tax Invoice & Order Receipt #${order.orderNumber} | WEALTHY STYLE`;
    const htmlContent = generateOrderTaxInvoiceEmailHtml(order);

    await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: order.customerEmail,
      subject,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: `Tax invoice email sent successfully to ${order.customerEmail}`,
    });
  } catch (error: any) {
    console.error("Error sending tax invoice email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send tax invoice email" },
      { status: 500 }
    );
  }
}
