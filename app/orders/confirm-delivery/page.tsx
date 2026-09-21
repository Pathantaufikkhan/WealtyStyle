"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  PackageCheck,
  CheckCircle2,
  ShieldCheck,
  Star,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Truck,
  Heart,
  FileText,
} from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function ConfirmDeliveryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");
  const orderIdParam = searchParams.get("orderId");

  const { orders, updateOrderStatus, syncWithSupabase } = useStoreData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const matchingOrder = orders.find(
    (o) =>
      (orderNumber && o.orderNumber?.toLowerCase() === orderNumber.toLowerCase()) ||
      (orderIdParam && o.id === orderIdParam)
  );

  useEffect(() => {
    syncWithSupabase().catch(() => {});
  }, [syncWithSupabase]);

  useEffect(() => {
    if (matchingOrder?.orderStatus === "Delivered") {
      setIsConfirmed(true);
    }
  }, [matchingOrder?.orderStatus]);

  const handleConfirmReceipt = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders/confirm-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: matchingOrder?.orderNumber || orderNumber,
          orderId: matchingOrder?.id || orderIdParam,
          rating,
          feedback,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to confirm delivery");
      }

      if (matchingOrder) {
        updateOrderStatus(matchingOrder.id, "Delivered");
      }
      setIsConfirmed(true);
      toast.success("Delivery confirmed! Thank you for choosing WEALTHY STYLE.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to confirm delivery. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full">
        {isConfirmed ? (
          <div className="rounded-2xl bg-card border border-gold-500/40 p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <PackageCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Delivery Verified & Confirmed</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight">
                Parcel Successfully Received
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-foreground">{matchingOrder?.customerName || "Valued Client"}</strong>. Your delivery confirmation has been transmitted directly to the WEALTHY STYLE atelier management portal.
              </p>
            </div>

            {/* Order snapshot card */}
            <div className="p-4 rounded-xl bg-background/80 border border-border text-left space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-zinc-400">Order Reference:</span>
                <span className="font-mono font-bold text-foreground">
                  #{matchingOrder?.orderNumber || orderNumber || "CONFIRMED"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-zinc-400">Status in Atelier:</span>
                <span className="font-bold text-emerald-400 uppercase tracking-wider">
                  Delivered & Closed
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total Value:</span>
                <span className="font-bold text-gold-500">
                  {matchingOrder?.grandTotal ? formatPrice(matchingOrder.grandTotal) : "Verified"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/account/orders" className="flex-1">
                <Button variant="outline" className="w-full text-xs font-bold border-zinc-700">
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  View Tax Invoice
                </Button>
              </Link>
              <Link href="/sunglasses" className="flex-1">
                <Button variant="luxury" className="w-full text-xs font-bold uppercase tracking-wider">
                  <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                  Explore Collections
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery Acknowledgment</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight">
                Confirm Parcel Receipt
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Please acknowledge that you have received your package from our courier partner in good condition.
              </p>
            </div>

            {/* Order Brief Summary */}
            <div className="p-4 rounded-xl bg-background/80 border border-border space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Order Number:</span>
                <span className="font-mono font-bold text-foreground">
                  #{matchingOrder?.orderNumber || orderNumber || "N/A"}
                </span>
              </div>
              {matchingOrder?.trackingNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Tracking Code:</span>
                  <span className="font-mono text-blue-400 font-semibold">
                    {matchingOrder.trackingNumber}
                  </span>
                </div>
              )}
              {matchingOrder?.customerName && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Recipient Name:</span>
                  <span className="font-semibold text-foreground">
                    {matchingOrder.customerName}
                  </span>
                </div>
              )}
              {matchingOrder?.grandTotal && (
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-zinc-400">Order Amount:</span>
                  <span className="font-bold text-gold-500">
                    {formatPrice(matchingOrder.grandTotal)}
                  </span>
                </div>
              )}
            </div>

            {/* Delivery Satisfaction Rating */}
            <div className="p-4 rounded-xl bg-gold-500/5 border border-gold-500/20 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400 block">
                Rate Your Delivery Experience
              </span>
              <div className="flex justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= rating
                          ? "text-gold-400 fill-gold-400"
                          : "text-zinc-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback input (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Delivery Note / Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Everything arrived in pristine condition..."
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-gold-500 resize-none"
              />
            </div>

            {/* Big Action Button */}
            <Button
              variant="luxury"
              onClick={handleConfirmReceipt}
              isLoading={isSubmitting}
              className="w-full h-14 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
            >
              <PackageCheck className="w-5 h-5" />
              <span>Yes, I Received My Parcel</span>
            </Button>

            <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
              <span>Instant sync to WEALTHY STYLE Atelier Fulfillment</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmDeliveryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-gold-400 font-serif">
          Loading Delivery Verification...
        </div>
      }
    >
      <ConfirmDeliveryContent />
    </Suspense>
  );
}
