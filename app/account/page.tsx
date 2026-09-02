"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Heart, MapPin, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useStoreData } from "@/lib/store/useStoreData";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";

export default function AccountOverviewPage() {
  const { user } = useAuthStore();
  const { orders } = useStoreData();
  const { items: wishlistItems } = useWishlistStore();

  const userOrders = orders;
  const recentOrder = userOrders[0];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
          Client Dashboard
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight mt-1">
          Account Overview
        </h2>
      </div>

      {/* 3 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/70">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Orders
            </span>
            <ShoppingBag className="h-4 w-4 text-gold-500" />
          </div>
          <span className="font-serif text-2xl font-bold text-foreground">
            {userOrders.length}
          </span>
        </div>

        <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/70">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Wishlist Items
            </span>
            <Heart className="h-4 w-4 text-rose-500" />
          </div>
          <span className="font-serif text-2xl font-bold text-foreground">
            {wishlistItems.length}
          </span>
        </div>

        <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/70">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Saved Addresses
            </span>
            <MapPin className="h-4 w-4 text-gold-500" />
          </div>
          <span className="font-serif text-2xl font-bold text-foreground">
            {user?.savedAddresses?.length || 0}
          </span>
        </div>
      </div>

      {/* Recent Order Preview */}
      {recentOrder && (
        <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-500 tracking-wider">
                Latest Order
              </span>
              <h3 className="text-sm font-bold text-foreground">
                Order #{recentOrder.orderNumber}
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-gold-500/15 text-gold-600 dark:text-gold-400 font-bold">
              {recentOrder.orderStatus}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-500">
            <div>
              <span>Placed on: </span>
              <strong className="text-foreground">
                {new Date(recentOrder.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
              </strong>
            </div>
            <div>
              <span>Items: </span>
              <strong className="text-foreground">{recentOrder.items.length} Products</strong>
            </div>
            <div>
              <span>Grand Total: </span>
              <strong className="text-gold-500 font-bold">{formatPrice(recentOrder.grandTotal)}</strong>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link href="/account/orders">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
                <span>View Full Order Tracking</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Profile Details */}
      <div className="pt-4 border-t border-border space-y-3">
        <h3 className="font-serif text-base font-bold text-foreground uppercase tracking-wider">
          Profile Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-border">
            <span className="text-zinc-400 block mb-1">Full Legal Name</span>
            <p className="font-bold text-foreground">{user?.fullName || "Not set"}</p>
          </div>
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-border">
            <span className="text-zinc-400 block mb-1">Email Address</span>
            <p className="font-bold text-foreground">{user?.email}</p>
          </div>
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-border">
            <span className="text-zinc-400 block mb-1">Contact Phone</span>
            <p className="font-bold text-foreground">{user?.phone || "+91 9876543210"}</p>
          </div>
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-border">
            <span className="text-zinc-400 block mb-1">Membership Tier</span>
            <p className="font-bold text-gold-500 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span>GLAMSTEP VIP Circle</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
