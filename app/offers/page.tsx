"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Timer, Copy, CheckCircle2, ArrowRight } from "lucide-react";
import { products } from "@/lib/data/products";
import { initialCoupons } from "@/lib/data/initialStore";
import { ProductGrid } from "@/components/products/ProductGrid";
import { formatPrice } from "@/lib/utils/currency";
import { toast } from "sonner";

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const discountedProducts = products.filter((p) => p.discountPercentage > 0);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Offers Hero */}
      <div className="relative py-20 bg-zinc-950 text-white overflow-hidden border-b border-gold-500/20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1600&auto=format&fit=crop"
            alt="GLAMSTEP Luxury Offers"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Timer className="h-4 w-4 animate-pulse" />
            <span>Limited Time Maison Privileges</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-black uppercase tracking-tight">
            Seasonal Luxury <span className="text-gold-gradient italic">Privileges</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto mt-3">
            Enjoy exclusive seasonal reductions on certified Italian eyewear, calfskin footwear, and automatic timepieces.
          </p>

          {/* Flash Deal Countdown Clock */}
          <div className="mt-8 inline-flex items-center gap-3 sm:gap-6 bg-zinc-900/90 border border-gold-500/30 rounded-xl px-6 py-4 backdrop-blur-md">
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                Hours
              </span>
            </div>
            <span className="font-serif text-2xl text-gold-500">:</span>
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                Minutes
              </span>
            </div>
            <span className="font-serif text-2xl text-gold-500">:</span>
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                Seconds
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Active Promo Coupon Cards */}
        <div>
          <div className="flex items-center gap-2 text-gold-500 text-xs font-bold uppercase tracking-[0.25em] mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Maison Promotion Codes</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase mb-6">
            Available Vouchers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {initialCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="p-5 rounded-xl bg-card border border-border/80 hover:border-gold-500/60 transition-all shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-black text-gold-600 dark:text-gold-400 bg-gold-500/10 px-2.5 py-1 rounded border border-gold-500/30 tracking-wider">
                      {coupon.code}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                      {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-foreground font-medium mt-2">
                    {coupon.description}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Min spend: {formatPrice(coupon.minOrderValue)}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="mt-4 w-full py-2 rounded-sm border border-border hover:border-gold-500 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-gold-500 hover:text-zinc-950 transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Discounted Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
                Discounted Creations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase mt-1">
                Featured Privileges ({discountedProducts.length})
              </h2>
            </div>
          </div>

          <ProductGrid products={discountedProducts} columns={4} />
        </div>
      </div>
    </div>
  );
}
