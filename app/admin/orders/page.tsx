"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { OrderStatus } from "@/types";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStoreData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
            Fulfillment Center
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mt-1">
            Customer Orders ({orders.length})
          </h1>
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
            placeholder="Search by order #, customer, or email..."
            className="w-full h-10 pl-9 pr-4 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-400 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-white font-medium focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Statuses</option>
            {allStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status Pipeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-white block">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Tracking: {order.trackingNumber || "N/A"}
                    </span>
                  </td>

                  <td className="p-4">
                    <strong className="text-white block">{order.customerName}</strong>
                    <span className="text-[10px] text-zinc-400">{order.customerEmail}</span>
                  </td>

                  <td className="p-4 text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-white">
                      {order.items.length} Products
                    </span>
                    <p className="text-[10px] text-zinc-500 truncate max-w-[150px]">
                      {order.items.map((i) => i.productName).join(", ")}
                    </p>
                  </td>

                  <td className="p-4">
                    <strong className="text-gold-400 font-bold">
                      {formatPrice(order.grandTotal)}
                    </strong>
                  </td>

                  <td className="p-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold block w-fit mb-1">
                      {order.paymentMethod === "Advance_COD" ? "Advance COD" : order.paymentMethod} • {order.paymentStatus}
                    </span>
                    {order.advancePaid !== undefined && order.advancePaid > 0 && order.paymentMethod === "Advance_COD" && (
                      <span className="text-[10px] text-zinc-400 block font-mono">
                        Adv: <strong className="text-emerald-400">₹{order.advancePaid}</strong> | Collect: <strong className="text-gold-400">{formatPrice(order.balanceDue || 0)}</strong>
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value as OrderStatus;
                        updateOrderStatus(order.id, newStatus);
                        toast.success(`Updated order #${order.orderNumber} status to "${newStatus}"`);
                      }}
                      className="h-8 px-2.5 rounded bg-zinc-950 border border-zinc-700 text-gold-400 font-semibold text-xs focus:outline-none focus:border-gold-500"
                    >
                      {allStatuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
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
