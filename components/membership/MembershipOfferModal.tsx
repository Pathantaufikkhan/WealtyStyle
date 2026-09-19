"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  ShieldCheck,
  Truck,
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MembershipOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCount?: number;
}

export function MembershipOfferModal({
  isOpen,
  onClose,
  orderCount = 3,
}: MembershipOfferModalProps) {
  const { user, grantValuedMembership } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePurchaseMembership = async () => {
    setIsProcessing(true);
    try {
      // Simulate Razorpay/Instant acquisition of ₹110 Valued Client membership
      await new Promise((resolve) => setTimeout(resolve, 800));

      grantValuedMembership("purchased");
      toast.success("👑 Welcome to the Valued Client Circle! 100% Free COD Unlocked.");
      onClose();
    } catch (err) {
      toast.error("Unable to process membership right now. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-zinc-950 border border-gold-500/40 p-6 sm:p-8 shadow-2xl shadow-gold-500/10 text-zinc-100"
        >
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="space-y-6 relative z-10">
            {/* Header Badge */}
            <div className="space-y-2 text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 p-0.5 shadow-lg shadow-gold-500/25 flex items-center justify-center">
                <div className="h-full w-full rounded-[14px] bg-zinc-950 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-gold-400 animate-pulse" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-[10px] font-black uppercase tracking-widest text-gold-400 mt-2">
                <Sparkles className="h-3 w-3" />
                <span>3 Orders Milestone Unlocked</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                Valued Client Membership
              </h3>

              <p className="text-xs text-zinc-400 max-w-sm">
                Congratulations on completing {orderCount} orders! You are exclusively invited to join our prestigious <strong>Valued Client Circle</strong>.
              </p>
            </div>

            {/* Exclusive Perks Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 block">
                Privileges Included:
              </span>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5 text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-gold-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">100% Free Doorstep COD:</strong> Zero advance security deposit required on all orders!
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-gold-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Priority Air Dispatch:</strong> Fastest express courier allocation across India.
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-gold-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">VIP Concierge Desk:</strong> Direct priority WhatsApp and email assistance.
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 text-gold-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Gold Passport Badge:</strong> Permanent luxury status shown in your account.
                  </span>
                </div>
              </div>

              {/* Pricing Callout */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
                    Exclusive Rate
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-black text-gold-400">₹110</span>
                    <span className="text-xs text-zinc-500 line-through">₹999</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  ONE-TIME • LIFETIME VALIDITY
                </span>
              </div>
            </div>

            {/* Free Auto-Upgrade Notice */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-dashed border-zinc-700 text-[11px] text-zinc-400 leading-relaxed">
              <span className="text-gold-400 font-bold">Don&apos;t want to purchase now? No problem!</span> You can continue shopping. Once you reach <strong className="text-zinc-200 font-bold">5 total orders</strong> in your history, this Valued Client Membership will be <strong className="text-emerald-400 font-bold">automatically granted to you 100% FREE!</strong>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:flex-1 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300"
              >
                Maybe Later
              </Button>

              <Button
                variant="gold"
                onClick={handlePurchaseMembership}
                isLoading={isProcessing}
                className="w-full sm:flex-1 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-gold-500/20"
              >
                <span>Unlock for ₹110</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
