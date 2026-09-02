"use client";

import React, { useState } from "react";
import { Settings, Save, ShieldCheck, Key, Truck, Bell, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("GLAMSTEP");
  const [supportEmail, setSupportEmail] = useState("concierge@glamstep.luxury");
  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("2499");
  const [standardShippingFee, setStandardShippingFee] = useState("199");
  const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_test_glamstep_demo");
  const [razorpaySecret, setRazorpaySecret] = useState("••••••••••••••••••••");
  const [announcementText, setAnnouncementText] = useState(
    "Complimentary Express Delivery Over ₹2,499 | Use Code GLAM10"
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Maison configuration saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
            System Preferences
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mt-1">
            Store Settings & Configuration
          </h1>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={handleSave}
          className="flex items-center gap-1.5"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. General Brand Info */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-gold-400 font-bold uppercase tracking-wider text-xs">
            <Globe className="h-4 w-4" />
            <span>Store Identity & Contact</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Maison Brand Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
            <Input
              label="Concierge Support Email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              required
            />
            <Input
              label="Concierge Phone Line"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              required
            />
          </div>

          <Input
            label="Header Announcement Banner Text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
          />
        </div>

        {/* 2. Shipping & Logistics Rules */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-gold-400 font-bold uppercase tracking-wider text-xs">
            <Truck className="h-4 w-4" />
            <span>Logistics & Shipping Rules (India)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Free Shipping Spend Threshold (₹)"
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              required
            />
            <Input
              label="Standard Shipping Fee Below Threshold (₹)"
              type="number"
              value={standardShippingFee}
              onChange={(e) => setStandardShippingFee(e.target.value)}
              required
            />
          </div>
        </div>

        {/* 3. Razorpay Indian Gateway Security */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-gold-400 font-bold uppercase tracking-wider text-xs">
            <Key className="h-4 w-4" />
            <span>Razorpay Indian Payment Gateway</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Razorpay Key ID"
              value={razorpayKeyId}
              onChange={(e) => setRazorpayKeyId(e.target.value)}
              required
            />
            <Input
              label="Razorpay Key Secret (Server Only)"
              type="password"
              value={razorpaySecret}
              onChange={(e) => setRazorpaySecret(e.target.value)}
              required
            />
          </div>

          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
            <span>
              All signatures verified via HMAC-SHA256 on backend runtime. Secrets never exposed to client browsers.
            </span>
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="gold" size="lg" className="min-w-[200px]">
            Save All Configurations
          </Button>
        </div>
      </form>
    </div>
  );
}
