"use client";

import React, { useState } from "react";
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
  Layers,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { WealthStyleLogo } from "@/components/ui/WealthStyleLogo";
import { cn } from "@/lib/utils/cn";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminNav = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products Catalog", href: "/admin/products", icon: Package },
    { name: "Customer Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Coupons & Offers", href: "/admin/coupons", icon: Ticket },
    { name: "Review Moderation", href: "/admin/reviews", icon: MessageSquare },
    { name: "Client Directory", href: "/admin/customers", icon: Users },
    { name: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row">
      {/* Mobile Admin Bar */}
      <div className="lg:hidden p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
        <WealthStyleLogo variant="horizontal" size="xs" href="/admin" />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white"
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
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 mb-4">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Storefront</span>
            </Link>
            <div className="pt-1">
              <WealthStyleLogo variant="horizontal" size="sm" href="/admin" />
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-[10px] text-gold-400 font-bold uppercase tracking-wider">
                <Shield className="h-3 w-3" />
                <span>Admin Suite</span>
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
        <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400">
          <p className="font-bold text-white">Administrator Mode</p>
          <p className="text-[11px] text-zinc-500">Master Secret Verified</p>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
