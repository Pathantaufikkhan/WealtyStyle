"use client";

import React, { Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Package,
  Truck,
  Download,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "GS-892410";
  const orderId = searchParams.get("orderId");

  const { orders } = useStoreData();
  const order = orders.find((o) => o.orderNumber === orderNumber || o.id === orderId) || orders[0];

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#C5A059", "#FAF8F5", "#111111"],
      });
    } catch {
      // ignore
    }
  }, []);

  const milestones = [
    { title: "Order Confirmed", desc: "Payment verified securely", completed: true, active: false },
    { title: "Artisanal Packing", desc: "Inspection & climate packing", completed: true, active: true },
    { title: "Shipped in Transit", desc: "Dispatched via Bluedart Air", completed: false, active: false },
    { title: "Delivered", desc: "To your verified address", completed: false, active: false },
  ];

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-500">
            Payment & Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-foreground uppercase tracking-tight">
            Thank You for Your Order
          </h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Order Reference: <strong className="font-mono text-foreground">{orderNumber}</strong>. A confirmation email and SMS dispatch updates have been sent.
          </p>
        </div>

        {/* Milestone Progress Bar */}
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
              <Truck className="h-4 w-4 text-gold-500" />
              <span>Real-Time Shipment Progress</span>
            </div>
            {order?.trackingNumber && (
              <span className="text-xs font-mono text-zinc-400">
                AWB: <strong className="text-gold-500">{order.trackingNumber}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {milestones.map((m, i) => (
              <div key={i} className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full flex-shrink-0 ${
                      m.completed
                        ? "bg-emerald-500 ring-2 ring-emerald-500/20"
                        : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  />
                  <h4
                    className={`text-xs font-bold ${
                      m.completed ? "text-foreground" : "text-zinc-400"
                    }`}
                  >
                    {m.title}
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-500">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Itemized Order Summary Box */}
        {order && (
          <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Order Details
                </h3>
                <p className="text-xs text-zinc-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => alert(`Downloaded Invoice receipt for ${order.orderNumber}`)}
                className="flex items-center gap-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Invoice PDF</span>
              </Button>
            </div>

            {/* Items */}
            <div className="space-y-4 divide-y divide-border/40">
              {order.items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-border flex-shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ""} {item.selectedSize ? `• ${item.selectedSize}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border text-xs">
              <div>
                <span className="font-bold text-foreground block mb-1 uppercase tracking-wider">
                  Shipping Destination
                </span>
                <p className="text-zinc-500 leading-relaxed">
                  {order.shippingAddress.fullName}<br />
                  {order.shippingAddress.houseFlat}, {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>

              <div>
                <span className="font-bold text-foreground block mb-1 uppercase tracking-wider">
                  Payment Summary
                </span>
                <div className="space-y-1.5 text-zinc-500">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <strong className="text-foreground">
                      {order.paymentMethod === "Advance_COD"
                        ? "₹200 Advance + COD Balance"
                        : order.paymentMethod}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {order.paymentStatus}
                    </span>
                  </div>
                  {order.advancePaid !== undefined && order.advancePaid > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Advance Security Paid:</span>
                      <span>₹{order.advancePaid}</span>
                    </div>
                  )}
                  {order.balanceDue !== undefined && order.balanceDue > 0 && (
                    <div className="flex justify-between text-gold-500 font-bold bg-gold-500/10 px-2 py-1 rounded">
                      <span>Due on Delivery (Doorstep):</span>
                      <span>{formatPrice(order.balanceDue)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-border font-bold text-foreground text-sm">
                    <span>Grand Total:</span>
                    <span className="text-gold-500">{formatPrice(order.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/account/orders">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Order History
            </Button>
          </Link>
          <Link href="/">
            <Button variant="gold" size="lg" className="w-full sm:w-auto flex items-center gap-2">
              <span>Return to Maison</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
