import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const isValidUUID = (str?: string): boolean =>
  typeof str === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

/**
 * POST /api/orders
 * Inserts a new customer order and its order items directly into Supabase
 */
export async function POST(req: NextRequest) {
  try {
    const { order } = await req.json();

    if (!order || !order.orderNumber) {
      return NextResponse.json(
        { error: "Invalid order data provided" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 1. Prepare Order record for Supabase `orders` table
    const orderPayload = {
      order_number: order.orderNumber,
      user_id: isValidUUID(order.userId) ? order.userId : null,
      customer_name: order.customerName || order.shippingAddress?.fullName || "Guest Customer",
      customer_email: order.customerEmail || "customer@example.com",
      customer_phone: order.customerPhone || order.shippingAddress?.phone || "N/A",
      shipping_address: order.shippingAddress || {},
      subtotal: Number(order.subtotal || 0),
      discount: Number(order.discount || 0),
      coupon_code: order.couponCode || null,
      shipping_cost: Number(order.shippingCost || 0),
      tax: Number(order.tax || 0),
      grand_total: Number(order.grandTotal || 0),
      payment_method: order.paymentMethod || "Razorpay",
      payment_status: order.paymentStatus || "Paid",
      payment_id: order.paymentId || null,
      order_status: order.orderStatus || "Confirmed",
      tracking_number: order.trackingNumber || null,
      estimated_delivery: order.estimatedDelivery || null,
      created_at: order.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert Order into `orders` table
    const { data: insertedOrder, error: orderError } = await supabase
      .from("orders")
      .upsert([orderPayload], { onConflict: "order_number" })
      .select()
      .single();

    if (orderError) {
      console.error("Supabase Order Insert Error:", orderError);
      return NextResponse.json(
        { error: orderError.message, details: orderError },
        { status: 500 }
      );
    }

    // 2. Prepare Order Items records for Supabase `order_items` table
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      const itemsPayload = order.items.map((item: any) => ({
        order_id: insertedOrder.id,
        product_id: isValidUUID(item.productId) ? item.productId : null,
        product_name: item.productName || item.name || "Luxury Item",
        product_image: item.productImage || item.image || item.images?.[0] || "",
        category: item.category || "accessories",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        selected_color: item.selectedColor || null,
        selected_size: item.selectedSize || null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsPayload);

      if (itemsError) {
        console.error("Supabase Order Items Insert Error:", itemsError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order successfully synced to Supabase database",
      order: insertedOrder,
    });
  } catch (err: any) {
    console.error("API /api/orders Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process order" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders
 * Fetches all orders with their items from Supabase
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: orders || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/orders
 * Updates an order status or tracking number in Supabase
 */
export async function PATCH(req: NextRequest) {
  try {
    const { orderId, orderNumber, status, trackingNumber } = await req.json();

    const supabase = createServerSupabaseClient();

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (status) updatePayload.order_status = status;
    if (trackingNumber) updatePayload.tracking_number = trackingNumber;

    let query = supabase.from("orders").update(updatePayload);

    if (orderId && isValidUUID(orderId)) {
      query = query.eq("id", orderId);
    } else if (orderNumber) {
      query = query.eq("order_number", orderNumber);
    } else {
      return NextResponse.json(
        { error: "orderId or orderNumber required" },
        { status: 400 }
      );
    }

    const { data, error } = await query.select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
