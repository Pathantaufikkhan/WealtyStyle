"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Home,
  Glasses,
  Footprints,
  Watch,
  Sparkles,
  Percent,
  User,
  Heart,
  ShoppingBag,
  Search,
  LogOut,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { WealthStyleLogo } from "@/components/ui/WealthStyleLogo";
import { cn } from "@/lib/utils/cn";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { getItemCount, toggleCartDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const cartCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const categories = [
    { name: "Home", href: "/", icon: Home },
    { name: "Sunglasses", href: "/sunglasses", icon: Glasses, count: "10 items" },
    { name: "Shoes", href: "/shoes", icon: Footprints, count: "10 items" },
    { name: "Watches", href: "/watches", icon: Watch, count: "10 items" },
    { name: "New Arrivals", href: "/new-arrivals", icon: Sparkles, badge: "NEW" },
    { name: "Deals & Offers", href: "/offers", icon: Percent, isSale: true },
  ];

  return (
    <>
      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-background border-r border-border shadow-2xl flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              {/* Top Header */}
              <div className="p-5 border-b border-border flex items-center justify-between">
                <WealthStyleLogo variant="horizontal" size="sm" href="/" />
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-5 space-y-2 flex-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-3">
                  Categories & Collections
                </p>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = pathname === cat.href;
                  return (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-md transition-all text-sm font-medium",
                        isActive
                          ? "bg-gold-500/10 text-gold-600 dark:text-gold-400 font-semibold"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-gold-500" />
                        <span>{cat.name}</span>
                      </div>
                      {cat.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-500 text-zinc-950 font-black">
                          {cat.badge}
                        </span>
                      )}
                      {cat.count && (
                        <span className="text-[11px] text-zinc-400">
                          {cat.count}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-border mt-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-3">
                    Account & Concierge
                  </p>
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/account"
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm font-medium"
                      >
                        <User className="h-4 w-4 text-gold-500" />
                        <span>My Account ({user?.fullName})</span>
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm font-medium"
                      >
                        <Shield className="h-4 w-4 text-gold-500" />
                        <span>Order History & Tracking</span>
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={onClose}
                          className="flex items-center gap-3 p-3 rounded-md bg-gold-500/15 text-gold-600 dark:text-gold-400 text-sm font-bold"
                        >
                          <Shield className="h-4 w-4 text-gold-500" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          onClose();
                        }}
                        className="flex items-center gap-3 p-3 rounded-md text-rose-500 hover:bg-rose-500/10 text-sm font-medium w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <Link
                        href="/login"
                        onClick={onClose}
                        className="block w-full text-center py-2.5 px-4 rounded bg-zinc-900 text-zinc-50 dark:bg-gold-500 dark:text-zinc-950 text-xs font-bold uppercase tracking-wider"
                      >
                        Sign In / Register
                      </Link>
                    </div>
                  )}

                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm font-medium mt-2"
                  >
                    <HelpCircle className="h-4 w-4 text-gold-500" />
                    <span>Customer Concierge & Help</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="p-5 border-t border-border bg-zinc-50/50 dark:bg-zinc-950/50 text-[11px] text-zinc-400">
                <p className="font-semibold text-foreground">WEALTHY STYLE Luxury Concierge</p>
                <p>concierge@wealthstyle.luxury</p>
                <p>+91 (800) WEALTHY-STYLE</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Persistent Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border py-2 px-3 flex items-center justify-around lg:hidden shadow-lg">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-semibold tracking-wider uppercase",
            pathname === "/" ? "text-gold-500 font-bold" : "text-zinc-400"
          )}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/sunglasses"
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-semibold tracking-wider uppercase",
            pathname.startsWith("/sunglasses") || pathname.startsWith("/shoes") || pathname.startsWith("/watches")
              ? "text-gold-500 font-bold"
              : "text-zinc-400"
          )}
        >
          <Glasses className="h-5 w-5" />
          <span>Shop</span>
        </Link>

        <Link
          href="/account/wishlist"
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-semibold tracking-wider uppercase relative",
            pathname === "/account/wishlist" ? "text-gold-500 font-bold" : "text-zinc-400"
          )}
        >
          <Heart className="h-5 w-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-2 h-3.5 w-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span>Wishlist</span>
        </Link>

        <button
          onClick={() => toggleCartDrawer(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-zinc-400 relative"
        >
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-1 h-3.5 w-3.5 rounded-full bg-gold-500 text-zinc-950 text-[9px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span>Bag</span>
        </button>

        <Link
          href={isAuthenticated ? "/account" : "/login"}
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-semibold tracking-wider uppercase",
            pathname.startsWith("/account") || pathname === "/login"
              ? "text-gold-500 font-bold"
              : "text-zinc-400"
          )}
        >
          <User className="h-5 w-5" />
          <span>Account</span>
        </Link>
      </div>
    </>
  );
}
