import { NextRequest, NextResponse } from "next/server";
import {
  getMailerTransporter,
  generateOrderShippedEmailHtml,
  generateOrderOutForDeliveryEmailHtml,
  generateOrderDeliveredEmailHtml,
} from "@/lib/nodemailer/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order, status, orderNumber, orderId } = body;

    if (!order || (!order.orderNumber && !orderNumber)) {
      return NextResponse.json(
        { error: "Order details are required" },
        { status: 400 }
      );
    }

    const targetOrder = { ...order, orderNumber: order.orderNumber || orderNumber };
    const customerEmail = targetOrder.customerEmail;
    const adminEmail = process.env.SMTP_USER || process.env.SMTP_FROM || "admin@wealthstyle.luxury";
    const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";
    const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "concierge@wealthstyle.luxury";
    const senderName = process.env.SMTP_FROM_NAME || "WEALTHY STYLE Luxury";

    const transporter = getMailerTransporter();

    // 1. Status: SHIPPED
    if (status === "Shipped") {
      if (transporter) {
        // Customer Dispatch Email
        if (customerEmail) {
          await transporter.sendMail({
            from: `"${senderName}" <${senderEmail}>`,
            to: customerEmail,
            subject: `🚀 Your Order #${targetOrder.orderNumber} Has Been Dispatched | WEALTHY STYLE`,
            html: generateOrderShippedEmailHtml(targetOrder, "customer"),
          }).catch((err) => console.error("Error sending Shipped email to customer:", err));
        }

        // Admin Notification Email
        await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: adminEmail,
          subject: `[Admin Alert] Order #${targetOrder.orderNumber} Marked as Shipped`,
          html: generateOrderShippedEmailHtml(targetOrder, "admin"),
        }).catch((err) => console.error("Error sending Shipped email to admin:", err));
      }

      return NextResponse.json({
        success: true,
        message: `Shipped notification emails sent for #${targetOrder.orderNumber}`,
      });
    }

    // 2. Status: OUT FOR DELIVERY
    if (status === "Out for Delivery") {
      const confirmUrl = `${storeUrl}/orders/confirm-delivery?orderNumber=${encodeURIComponent(targetOrder.orderNumber)}&orderId=${encodeURIComponent(targetOrder.id || orderId || "")}`;

      if (transporter) {
        // Customer Email with "Confirm Delivery" Action Button
        if (customerEmail) {
          await transporter.sendMail({
            from: `"${senderName}" <${senderEmail}>`,
            to: customerEmail,
            subject: `🚚 Out for Delivery Today: Order #${targetOrder.orderNumber} | WEALTHY STYLE`,
            html: generateOrderOutForDeliveryEmailHtml(targetOrder, confirmUrl),
          }).catch((err) => console.error("Error sending Out for Delivery email to customer:", err));
        }

        // Admin Alert
        await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: adminEmail,
          subject: `[Admin Alert] Order #${targetOrder.orderNumber} is Out for Delivery`,
          html: generateOrderOutForDeliveryEmailHtml(targetOrder, confirmUrl),
        }).catch((err) => console.error("Error sending Out for Delivery alert to admin:", err));
      }

      return NextResponse.json({
        success: true,
        message: `Out for delivery email sent to ${customerEmail}`,
        confirmUrl,
      });
    }

    // 3. Status: DELIVERED
    if (status === "Delivered") {
      if (transporter) {
        if (customerEmail) {
          await transporter.sendMail({
            from: `"${senderName}" <${senderEmail}>`,
            to: customerEmail,
            subject: `🎉 Parcel Delivered! Order #${targetOrder.orderNumber} | WEALTHY STYLE`,
            html: generateOrderDeliveredEmailHtml(targetOrder, "customer"),
          }).catch((err) => console.error("Error sending Delivered email to customer:", err));
        }

        await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: adminEmail,
          subject: `🔔 [Admin Alert] Order #${targetOrder.orderNumber} Delivered & Confirmed`,
          html: generateOrderDeliveredEmailHtml(targetOrder, "admin"),
        }).catch((err) => console.error("Error sending Delivered alert to admin:", err));
      }

      return NextResponse.json({
        success: true,
        message: `Delivered confirmation emails sent for #${targetOrder.orderNumber}`,
      });
    }

    return NextResponse.json({ success: true, message: `Status ${status} recorded.` });
  } catch (error: any) {
    console.error("Notify status route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to trigger status notification" },
      { status: 500 }
    );
  }
}
