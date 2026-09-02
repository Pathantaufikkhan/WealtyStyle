import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification parameters missing", verified: false },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment cryptographic signature", verified: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      message: "Payment successfully verified",
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Payment verification API error:", error);
    return NextResponse.json(
      { error: error.message || "Payment verification failed", verified: false },
      { status: 500 }
    );
  }
}
