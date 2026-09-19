"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Truck,
  Award,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useStoreData } from "@/lib/store/useStoreData";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { RecoveryEmailModal } from "@/components/auth/RecoveryEmailModal";
import { MembershipStatusCard } from "@/components/account/MembershipStatusCard";

export default function AccountOverviewPage() {
  const { user } = useAuthStore();
  const { orders } = useStoreData();
  const { items: wishlistItems } = useWishlistStore();

  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = React.useState(false);
  const [isInitialPrompt, setIsInitialPrompt] = React.useState(false);

  // Auto-prompt to add recovery email if user doesn't have one configured yet
  React.useEffect(() => {
    if (user && !user.recoveryEmail) {
      const dismissed = sessionStorage.getItem(`recovery_prompt_dismissed_${user.id}`);
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsInitialPrompt(true);
          setIsRecoveryModalOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleCloseModal = () => {
    if (user) {
      sessionStorage.setItem(`recovery_prompt_dismissed_${user.id}`, "true");
    }
    setIsRecoveryModalOpen(false);
    setIsInitialPrompt(false);
  };

  const userOrders = orders;
  const recentOrder = userOrders[0];

  return (
    <div className="space-y-8">
      {/* Valued Client Membership Privilege Status Card */}
      <MembershipStatusCard />

      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/60">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-gold-500">
            Client Atelier
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight mt-0.5">
            Account Overview
          </h2>
        </div>
        <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
          <Clock className="h-3.5 w-3.5 text-gold-500" />
          <span>Last logged in: Today</span>
        </span>
      </div>

      {/* 3 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Total Orders Card */}
        <Link
          href="/account/orders"
          className="group p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/80 hover:border-gold-500/50 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Total Orders
            </span>
            <div className="h-9 w-9 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-foreground">
              {userOrders.length}
            </span>
            <span className="text-xs text-gold-500 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>View</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Link>

        {/* Wishlist Items Card */}
        <Link
          href="/account/wishlist"
          className="group p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/80 hover:border-rose-500/50 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Curated Wishlist
            </span>
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-foreground">
              {wishlistItems.length}
            </span>
            <span className="text-xs text-rose-500 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>Explore</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Link>

        {/* Saved Addresses Card */}
        <Link
          href="/account/addresses"
          className="group p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/80 hover:border-gold-500/50 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Saved Addresses
            </span>
            <div className="h-9 w-9 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-foreground">
              {user?.savedAddresses?.length || 0}
            </span>
            <span className="text-xs text-gold-500 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Link>
      </div>

      {/* Recent Order Preview */}
      {recentOrder ? (
        <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-zinc-50 to-zinc-100/60 dark:from-zinc-900/70 dark:to-zinc-950/90 border border-border/80 dark:border-gold-500/20 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-500 tracking-widest block mb-0.5">
                Latest Consignment
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-foreground">
                Order #{recentOrder.orderNumber}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{recentOrder.orderStatus}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-card border border-border/70">
              <span className="text-zinc-400 block mb-1 text-[11px] uppercase tracking-wider">Date Placed</span>
              <strong className="text-foreground font-semibold">
                {new Date(recentOrder.createdAt).toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                })}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/70">
              <span className="text-zinc-400 block mb-1 text-[11px] uppercase tracking-wider">Consignment Size</span>
              <strong className="text-foreground font-semibold">
                {recentOrder.items.length} Handcrafted Pieces
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/70">
              <span className="text-zinc-400 block mb-1 text-[11px] uppercase tracking-wider">Order Value</span>
              <strong className="text-gold-500 font-serif text-sm font-bold">
                {formatPrice(recentOrder.grandTotal)}
              </strong>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-zinc-500 flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-gold-500" />
              <span>Complimentary insured courier delivery</span>
            </span>
            <Link href="/account/orders">
              <Button variant="gold" size="sm" className="flex items-center gap-2 text-xs w-full sm:w-auto">
                <span>View Full Shipment Tracking</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : null}

      {/* Maison Client Privileges */}
      <div className="rounded-2xl bg-zinc-950 text-white border border-gold-500/20 p-6 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Privileged Membership</span>
            </span>
            <h3 className="font-serif text-lg font-bold text-white mt-1">
              WEALTHY STYLE Atelier Benefits
            </h3>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 font-bold uppercase tracking-wider">
            Active Tier 1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <strong className="text-zinc-200 block text-xs">100% Authenticity</strong>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Every piece accompanied by a physical certificate of authenticity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <strong className="text-zinc-200 block text-xs">White-Glove Express</strong>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Complimentary priority air transit on all luxury purchases.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <strong className="text-zinc-200 block text-xs">Dedicated Stylist</strong>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Direct WhatsApp and concierge guidance for sizing and tailoring.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            Profile Credentials
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsInitialPrompt(false);
              setIsRecoveryModalOpen(true);
            }}
            className="text-xs flex items-center gap-1.5 border-gold-500/30 hover:border-gold-500 text-gold-500"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{user?.recoveryEmail ? "Update Recovery Email" : "+ Add Recovery Email"}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-border/80">
            <span className="text-zinc-400 block mb-1 uppercase tracking-wider text-[10px] font-bold">
              Legal Name
            </span>
            <p className="font-bold text-foreground text-sm capitalize">
              {user?.fullName || "Not provided"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-border/80">
            <span className="text-zinc-400 block mb-1 uppercase tracking-wider text-[10px] font-bold">
              Primary Email
            </span>
            <p className="font-bold text-foreground text-sm font-mono">
              {user?.email}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-border/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-400 uppercase tracking-wider text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-gold-500" />
                <span>Recovery Email (For Password Reset)</span>
              </span>
              <button
                onClick={() => {
                  setIsInitialPrompt(false);
                  setIsRecoveryModalOpen(true);
                }}
                className="text-[11px] text-gold-500 font-semibold hover:underline"
              >
                {user?.recoveryEmail ? "Edit" : "Set Now"}
              </button>
            </div>
            {user?.recoveryEmail ? (
              <p className="font-bold text-foreground text-sm font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{user.recoveryEmail}</span>
              </p>
            ) : (
              <p className="text-amber-500 text-xs font-medium flex items-center gap-1">
                <span>⚠️ Not configured (Click to add for account safety)</span>
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-border/80">
            <span className="text-zinc-400 block mb-1 uppercase tracking-wider text-[10px] font-bold">
              Contact Number
            </span>
            <p className="font-bold text-foreground text-sm">
              {user?.phone || "+91 9876543210"}
            </p>
          </div>
        </div>
      </div>

      {/* Recovery Email Pop-up Modal */}
      <RecoveryEmailModal
        isOpen={isRecoveryModalOpen}
        onClose={handleCloseModal}
        isInitialPrompt={isInitialPrompt}
      />
    </div>
  );
}
