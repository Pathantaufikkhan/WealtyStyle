"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Ticket,
  MessageSquare,
  Users,
  Settings,
  Shield,
  ShieldAlert,
  Lock,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { WealthStyleLogo } from "@/components/ui/WealthStyleLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, verifyAdminPasskey, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePasskeyUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) {
      toast.error("Please enter your administrator passkey");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const isValid = verifyAdminPasskey(passkeyInput);
      setIsVerifying(false);
      if (isValid) {
        toast.success("Administrator clearance granted. Welcome to Maison Admin!");
        setPasskeyInput("");
      } else {
        toast.error("Invalid administrator passkey. Access denied.");
      }
    }, 400);
  };

  // Nav items
  const adminNav = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products Catalog", href: "/admin/products", icon: Package },
    { name: "Customer Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Coupons & Offers", href: "/admin/coupons", icon: Ticket },
    { name: "Review Moderation", href: "/admin/reviews", icon: MessageSquare },
    { name: "Client Directory", href: "/admin/customers", icon: Users },
    { name: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  // 1. Loading State while Zustand hydrates
  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 space-y-4">
        <div className="h-10 w-10 rounded-full border-2 border-gold-500/20 border-t-gold-500 animate-spin" />
        <p className="text-xs uppercase tracking-widest text-gold-400 font-mono">
          Verifying Maison Admin Clearance...
        </p>
      </div>
    );
  }

  // 2. Access Denied Security Guard if NOT an Admin
  const isAuthorized = isAuthenticated && (isAdmin || user?.role === "admin");

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient Security Glow */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

        <div className="w-full max-w-lg bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative z-10 backdrop-blur-md">
          {/* Logo & Warning Header */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <WealthStyleLogo variant="stacked" size="md" href="/" />

            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mt-2 shadow-lg shadow-rose-500/10">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 block">
                Restricted Clearance Zone
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mt-0.5">
                Admin Access Required
              </h2>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              This portal is restricted to authorized WEALTHY STYLE Maison Executives and System Administrators only.
            </p>
          </div>

          {/* Current Session Info */}
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Current Session:</span>
              <strong className="text-zinc-200">{user?.email || "Unauthenticated Guest"}</strong>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Account Role:</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                {user?.role || "Visitor"}
              </span>
            </div>
          </div>

          {/* Quick Admin Passkey Unlock Form */}
          <form onSubmit={handlePasskeyUnlock} className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-gold-400" />
                <span>Enter Admin Master Passkey</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500 transition-colors font-mono"
                  required
                />
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  isLoading={isVerifying}
                  className="px-4 font-bold text-xs uppercase tracking-wider whitespace-nowrap"
                >
                  Unlock
                </Button>
              </div>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-1.5 text-xs text-zinc-300 border-zinc-700 hover:bg-zinc-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Store</span>
              </Button>
            </Link>

            <Link href="/login" className="flex-1">
              <Button
                variant="gold"
                size="sm"
                className="w-full flex items-center justify-center gap-1.5 text-xs"
              >
                <span>Login with Admin ID</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized Admin UI View
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row">
      {/* Mobile Admin Bar */}
      <div className="lg:hidden p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <WealthStyleLogo variant="horizontal" size="xs" href="/admin" />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white"
          aria-label="Toggle admin menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={cn(
          "w-full lg:w-72 bg-zinc-900/90 border-r border-zinc-800 p-6 flex flex-col justify-between flex-shrink-0 lg:min-h-screen",
          isMobileMenuOpen ? "block" : "hidden lg:flex"
        )}
      >
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="pb-4 border-b border-zinc-800">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 mb-4 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Storefront</span>
            </Link>
            <div className="pt-1">
              <WealthStyleLogo variant="horizontal" size="sm" href="/admin" />
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-[10px] text-gold-400 font-bold uppercase tracking-wider">
                <Shield className="h-3 w-3" />
                <span>Executive Admin Suite</span>
              </div>
            </div>
          </div>

          {/* Admin Nav List */}
          <nav className="space-y-1.5">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
                    isActive
                      ? "bg-gold-500 text-zinc-950 font-bold shadow-md shadow-gold-500/10"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin User */}
        <div className="pt-6 border-t border-zinc-800 space-y-3">
          <div className="text-xs text-zinc-400">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              <span>{user?.fullName || "Administrator"}</span>
            </p>
            <p className="text-[11px] text-zinc-500 font-mono truncate">{user?.email}</p>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition-colors w-full"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out of Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
