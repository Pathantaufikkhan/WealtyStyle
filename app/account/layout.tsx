"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Shield,
  Sparkles,
  Crown,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { cn } from "@/lib/utils/cn";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navItems = [
    { name: "Overview", href: "/account", icon: User },
    { name: "My Orders", href: "/account/orders", icon: ShoppingBag },
    { name: "Wishlist", href: "/account/wishlist", icon: Heart },
    { name: "Saved Addresses", href: "/account/addresses", icon: MapPin },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "W";

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Luxury Client Passport Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-gold-500/30 p-6 sm:p-8 shadow-2xl shadow-black/40">
          {/* Subtle Background Radial Gold Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-gold-500/5 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Identity Details */}
            <div className="flex items-center gap-5">
              {/* Luxury Monogram Avatar with Gold Ring */}
              <div className="relative flex-shrink-0">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-600 to-gold-700 p-0.5 shadow-lg shadow-gold-500/20">
                  <div className="h-full w-full rounded-[14px] bg-zinc-950 flex items-center justify-center">
                    <span className="font-serif text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold-200 via-gold-400 to-gold-600">
                      {initial}
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gold-500 text-zinc-950 flex items-center justify-center shadow-md ring-2 ring-zinc-950">
                  <Crown className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Name and Member Tier */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white capitalize">
                    {user?.fullName || "Valued Patron"}
                  </h1>
                  {user?.role === "admin" && (
                    <span className="text-[10px] bg-gradient-to-r from-gold-500 to-gold-400 text-zinc-950 font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                      Maison Admin
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 font-mono">{user?.email}</p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400">
                    <Sparkles className="h-3 w-3 text-gold-400" />
                    <span>WS Privilege • Black Diamond Tier</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-zinc-950 text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Suite</span>
                </Link>
              )}

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900/80 border border-zinc-700/80 text-zinc-300 text-xs font-semibold uppercase tracking-wider hover:border-gold-500/50 hover:text-gold-400 transition-colors"
              >
                <Headphones className="h-4 w-4 text-gold-400" />
                <span>Concierge</span>
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider hover:bg-rose-500/20 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Account Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-card border border-border/80 rounded-2xl p-4 space-y-2 shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 px-3 py-1 block">
              Client Portal
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all relative overflow-hidden",
                    isActive
                      ? "bg-gold-500/15 text-gold-600 dark:text-gold-400 font-bold border border-gold-500/30 shadow-sm"
                      : "text-foreground/80 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-gold-500" : "text-zinc-400"
                    )}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-gold-500 rounded-r-full" />
                  )}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-border mt-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 transition-colors w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Account Main Content */}
          <main className="lg:col-span-9 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
