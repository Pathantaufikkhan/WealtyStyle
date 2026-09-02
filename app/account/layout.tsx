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

  return (
    <div className="min-h-screen bg-background py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header User Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-600 dark:text-gold-400 font-serif font-black text-2xl flex items-center justify-center">
              {user?.fullName?.[0] || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  {user?.fullName || "Valued Client"}
                </h1>
                {user?.role === "admin" && (
                  <span className="text-[10px] bg-gold-500 text-zinc-950 font-bold px-2 py-0.5 rounded">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500">{user?.email}</p>
            </div>
          </div>

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gold-500 text-zinc-950 text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-gold-400 transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>Enter Admin Suite</span>
            </Link>
          )}
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Account Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-card rounded-xl border border-border p-4 space-y-1.5 shadow-sm">
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
                    isActive
                      ? "bg-gold-500/15 text-gold-600 dark:text-gold-400 font-bold"
                      : "text-foreground/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 text-gold-500" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-border mt-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 transition-colors w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Account Sub-page Content */}
          <main className="lg:col-span-9 bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
