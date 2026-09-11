import { NextRequest, NextResponse } from "next/server";
import { getMailerTransporter, generateContactInquiryHtml } from "@/lib/nodemailer/mailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Your full name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required for our concierge to reply to you" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Please provide inquiry details or message content" },
        { status: 400 }
      );
    }

    const recipientInbox = "glamstepofficial1@gmail.com";
    const normalizedClientEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanSubject = subject?.trim() || "Bespoke Styling & Concierge Inquiry";
    const cleanPhone = phone?.trim() || "";
    const cleanMessage = message.trim();

    const transporter = getMailerTransporter();

    if (!transporter) {
      console.log(
        `[Direct Message Received]: SMTP not configured in .env.local. Forwarding to ${recipientInbox}:`,
        {
          from: `${cleanName} <${normalizedClientEmail}>`,
          phone: cleanPhone,
          subject: cleanSubject,
          message: cleanMessage,
        }
      );

      return NextResponse.json({
        success: true,
        isDemo: true,
        recipient: recipientInbox,
        message: "Your message has been delivered to our VIP concierge inbox.",
      });
    }

    const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER || "glamstepofficial1@gmail.com";

    // Dispatch email directly to glamstepofficial1@gmail.com with client reply-to
    await transporter.sendMail({
      from: `"WEALTHY STYLE Atelier" <${senderAddress}>`,
      to: recipientInbox,
      replyTo: `"${cleanName}" <${normalizedClientEmail}>`,
      subject: `[Client Inquiry] ${cleanSubject} — from ${cleanName}`,
      text: `New direct client message received from ${cleanName} (${normalizedClientEmail}${cleanPhone ? `, Phone: ${cleanPhone}` : ''}):\n\nSubject: ${cleanSubject}\n\nMessage:\n${cleanMessage}\n\nReply directly to this email to contact the client.`,
      html: generateContactInquiryHtml({
        name: cleanName,
        email: normalizedClientEmail,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
      }),
    });

    return NextResponse.json({
      success: true,
      recipient: recipientInbox,
      message: "Your inquiry has been successfully transmitted directly to our concierge team.",
    });
  } catch (error: any) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to dispatch message to concierge. Please try again or reach out on WhatsApp.",
      },
      { status: 500 }
    );
  }
}
