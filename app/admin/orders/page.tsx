"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown,
  Download,
  Search,
  Filter,
  RefreshCw,
  Radio,
  DollarSign,
  Package,
} from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { downloadOrderInvoicePDF } from "@/lib/utils/invoice";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/types";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, syncWithSupabase } = useStoreData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Auto-sync orders continuously in real-time
  useEffect(() => {
    let isMounted = true;
    const performSync = async () => {
      try {
        await syncWithSupabase();
        if (isMounted) setLastSynced(new Date());
      } catch (e) {
        console.error("Orders sync error:", e);
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
      toast.success("Orders synchronized in real-time");
    } catch (e) {
      toast.error("Failed to sync orders");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleStatusChange = async (order: any, newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus);

    try {
      // 1. Update status in Supabase Database
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          orderId: order.id,
          status: newStatus,
        }),
      });

      // 2. Trigger automated email notifications to customer and admin
      fetch("/api/orders/notify-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: { ...order, orderStatus: newStatus },
          status: newStatus,
          orderNumber: order.orderNumber,
          orderId: order.id,
        }),
      }).catch((e) => console.error("Status notification email trigger error:", e));

      if (newStatus === "Shipped") {
        toast.success(`Order #${order.orderNumber} marked as Shipped! Dispatch emails sent to customer & admin.`);
      } else if (newStatus === "Out for Delivery") {
        toast.success(`Order #${order.orderNumber} is Out for Delivery! Customer received confirmation email link.`);
      } else if (newStatus === "Delivered") {
        toast.success(`Order #${order.orderNumber} marked as Delivered! Confirmation emails sent.`);
      } else {
        toast.success(`Updated order #${order.orderNumber} status to "${newStatus}"`);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const query = search.toLowerCase();
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.customerEmail.toLowerCase().includes(query) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(query));
    const matchesStatus = statusFilter === "all" || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const allStatuses: OrderStatus[] = [
    "Pending",
    "Paid",
    "Confirmed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Refunded",
  ];

  const totalOrders = orders.length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "Delivered").length;
  const inTransitCount = orders.filter(
    (o) => o.orderStatus === "Out for Delivery" || o.orderStatus === "Shipped"
  ).length;
  const pendingCount = orders.filter(
    (o) =>
      o.orderStatus === "Pending" ||
      o.orderStatus === "Confirmed" ||
      o.orderStatus === "Processing"
  ).length;
  const totalGross = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

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
              Live Real-Time Fulfillment
            </span>
            {lastSynced && (
              <span className="text-[10px] text-zinc-500 font-mono hidden md:inline">
                • Synced {lastSynced.toLocaleTimeString("en-IN")}
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mt-1">
            Customer Orders & Pipeline ({totalOrders})
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

      {/* 4 Pipeline Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Total Orders Logged
          </span>
          <p className="font-serif text-2xl font-black text-white">{totalOrders}</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <Radio className="h-3 w-3" /> Live active order streams
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Gross Fulfillment Value
          </span>
          <p className="font-serif text-2xl font-black text-gold-400">{formatPrice(totalGross)}</p>
          <span className="text-[11px] text-zinc-400">Total pipeline gross</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            In Transit & Dispatch
          </span>
          <p className="font-serif text-2xl font-black text-blue-400">{inTransitCount}</p>
          <span className="text-[11px] text-zinc-400">
            {pendingCount} awaiting courier pickup
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Successfully Delivered
          </span>
          <p className="font-serif text-2xl font-black text-emerald-400">{deliveredCount}</p>
          <span className="text-[11px] text-zinc-400">
            {Math.round((deliveredCount / (totalOrders || 1)) * 100)}% delivery completion
          </span>
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
            placeholder="Search by order #, customer, email, tracking..."
            className="w-full h-10 pl-9 pr-4 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-400 font-semibold">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-white font-medium focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Statuses ({orders.length})</option>
            {allStatuses.map((st) => (
              <option key={st} value={st}>
                {st} ({orders.filter((o) => o.orderStatus === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[1050px]">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-4 whitespace-nowrap">Order Ref</th>
                <th className="p-4 whitespace-nowrap">Customer</th>
                <th className="p-4 whitespace-nowrap">Date</th>
                <th className="p-4 whitespace-nowrap">Items</th>
                <th className="p-4 whitespace-nowrap">Total</th>
                <th className="p-4 whitespace-nowrap">Payment</th>
                <th className="p-4 whitespace-nowrap">Status Pipeline</th>
                <th className="p-4 text-right whitespace-nowrap">Tax Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-white block">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Tracking: {order.trackingNumber || "Pending Courier"}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <strong className="text-white block">{order.customerName}</strong>
                    <span className="text-[10px] text-zinc-400 font-mono">{order.customerEmail}</span>
                  </td>

                  <td className="p-4 text-zinc-400 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      dateStyle: "medium",
                    })}
                  </td>

                  <td className="p-4 max-w-[200px]">
                    <span className="font-semibold text-white">
                      {order.items.length} Product{order.items.length !== 1 ? "s" : ""}
                    </span>
                    <p
                      className="text-[10px] text-zinc-400 truncate max-w-[180px]"
                      title={order.items.map((i) => i.productName).join(", ")}
                    >
                      {order.items.map((i) => i.productName).join(", ")}
                    </p>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <strong className="text-gold-400 font-bold font-mono">
                      {formatPrice(order.grandTotal)}
                    </strong>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold block w-fit mb-1">
                      {order.paymentMethod === "Advance_COD" ? "Advance COD" : order.paymentMethod} • {order.paymentStatus}
                    </span>
                    {order.advancePaid !== undefined && order.advancePaid > 0 && order.paymentMethod === "Advance_COD" && (
                      <span className="text-[10px] text-zinc-400 block font-mono">
                        Adv: <strong className="text-emerald-400">₹{order.advancePaid}</strong> | Collect:{" "}
                        <strong className="text-gold-400">{formatPrice(order.balanceDue || 0)}</strong>
                      </span>
                    )}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                      className="h-8 px-2.5 rounded bg-zinc-950 border border-zinc-700 text-gold-400 font-semibold text-xs focus:outline-none focus:border-gold-500 cursor-pointer"
                    >
                      {allStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadOrderInvoicePDF(order)}
                      className="text-[11px] h-8 px-3 inline-flex items-center gap-1.5 border-zinc-700 hover:border-gold-500 hover:text-gold-400 text-zinc-200"
                    >
                      <Download className="h-3.5 w-3.5 text-gold-400" />
                      <span>Tax Invoice</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
