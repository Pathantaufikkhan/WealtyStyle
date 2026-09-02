"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, CheckCircle2, Clock, ChevronDown, Download, AlertCircle } from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";

export default function AccountOrdersPage() {
  const { orders } = useStoreData();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders[0]?.id || null
  );

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "Out for Delivery":
      case "Shipped":
        return "bg-gold-500/15 text-gold-600 dark:text-gold-400 border-gold-500/30";
      case "Processing":
      case "Confirmed":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "Cancelled":
      case "Refunded":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
      default:
        return "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
          Shipment Tracking
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight mt-1">
          Order History ({orders.length})
        </h2>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="rounded-xl bg-card border border-border/80 shadow-sm overflow-hidden transition-all"
              >
                {/* Order Header Summary Bar */}
                <div
                  onClick={() => toggleOrder(order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-foreground">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-zinc-400 block">Grand Total</span>
                      <span className="text-sm font-bold text-gold-500">
                        {formatPrice(order.grandTotal)}
                      </span>
                    </div>

                    <ChevronDown
                      className={`h-5 w-5 text-zinc-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Order Content */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t border-border bg-zinc-50/50 dark:bg-zinc-950/40 space-y-6">
                    {/* Live Tracking Milestones */}
                    <div className="p-4 rounded-lg bg-card border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                          <Truck className="h-4 w-4 text-gold-500" />
                          <span>Delivery Status</span>
                        </span>
                        {order.trackingNumber && (
                          <span className="text-xs font-mono text-zinc-400">
                            Tracking: <strong className="text-gold-500">{order.trackingNumber}</strong>
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-900 border border-border">
                          <span className="text-emerald-500 font-bold block">✓ Confirmed</span>
                          <span className="text-[10px] text-zinc-500">Payment verified</span>
                        </div>
                        <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-900 border border-border">
                          <span className="text-emerald-500 font-bold block">✓ Processing</span>
                          <span className="text-[10px] text-zinc-500">Inspected & Packed</span>
                        </div>
                        <div className={`p-2 rounded border ${order.orderStatus === "Shipped" || order.orderStatus === "Out for Delivery" || order.orderStatus === "Delivered" ? "bg-zinc-50 dark:bg-zinc-900 text-emerald-500 font-bold" : "text-zinc-400"}`}>
                          <span>In Transit</span>
                          <span className="text-[10px] text-zinc-500 block">Bluedart Air</span>
                        </div>
                        <div className={`p-2 rounded border ${order.orderStatus === "Delivered" ? "bg-zinc-50 dark:bg-zinc-900 text-emerald-500 font-bold" : "text-zinc-400"}`}>
                          <span>Delivered</span>
                          <span className="text-[10px] text-zinc-500 block">Doorstep receipt</span>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="space-y-3 divide-y divide-border/60">
                      {order.items.map((item) => (
                        <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-14 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-border flex-shrink-0">
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-foreground">
                                {item.productName}
                              </h4>
                              <p className="text-[11px] text-zinc-400">
                                Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ""} {item.selectedSize ? `• ${item.selectedSize}` : ""}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address & Receipt */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border text-xs">
                      <div className="text-zinc-500">
                        <strong className="text-foreground block mb-0.5 uppercase tracking-wider">
                          Delivered To:
                        </strong>
                        <p>
                          {order.shippingAddress.fullName}, {order.shippingAddress.houseFlat}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Downloaded invoice PDF for ${order.orderNumber}`)}
                        className="flex items-center gap-1.5 text-xs whitespace-nowrap"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Tax Invoice</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-xs text-zinc-500">
          You have not placed any orders yet.
        </div>
      )}
    </div>
  );
}
