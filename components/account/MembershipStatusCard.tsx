"use client";

import React, { useState } from "react";
import {
  Crown,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Gift,
  HelpCircle,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useStoreData } from "@/lib/store/useStoreData";
import { calculateMembershipStatus } from "@/lib/utils/membership";
import { MembershipOfferModal } from "@/components/membership/MembershipOfferModal";
import { Button } from "@/components/ui/button";

export function MembershipStatusCard() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  const { orders } = useStoreData();
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const status = calculateMembershipStatus(mounted ? user : null, mounted ? orders : []);
  const progressPercent = Math.min(100, Math.round((status.orderCount / 5) * 100));

  if (!mounted) {
    return (
      <div className="rounded-3xl bg-zinc-950/60 border border-zinc-800 p-6 sm:p-8 animate-pulse h-48" />
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-gold-500/30 p-6 sm:p-8 shadow-xl shadow-gold-500/5 text-zinc-100">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gold-500/5 blur-3xl" />

        <div className="relative z-10 space-y-6">
          {/* Top Row: Title + Tier Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 p-0.5 shadow-md shadow-gold-500/20 flex items-center justify-center flex-shrink-0">
                <div className="h-full w-full rounded-[14px] bg-zinc-950 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-gold-400" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-400 block">
                  Maison Privée Loyalty Tier
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mt-0.5">
                  {status.isValuedMember ? "Valued Client VIP" : "Standard Client Tier"}
                </h3>
              </div>
            </div>

            <div>
              {status.isValuedMember ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>VIP Active • Lifetime</span>
                </span>
              ) : status.qualifiesFor3OrderOffer ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>₹110 Privilege Offer Available</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Standard Member</span>
                </span>
              )}
            </div>
          </div>

          {/* ACTIVE MEMBER VIEW: Congratulations & Perks */}
          {status.isValuedMember ? (
            <div className="space-y-5">
              {/* Congratulations Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent border border-gold-500/30 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-white text-sm">
                    Congratulations! You hold lifetime Valued Client clearance.
                  </p>
                  <p className="text-zinc-300 leading-relaxed">
                    {status.membershipMethod === "auto_5_orders"
                      ? "Earned automatically as a loyalty gift for completing 5 acquisitions."
                      : "Granted as an executive privilege member."}
                  </p>
                </div>
              </div>

              {/* Unlocked Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">100% Free Doorstep COD</strong>
                    <span className="text-zinc-400 text-[11px]">Zero security deposit on all future orders</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Priority Express Air Courier</strong>
                    <span className="text-zinc-400 text-[11px]">Fastest nationwide logistics priority</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">24/7 Dedicated VIP Concierge</strong>
                    <span className="text-zinc-400 text-[11px]">Direct WhatsApp & phone assistance</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Gold Passport Monogram</strong>
                    <span className="text-zinc-400 text-[11px]">Verified VIP badge on your profile</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* NON-MEMBER PROGRESS & OFFER VIEW */
            <div className="space-y-5">
              {/* Progress Bar & Milestone Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">
                    Completed Orders: <strong className="text-white font-bold">{status.orderCount} / 5</strong>
                  </span>
                  <span className="text-gold-400 font-bold font-mono">
                    {status.orderCount >= 5 ? "100% (Unlocked)" : `${5 - status.orderCount} orders away from 100% Free VIP`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Milestone Indicators */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 font-semibold">
                  <span className={status.orderCount >= 1 ? "text-gold-400" : ""}>1 Order</span>
                  <span className={status.orderCount >= 3 ? "text-gold-400 font-bold" : ""}>
                    3 Orders (₹110 Offer)
                  </span>
                  <span className={status.orderCount >= 5 ? "text-emerald-400 font-bold" : ""}>
                    5 Orders (Free VIP)
                  </span>
                </div>
              </div>

              {/* Dynamic Callout based on Order Count */}
              {status.qualifiesFor3OrderOffer ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-gold-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-gold-400" />
                      <h4 className="font-bold text-white text-sm">
                        Valued Client Membership Offer (₹110)
                      </h4>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                      Get <strong>100% Free Cash on Delivery (Zero Advance)</strong> and VIP perks right now for only ₹110! Or complete {status.ordersUntilFreeUpgrade} more order{status.ordersUntilFreeUpgrade > 1 ? "s" : ""} to unlock it 100% FREE!
                    </p>
                  </div>

                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => setIsOfferModalOpen(true)}
                    className="whitespace-nowrap font-bold uppercase text-xs px-4"
                  >
                    <span>View Offer (₹110)</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 space-y-2">
                  <p className="font-semibold text-zinc-200">
                    How to unlock Valued Client Membership:
                  </p>
                  <ul className="space-y-1 text-[11px] list-disc list-inside text-zinc-400">
                    <li>
                      <strong className="text-gold-400">At 3 Orders:</strong> You qualify for an exclusive <strong>₹110 promotional offer</strong> to unlock 100% Free Doorstep COD immediately.
                    </li>
                    <li>
                      <strong className="text-emerald-400">At 5 Orders:</strong> You are <strong>automatically upgraded 100% FREE for life!</strong>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <MembershipOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        orderCount={status.orderCount}
      />
    </>
  );
}
