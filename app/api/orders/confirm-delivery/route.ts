import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getMailerTransporter,
  generateOrderDeliveredEmailHtml,
} from "@/lib/nodemailer/mailer";

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, orderId, rating, feedback } = await req.json();

    if (!orderNumber && !orderId) {
      return NextResponse.json(
        { error: "orderNumber or orderId is required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 1. Fetch current order from Supabase
    let query = supabase.from("orders").select("*, items:order_items(*)");
    if (orderNumber) {
      query = query.eq("order_number", orderNumber);
    } else {
      query = query.eq("id", orderId);
    }

    const { data: orders, error: fetchError } = await query;

    let targetOrder = orders && orders.length > 0 ? orders[0] : null;

    // 2. Update status to Delivered and Payment to Paid in Supabase
    const updatePayload: any = {
      order_status: "Delivered",
      payment_status: "Paid",
      updated_at: new Date().toISOString(),
    };

    if (orderNumber) {
      await supabase
        .from("orders")
        .update(updatePayload)
        .eq("order_number", orderNumber);
    } else if (orderId) {
      await supabase
        .from("orders")
        .update(updatePayload)
        .eq("id", orderId);
    }

    // 3. Trigger Email Notifications to Customer & Admin
    const customerEmail = targetOrder?.customer_email || targetOrder?.customerEmail;
    const customerName = targetOrder?.customer_name || targetOrder?.customerName || "Valued Client";
    const grandTotal = targetOrder?.grand_total || targetOrder?.grandTotal || 0;
    const adminEmail = process.env.SMTP_USER || process.env.SMTP_FROM || "admin@wealthstyle.luxury";
    const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "concierge@wealthstyle.luxury";
    const senderName = process.env.SMTP_FROM_NAME || "WEALTHY STYLE Luxury";

    const emailOrderObj = {
      orderNumber: targetOrder?.order_number || orderNumber,
      customerName,
      customerEmail,
      grandTotal,
      items: targetOrder?.items || [],
      rating,
      feedback,
    };

    const transporter = getMailerTransporter();
    if (transporter) {
      // Send confirmation to Customer
      if (customerEmail) {
        await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: customerEmail,
          subject: `🎉 Parcel Delivered! Order #${emailOrderObj.orderNumber} | WEALTHY STYLE`,
          html: generateOrderDeliveredEmailHtml(emailOrderObj, "customer"),
        }).catch((err) => console.error("Error sending Delivered email to customer:", err));
      }

      // Send alert to Admin
      await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: adminEmail,
        subject: `🔔 [Admin Alert] Customer Confirmed Delivery for Order #${emailOrderObj.orderNumber}`,
        html: generateOrderDeliveredEmailHtml(emailOrderObj, "admin"),
      }).catch((err) => console.error("Error sending Delivered alert to admin:", err));
    }

    return NextResponse.json({
      success: true,
      message: "Order marked as Delivered and confirmation emails sent.",
      order: targetOrder,
    });
  } catch (error: any) {
    console.error("Confirm delivery route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to confirm delivery" },
      { status: 500 }
    );
  }
}
