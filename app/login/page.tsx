"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WealthStyleLogo } from "@/components/ui/WealthStyleLogo";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("siddharth.verma@glamstep.luxury");
  const [password, setPassword] = useState("luxury2025");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Demo admin vs customer credentials check
      const isAdmin = email.includes("admin") || email === "admin@glamstep.luxury";

      login({
        id: isAdmin ? "usr-admin-01" : "usr-demo-01",
        email,
        fullName: isAdmin ? "Maison Administrator" : "Siddharth Verma",
        phone: "9876543210",
        role: isAdmin ? "admin" : "customer",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        savedAddresses: [
          {
            fullName: "Siddharth Verma",
            email: "siddharth.verma@glamstep.luxury",
            phone: "9876543210",
            houseFlat: "Penthouse 1402, Tower 4",
            street: "Golf Course Road",
            area: "DLF Phase 5",
            city: "Gurugram",
            state: "Haryana",
            pincode: "122002",
            isDefault: true,
          },
        ],
        createdAt: new Date().toISOString(),
      });

      setIsLoading(false);
      toast.success(isAdmin ? "Welcome back, Administrator!" : "Welcome back to GLAMSTEP!");
      router.push(isAdmin ? "/admin" : "/account");
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <WealthStyleLogo variant="stacked" size="md" href="/" />
          <p className="text-xs text-zinc-500 pt-1">
            Access your orders, saved wishlists, and personalized concierges.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
            required
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-[11px] text-gold-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            isLoading={isLoading}
            className="w-full h-12 flex items-center justify-center gap-2 mt-2 font-bold tracking-widest text-xs"
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-border/60 text-xs space-y-2">
          <p className="font-bold text-foreground text-[11px] uppercase tracking-wider">
            Demo Credentials (1-Click Fill)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail("siddharth.verma@glamstep.luxury");
                setPassword("luxury2025");
              }}
              className="px-2.5 py-1.5 rounded bg-background border border-border hover:border-gold-500 text-left text-[11px]"
            >
              <strong className="block text-foreground">Customer</strong>
              <span className="text-zinc-400">siddharth@...</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@glamstep.luxury");
                setPassword("luxury2025");
              }}
              className="px-2.5 py-1.5 rounded bg-gold-500/10 border border-gold-500/30 text-left text-[11px] text-gold-600 dark:text-gold-400"
            >
              <strong className="block">Admin Panel</strong>
              <span>admin@...</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="pt-2 text-center text-xs text-zinc-500">
          <span>Don&apos;t have an account yet? </span>
          <Link href="/register" className="text-gold-500 font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
