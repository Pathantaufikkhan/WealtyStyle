"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Award,
  Crown,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  Radio,
  ExternalLink,
  ChevronRight,
  X,
  Calendar,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  tier: "VIP Black" | "VIP Platinum" | "Valued VIP" | "Standard Patron";
  isRegistered: boolean;
  orders: any[];
  addresses: any[];
}

export default function AdminCustomersPage() {
  const { registeredAccounts } = useAuthStore();
  const { orders, syncWithSupabase } = useStoreData();
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Auto-sync customer & order data continuously
  useEffect(() => {
    let isMounted = true;
    const performSync = async () => {
      try {
        await syncWithSupabase();
        if (isMounted) setLastSynced(new Date());
      } catch (e) {
        console.error("Customers sync error:", e);
      }
    };

    performSync();
    const interval = setInterval(performSync, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [syncWithSupabase]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncWithSupabase();
      setLastSynced(new Date());
      toast.success("Client directory synchronized in real-time");
    } catch (e) {
      toast.error("Failed to sync customer directory");
    } finally {
      setIsSyncing(false);
    }
  };

  // Real-Time Customer Directory Aggregation
  const customersList = useMemo(() => {
    const customerMap = new Map<string, CustomerRecord>();

    // 1. Ingest registered accounts from auth store
    (registeredAccounts || []).forEach((acc) => {
      const emailKey = acc.email.toLowerCase().trim();
      const userOrders = orders.filter(
        (o) =>
          (o.customerEmail && o.customerEmail.toLowerCase().trim() === emailKey) ||
          (o.userId && o.userId === acc.id)
      );

      const totalSpent = userOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
      const totalOrders = userOrders.length;

      let tier: CustomerRecord["tier"] = "Standard Patron";
      if (acc.isValuedMember || acc.membershipTier === "valued_client") {
        tier = "Valued VIP";
      } else if (totalSpent >= 40000 || totalOrders >= 5) {
        tier = "VIP Black";
      } else if (totalSpent >= 20000 || totalOrders >= 2) {
        tier = "VIP Platinum";
      }

      const defaultAddress = acc.savedAddresses?.find((a) => a.isDefault) || acc.savedAddresses?.[0];
      const orderAddress = userOrders[0]?.shippingAddress;

      const city =
        defaultAddress?.city ||
        orderAddress?.city ||
        "Mumbai";
      const state =
        defaultAddress?.state ||
        orderAddress?.state ||
        "Maharashtra";

      customerMap.set(emailKey, {
        id: acc.id,
        name: acc.fullName || "Maison Client",
        email: acc.email,
        phone: acc.phone || orderAddress?.phone || "+91 98765 43210",
        city: `${city}, ${state}`,
        state,
        totalOrders,
        totalSpent,
        joinDate: new Date(acc.createdAt || Date.now()).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        tier,
        isRegistered: true,
        orders: userOrders,
        addresses: acc.savedAddresses || [],
      });
    });

    // 2. Ingest guest / direct purchasers from orders
    orders.forEach((order) => {
      if (!order.customerEmail) return;
      const emailKey = order.customerEmail.toLowerCase().trim();

      if (!customerMap.has(emailKey)) {
        const guestOrders = orders.filter(
          (o) => o.customerEmail && o.customerEmail.toLowerCase().trim() === emailKey
        );
        const totalSpent = guestOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
        const totalOrders = guestOrders.length;

        let tier: CustomerRecord["tier"] = "Standard Patron";
        if (totalSpent >= 40000 || totalOrders >= 5) {
          tier = "VIP Black";
        } else if (totalSpent >= 20000 || totalOrders >= 2) {
          tier = "VIP Platinum";
        }

        const city = order.shippingAddress?.city || "New Delhi";
        const state = order.shippingAddress?.state || "Delhi";

        customerMap.set(emailKey, {
          id: `gst-${order.id}`,
          name: order.customerName || order.shippingAddress?.fullName || "Guest Patron",
          email: order.customerEmail,
          phone: order.customerPhone || order.shippingAddress?.phone || "+91 98765 43210",
          city: `${city}, ${state}`,
          state,
          totalOrders,
          totalSpent,
          joinDate: new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          tier,
          isRegistered: false,
          orders: guestOrders,
          addresses: order.shippingAddress ? [order.shippingAddress] : [],
        });
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [registeredAccounts, orders]);

  // Filter by search & tier
  const filteredCustomers = customersList.filter((c) => {
    const query = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query);
    const matchesTier = tierFilter === "all" || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  // Summary Metrics
  const totalPatrons = customersList.length;
  const vipCount = customersList.filter((c) => c.tier !== "Standard Patron").length;
  const totalClientLtv = customersList.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgLtv = totalPatrons > 0 ? Math.round(totalClientLtv / totalPatrons) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header with Real-Time Pulse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              Live Real-Time Directory
            </span>
            {lastSynced && (
              <span className="text-[10px] text-zinc-500 font-mono hidden md:inline">
                • Synced {lastSynced.toLocaleTimeString("en-IN")}
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mt-1">
            Registered Patrons & VIP Directory ({totalPatrons})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-gold-400 hover:border-gold-500 text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin text-gold-400" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Live Refresh"}</span>
          </Button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Total Client Directory
          </span>
          <p className="font-serif text-2xl font-black text-white">{totalPatrons}</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <Radio className="h-3 w-3" /> Live patron records
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            VIP & Valued Patrons
          </span>
          <p className="font-serif text-2xl font-black text-gold-400">{vipCount}</p>
          <span className="text-[11px] text-zinc-400">
            {Math.round((vipCount / (totalPatrons || 1)) * 100)}% VIP concentration
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Total Customer LTV
          </span>
          <p className="font-serif text-2xl font-black text-white">
            {formatPrice(totalClientLtv)}
          </p>
          <span className="text-[11px] text-zinc-400">Cumulative store spend</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Average Spend / Patron
          </span>
          <p className="font-serif text-2xl font-black text-white">{formatPrice(avgLtv)}</p>
          <span className="text-[11px] text-zinc-400">High luxury conversion</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patron by name, email, phone, city..."
            className="w-full h-10 pl-9 pr-4 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-400 font-semibold">Tier Filter:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="h-10 px-3 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-white font-medium focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Membership Tiers</option>
            <option value="VIP Black">VIP Black (&gt;₹40,000)</option>
            <option value="VIP Platinum">VIP Platinum (&gt;₹20,000)</option>
            <option value="Valued VIP">Valued VIP</option>
            <option value="Standard Patron">Standard Patron</option>
          </select>
        </div>
      </div>

      {/* Real-Time Customers Table */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-4">Patron & Identity</th>
                <th className="p-4">Direct Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">Live Orders</th>
                <th className="p-4">Lifetime Value</th>
                <th className="p-4">Maison Status</th>
                <th className="p-4 text-right">Portfolio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-0.5 flex-shrink-0">
                        <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center font-bold text-gold-400 text-xs">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <strong className="text-white block text-sm">{c.name}</strong>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {c.isRegistered ? "Registered Member" : "Guest Purchaser"} • Joined {c.joinDate}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Mail className="h-3 w-3 text-gold-400" />
                      <span className="font-mono">{c.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Phone className="h-3 w-3 text-zinc-500" />
                      <span className="font-mono">{c.phone}</span>
                    </div>
                  </td>

                  <td className="p-4 text-zinc-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gold-500 flex-shrink-0" />
                      <span>{c.city}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-white block">
                      {c.totalOrders} Order{c.totalOrders !== 1 ? "s" : ""}
                    </span>
                    {c.orders.length > 0 && (
                      <span className="text-[10px] text-zinc-500">
                        Latest: #{c.orders[0].orderNumber}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <strong className="font-bold text-gold-400 text-sm block font-mono">
                      {formatPrice(c.totalSpent)}
                    </strong>
                    <span className="text-[9px] text-zinc-500">
                      {c.totalOrders > 0 ? `Avg: ${formatPrice(Math.round(c.totalSpent / c.totalOrders))}` : "No spend"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                        c.tier === "VIP Black"
                          ? "bg-zinc-950 text-gold-400 border-gold-500/50 shadow-sm"
                          : c.tier === "VIP Platinum"
                          ? "bg-gold-500/15 text-gold-400 border-gold-500/30"
                          : c.tier === "Valued VIP"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {c.tier.includes("VIP") && <Crown className="h-2.5 w-2.5 text-gold-400" />}
                      <span>{c.tier}</span>
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCustomer(c)}
                      className="text-[11px] h-8 px-2.5 border-zinc-700 hover:border-gold-500 hover:text-gold-400 text-zinc-300"
                    >
                      <span>View History</span>
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedCustomer(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold text-base">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white uppercase">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {selectedCustomer.email} • {selectedCustomer.tier}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-xs">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-bold block">Lifetime Orders</span>
                <strong className="text-white text-base font-mono">{selectedCustomer.totalOrders}</strong>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-bold block">Total Spend (LTV)</span>
                <strong className="text-gold-400 text-base font-mono">{formatPrice(selectedCustomer.totalSpent)}</strong>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase font-bold block">Registered Status</span>
                <strong className="text-emerald-400 text-xs block mt-1">
                  {selectedCustomer.isRegistered ? "Verified Account" : "Guest Checkout"}
                </strong>
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Order History ({selectedCustomer.orders.length})</span>
              </h4>

              {selectedCustomer.orders.length === 0 ? (
                <p className="text-xs text-zinc-500 italic p-4 text-center bg-zinc-950 rounded-lg">
                  No orders recorded yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedCustomer.orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">#{o.orderNumber}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-500/15 text-gold-400 font-bold">
                            {o.orderStatus}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })} • {o.items?.length || 1} items
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-white font-mono block">
                          {formatPrice(o.grandTotal)}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {o.paymentMethod} • {o.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCustomer(null)}
                className="border-zinc-700 text-zinc-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
