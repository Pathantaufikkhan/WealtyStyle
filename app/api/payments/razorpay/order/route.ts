import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { products } from "@/lib/data/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerEmail, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    // Server-side Price Verification: Never trust client pricing!
    let calculatedSubtotal = 0;
    for (const item of items) {
      const serverProduct = products.find((p) => p.id === item.productId);
      if (!serverProduct) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      const variantPrice = item.selectedVariant?.price || serverProduct.price;
      calculatedSubtotal += variantPrice * (item.quantity || 1);
    }

    // Apply server-side discount if valid
    let discount = 0;
    if (couponCode === "GLAM10" && calculatedSubtotal >= 2000) {
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

    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const razorpayOrder = await createRazorpayOrder({
      amount: finalAmount,
      currency: "INR",
      receipt,
      notes: {
        customerEmail: customerEmail || "guest@glamstep.luxury",
        couponCode: couponCode || "NONE",
      },
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
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
