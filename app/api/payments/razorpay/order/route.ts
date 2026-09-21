import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { products } from "@/lib/data/products";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerEmail, couponCode, isAdvancePayment } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Server-side Price Verification: Check static catalog, Supabase DB, or item payload
    let calculatedSubtotal = 0;
    for (const item of items) {
      let itemPrice: number = Number(item.price) || 0;

      // 1. Check in static dataset
      const staticProduct = products.find((p) => p.id === item.productId);
      if (staticProduct) {
        itemPrice = item.selectedVariant?.price || staticProduct.price;
      } else {
        // 2. Check in Supabase database
        try {
          const { data: dbProduct } = await supabase
            .from("products")
            .select("price")
            .eq("id", item.productId)
            .single();

          if (dbProduct && dbProduct.price) {
            itemPrice = Number(dbProduct.price);
          }
        } catch {
          // If Supabase fetch fails, fallback to cart item price
        }
      }

      calculatedSubtotal += (itemPrice || 0) * (item.quantity || 1);
    }

    // Apply server-side discount if valid
    let discount = 0;
    if ((couponCode === "GLAM10" || couponCode === "WEALTHY10") && calculatedSubtotal >= 2000) {
      discount = Math.min((calculatedSubtotal * 10) / 100, 2000);
    } else if (couponCode === "LUXURY20" && calculatedSubtotal >= 10000) {
      discount = Math.min((calculatedSubtotal * 20) / 100, 5000);
    } else if (couponCode === "WELCOME500" && calculatedSubtotal >= 3000) {
      discount = 500;
    } else if (couponCode === "VIP1000" && calculatedSubtotal >= 8000) {
      discount = 1000;
    }

    const shipping = calculatedSubtotal >= 2499 ? 0 : 199;
    const finalAmount = Math.max(0, calculatedSubtotal - discount + shipping);

    // If advance security deposit is chosen, charge ₹200 now, remaining on delivery
    const payableAmount = isAdvancePayment ? Math.min(200, finalAmount) : finalAmount;
    const balanceDue = Math.max(0, finalAmount - payableAmount);

    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const razorpayOrder = await createRazorpayOrder({
      amount: payableAmount,
      currency: "INR",
      receipt,
      notes: {
        customerEmail: customerEmail || "guest@wealthstyle.luxury",
        couponCode: couponCode || "NONE",
        paymentMode: isAdvancePayment ? "advance_security_deposit" : "full_online",
        advancePaid: String(payableAmount),
        balanceDueOnDelivery: String(balanceDue),
        totalOrderValue: String(finalAmount),
      },
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      payableAmount,
      balanceDue,
      totalAmount: finalAmount,
      isAdvancePayment: Boolean(isAdvancePayment),
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_glamstep_demo",
    });
  } catch (error: any) {
    console.error("Order creation API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
