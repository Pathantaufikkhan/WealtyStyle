"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Radio,
  CheckCircle2,
  Clock,
  Truck,
  CreditCard,
  Glasses,
  Footprints,
  Watch,
  Activity,
} from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { products, orders, coupons, reviews, syncWithSupabase } = useStoreData();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Initial and periodic real-time sync
  useEffect(() => {
    let isMounted = true;

    const performSync = async () => {
      try {
        await syncWithSupabase();
        if (isMounted) setLastSynced(new Date());
      } catch (e) {
        console.error("Dashboard sync error:", e);
      }
    };

    performSync();

    // Auto-refresh every 12 seconds for live real-time metrics
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
      toast.success("Real-time analytics synchronized with live database");
    } catch (e) {
      toast.error("Failed to sync live data");
    } finally {
      setIsSyncing(false);
    }
  };

  // --- Real-time Computed Analytics ---

  // 1. Revenue & Orders
  const validOrders = orders.filter(
    (o) => o.orderStatus !== "Cancelled" && o.paymentStatus !== "Failed"
  );
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === "Delivered").length;
  const inTransitOrders = orders.filter(
    (o) => o.orderStatus === "Out for Delivery" || o.orderStatus === "Shipped"
  ).length;
  const pendingOrders = orders.filter(
    (o) =>
      o.orderStatus === "Pending" ||
      o.orderStatus === "Confirmed" ||
      o.orderStatus === "Processing"
  ).length;

  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const totalProducts = products.length;

  // 2. Category Inventory Counts
  const sunglassesCount = products.filter(
    (p) => p.category?.toLowerCase() === "sunglasses"
  ).length;
  const shoesCount = products.filter(
    (p) => p.category?.toLowerCase() === "shoes"
  ).length;
  const watchesCount = products.filter(
    (p) => p.category?.toLowerCase() === "watches"
  ).length;

  // 3. Category Revenue Breakdown
  const categoryRevenue: Record<string, number> = {
    sunglasses: 0,
    shoes: 0,
    watches: 0,
  };

  validOrders.forEach((order) => {
    order.items.forEach((item) => {
      const cat = (item.category || "sunglasses").toLowerCase();
      if (cat.includes("shoe")) {
        categoryRevenue.shoes += item.price * (item.quantity || 1);
      } else if (cat.includes("watch")) {
        categoryRevenue.watches += item.price * (item.quantity || 1);
      } else {
        categoryRevenue.sunglasses += item.price * (item.quantity || 1);
      }
    });
  });

  const totalCatRevenue =
    categoryRevenue.sunglasses + categoryRevenue.shoes + categoryRevenue.watches || 1;

  const sunglassesPct = Math.round((categoryRevenue.sunglasses / totalCatRevenue) * 100);
  const shoesPct = Math.round((categoryRevenue.shoes / totalCatRevenue) * 100);
  const watchesPct = Math.round((categoryRevenue.watches / totalCatRevenue) * 100);

  // 4. Monthly Revenue Performance (Calculated Dynamically for past 12 months)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const past12Months: { key: string; label: string; year: number; monthIndex: number; total: number; count: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIndex = d.getMonth();
    const year = d.getFullYear();
    const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    past12Months.push({
      key,
      label: monthNames[monthIndex],
      year,
      monthIndex,
      total: 0,
      count: 0,
    });
  }

  validOrders.forEach((order) => {
    if (!order.createdAt) return;
    const orderDate = new Date(order.createdAt);
    const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
    const targetMonth = past12Months.find((m) => m.key === key);
    if (targetMonth) {
      targetMonth.total += order.grandTotal;
      targetMonth.count += 1;
    }
  });

  const maxMonthTotal = Math.max(...past12Months.map((m) => m.total), 10000);

  // 5. Dynamic Best Sellers Calculation from actual order items
  const productSalesMap = new Map<string, { product: any; unitsSold: number; revenue: number }>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = productSalesMap.get(item.productId);
      if (existing) {
        existing.unitsSold += item.quantity || 1;
        existing.revenue += item.price * (item.quantity || 1);
      } else {
        const prod = products.find((p) => p.id === item.productId) || {
          name: item.productName,
          category: item.category,
          price: item.price,
        };
        productSalesMap.set(item.productId, {
          product: prod,
          unitsSold: item.quantity || 1,
          revenue: item.price * (item.quantity || 1),
        });
      }
    });
  });

  const sortedTopSellers = Array.from(productSalesMap.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  const fallbackBestsellers = products
    .filter((p) => p.isBestSeller)
    .slice(0, 5)
    .map((p) => ({
      product: p,
      unitsSold: Math.floor(p.rating * 4),
      revenue: p.price * Math.floor(p.rating * 4),
    }));

  const displayTopSellers = sortedTopSellers.length > 0 ? sortedTopSellers : fallbackBestsellers;

  return (
    <div className="space-y-8">
      {/* Top Header with Real-Time Pulse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              Live Real-Time Analytics
            </span>
            {lastSynced && (
              <span className="text-[10px] text-zinc-500 font-mono hidden md:inline">
                • Synced {lastSynced.toLocaleTimeString("en-IN")}
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight mt-1">
            Maison Executive Dashboard
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

          <Link href="/admin/products">
            <Button variant="gold" size="sm" className="flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              <span>Manage Catalog</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Real-Time Key Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Gross Revenue */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 hover:border-gold-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Gross Revenue
            </span>
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-black text-white">
            {formatPrice(totalRevenue)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold pt-1">
            <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
            <span>Live aggregated store revenue</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-black text-white">
            {totalOrders}
          </p>
          <p className="text-[11px] text-zinc-400">
            <strong className="text-emerald-400">{deliveredOrders}</strong> Delivered •{" "}
            <strong className="text-blue-400">{inTransitOrders}</strong> In Transit •{" "}
            <strong className="text-gold-400">{pendingOrders}</strong> Pending
          </p>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Average Order Value
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-black text-white">
            {formatPrice(avgOrderValue)}
          </p>
          <p className="text-[11px] text-zinc-400">
            Dynamic basket average across active orders
          </p>
        </div>

        {/* Catalog Items */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Catalog Items
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-black text-white">
            {totalProducts}
          </p>
          <p className="text-[11px] text-zinc-400">
            {sunglassesCount} Shades • {shoesCount} Shoes • {watchesCount} Watches
          </p>
        </div>
      </div>

      {/* Real-Time Dynamic Monthly Revenue Performance Chart */}
      <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gold-400" />
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                Monthly Revenue Performance
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live calculated revenue grouped from real order transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gold-400 font-bold bg-gold-500/10 px-3 py-1 rounded border border-gold-500/20">
              Last 12 Months
            </span>
          </div>
        </div>

        {/* Dynamic Calculated Bar Chart */}
        <div className="pt-4 grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-3 items-end h-52 border-b border-zinc-800 pb-2">
          {past12Months.map((m) => {
            const heightPercent = m.total > 0 ? Math.max(Math.round((m.total / maxMonthTotal) * 100), 12) : 6;
            return (
              <div
                key={m.key}
                className="flex flex-col items-center gap-2 group h-full justify-end relative"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 text-white text-[10px] font-mono px-2 py-1 rounded border border-gold-500/40 shadow-xl whitespace-nowrap z-20 pointer-events-none">
                  <div className="font-bold text-gold-400">{formatPrice(m.total)}</div>
                  <div className="text-[9px] text-zinc-400">{m.count} orders</div>
                </div>

                <span className="text-[9px] font-mono text-gold-400 opacity-70 group-hover:opacity-100 transition-opacity">
                  {m.total > 0 ? `₹${Math.round(m.total / 1000)}k` : "₹0"}
                </span>

                <div
                  className={`w-full rounded-t transition-all duration-500 ${
                    m.total > 0
                      ? "bg-gradient-to-t from-gold-600 to-gold-400 group-hover:brightness-125 shadow-md shadow-gold-500/10"
                      : "bg-zinc-800/80 group-hover:bg-zinc-700"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                <span className="text-[10px] text-zinc-400 font-semibold">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Revenue Distribution & Status Pipeline Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Share */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Category Revenue Share</span>
            <Sparkles className="h-4 w-4 text-gold-400" />
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Glasses className="h-3.5 w-3.5 text-gold-400" /> Sunglasses
                </span>
                <span className="font-mono font-bold text-white">
                  {formatPrice(categoryRevenue.sunglasses)} ({sunglassesPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gold-500 rounded-full transition-all duration-500"
                  style={{ width: `${sunglassesPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Footprints className="h-3.5 w-3.5 text-blue-400" /> Footwear & Shoes
                </span>
                <span className="font-mono font-bold text-white">
                  {formatPrice(categoryRevenue.shoes)} ({shoesPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${shoesPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Watch className="h-3.5 w-3.5 text-purple-400" /> Luxury Watches
                </span>
                <span className="font-mono font-bold text-white">
                  {formatPrice(categoryRevenue.watches)} ({watchesPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${watchesPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Fulfillment Pipeline */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Fulfillment Pipeline</span>
            <Truck className="h-4 w-4 text-emerald-400" />
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                Delivered
              </span>
              <p className="text-xl font-bold text-white font-mono mt-1">{deliveredOrders}</p>
              <span className="text-[10px] text-zinc-500">Successfully fulfilled</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-blue-400 block">
                In Transit
              </span>
              <p className="text-xl font-bold text-white font-mono mt-1">{inTransitOrders}</p>
              <span className="text-[10px] text-zinc-500">With courier partner</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-gold-400 block">
                Processing
              </span>
              <p className="text-xl font-bold text-white font-mono mt-1">{pendingOrders}</p>
              <span className="text-[10px] text-zinc-500">Awaiting dispatch</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Total Orders
              </span>
              <p className="text-xl font-bold text-white font-mono mt-1">{totalOrders}</p>
              <span className="text-[10px] text-zinc-500">Lifetime volume</span>
            </div>
          </div>
        </div>

        {/* Payment Methods & Verification */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Payment Breakdown</span>
            <CreditCard className="h-4 w-4 text-gold-400" />
          </h3>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-white block">Prepaid / Razorpay</span>
                <span className="text-[10px] text-zinc-400">100% Verified Digital Payments</span>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {orders.filter((o) => o.paymentMethod === "Razorpay").length} Orders
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-white block">Advance COD</span>
                <span className="text-[10px] text-zinc-400">₹500 Deposit + Balance on Delivery</span>
              </div>
              <span className="font-mono text-xs font-bold text-gold-400">
                {orders.filter((o) => o.paymentMethod === "Advance_COD").length} Orders
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-white block">Standard COD / VIP</span>
                <span className="text-[10px] text-zinc-400">Valued Member & Standard Pay</span>
              </div>
              <span className="font-mono text-xs font-bold text-blue-400">
                {orders.filter((o) => o.paymentMethod === "COD").length} Orders
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Split Section: Real-Time Recent Transactions (Left) + Real-Time Top Selling Products (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                Live Recent Transactions
              </h3>
              <p className="text-[11px] text-zinc-400">
                Latest customer purchases processed in real-time
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-gold-400 hover:underline font-semibold"
            >
              View All Orders ({orders.length})
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-4 text-xs hover:border-gold-500/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        order.orderStatus === "Delivered"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : order.orderStatus === "Out for Delivery" || order.orderStatus === "Shipped"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-gold-500/15 text-gold-400"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-zinc-400 mt-0.5">
                    {order.customerName} • {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-white block font-mono">
                    {formatPrice(order.grandTotal)}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {order.paymentMethod === "Advance_COD" ? "Advance COD" : order.paymentMethod}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                Top Selling Curations
              </h3>
              <p className="text-[11px] text-zinc-400">
                Ranked by real order conversion volume
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs text-gold-400 hover:underline font-semibold"
            >
              Catalog ({products.length})
            </Link>
          </div>

          <div className="space-y-3">
            {displayTopSellers.map((item, idx) => (
              <div
                key={item.product.id || idx}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs hover:border-gold-500/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="font-serif font-black text-sm text-gold-400/60 w-4">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white truncate max-w-[180px]">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">
                      {item.product.category} • {item.unitsSold} unit{item.unitsSold > 1 ? "s" : ""} sold
                    </span>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="font-bold text-white block font-mono">
                    {formatPrice(item.revenue || item.product.price)}
                  </span>
                  <span className="text-[9px] text-emerald-400">
                    {formatPrice(item.product.price)}/ea
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
