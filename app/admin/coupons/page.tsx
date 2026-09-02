"use client";

import React, { useState } from "react";
import { Ticket, Plus, Trash2, CheckCircle2, XCircle, X } from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coupon } from "@/types";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const { coupons, addCoupon, toggleCouponActive, deleteCoupon } = useStoreData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 10,
    minOrderValue: 2000,
    maxDiscount: 2000,
    usageLimit: 500,
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }

    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || `${form.discountValue}% off order`,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue),
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      expiryDate: "2026-12-31T23:59:59Z",
      usageLimit: Number(form.usageLimit),
      usedCount: 0,
      isActive: true,
    };

    addCoupon(newCoupon);
    toast.success(`Coupon code ${newCoupon.code} created successfully!`);
    setIsModalOpen(false);
    setForm({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderValue: 2000,
      maxDiscount: 2000,
      usageLimit: 500,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
            Promotions & Campaigns
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mt-1">
            Coupon Management ({coupons.length})
          </h1>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Coupon</span>
        </Button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Description</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Min Spend</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-gold-400 text-sm">
                    {coupon.code}
                  </td>
                  <td className="p-4 text-white font-medium">{coupon.description}</td>
                  <td className="p-4 font-semibold text-white">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% OFF`
                      : formatPrice(coupon.discountValue)}
                  </td>
                  <td className="p-4 text-zinc-400">{formatPrice(coupon.minOrderValue)}</td>
                  <td className="p-4 text-zinc-400">
                    {coupon.usedCount} / {coupon.usageLimit || "∞"} used
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        toggleCouponActive(coupon.id);
                        toast.success(`Coupon ${coupon.code} status toggled`);
                      }}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        coupon.isActive
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        deleteCoupon(coupon.id);
                        toast.info(`Deleted coupon ${coupon.code}`);
                      }}
                      className="p-1.5 rounded bg-zinc-800 hover:bg-rose-500 text-zinc-400 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-serif text-lg font-bold text-white uppercase">
                Create Promo Coupon
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <Input
                label="Coupon Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. LUXE25"
                required
              />

              <Input
                label="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="e.g. 25% discount on Italian shoes"
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                    Discount Type
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discountType: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="w-full h-11 px-3 rounded-sm border border-zinc-800 bg-zinc-950 text-white text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <Input
                  label="Discount Value"
                  type="number"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm({ ...form, discountValue: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Min Order Spend (₹)"
                  type="number"
                  value={form.minOrderValue}
                  onChange={(e) =>
                    setForm({ ...form, minOrderValue: Number(e.target.value) })
                  }
                />
                <Input
                  label="Usage Limit"
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) =>
                    setForm({ ...form, usageLimit: Number(e.target.value) })
                  }
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gold" className="flex-1">
                  Create Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
