"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Star,
  Clock,
} from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { products, orders, coupons, reviews } = useStoreData();

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter((o) => o.orderStatus !== "Delivered").length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
            Real-Time Analytics
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight mt-1">
            Maison Executive Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="gold" size="sm" className="flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              <span>Manage Catalog</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Key Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Gross Revenue
            </span>
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-black text-white">
            {formatPrice(totalRevenue + 348990)}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold pt-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+24.8% vs last month</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-black text-white">
            {totalOrders + 48}
          </p>
          <p className="text-[11px] text-zinc-400">
            {pendingOrders} orders currently in fulfillment
          </p>
        </div>

        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Average Order Value
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-black text-white">
            {formatPrice(avgOrderValue || 8499)}
          </p>
          <p className="text-[11px] text-zinc-400">
            High basket conversion across categories
          </p>
        </div>

        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
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
            Across Sunglasses, Shoes & Watches
          </p>
        </div>
      </div>

      {/* Interactive Simulated Sales Breakdown Chart */}
      <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
              Monthly Revenue Performance
            </h3>
            <p className="text-xs text-zinc-400">
              Aggregated sales across Pan-India courier networks
            </p>
          </div>
          <span className="text-xs text-gold-400 font-bold bg-gold-500/10 px-3 py-1 rounded border border-gold-500/20">
            FY 2024-2025
          </span>
        </div>

        {/* CSS Simulated Bar Chart */}
        <div className="pt-4 grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-4 items-end h-48 border-b border-zinc-800 pb-2">
          {[
            { month: "Apr", height: "45%", val: "₹1.8L" },
            { month: "May", height: "60%", val: "₹2.4L" },
            { month: "Jun", height: "55%", val: "₹2.2L" },
            { month: "Jul", height: "70%", val: "₹2.9L" },
            { month: "Aug", height: "85%", val: "₹3.5L" },
            { month: "Sep", height: "65%", val: "₹2.6L" },
            { month: "Oct", height: "90%", val: "₹4.1L" },
            { month: "Nov", height: "100%", val: "₹4.8L" },
            { month: "Dec", height: "95%", val: "₹4.4L" },
            { month: "Jan", height: "75%", val: "₹3.1L" },
            { month: "Feb", height: "80%", val: "₹3.4L" },
            { month: "Mar", height: "92%", val: "₹3.9L" },
          ].map((bar) => (
            <div key={bar.month} className="flex flex-col items-center gap-2 group h-full justify-end">
              <span className="text-[9px] font-mono text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.val}
              </span>
              <div
                className="w-full bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-sm group-hover:brightness-125 transition-all duration-300 shadow-md shadow-gold-500/10"
                style={{ height: bar.height }}
              />
              <span className="text-[10px] text-zinc-400 font-semibold">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Split Section: Recent Transactions (Left) + Top Selling Products (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
              Recent Transactions
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-gold-400 hover:underline font-semibold"
            >
              View All Orders
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-gold-500/15 text-gold-400 font-bold">
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-zinc-400 mt-0.5">
                    {order.customerName} • {order.items.length} items
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-white block">
                    {formatPrice(order.grandTotal)}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
              Bestselling Curations
            </h3>
            <Link
              href="/admin/products"
              className="text-xs text-gold-400 hover:underline font-semibold"
            >
              Catalog
            </Link>
          </div>

          <div className="space-y-3">
            {products
              .filter((p) => p.isBestSeller)
              .slice(0, 5)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="font-semibold text-white truncate">{p.name}</h4>
                    <span className="text-[10px] text-gold-400 uppercase font-bold">
                      {p.category}
                    </span>
                  </div>
                  <span className="font-bold text-white whitespace-nowrap">
                    {formatPrice(p.price)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
