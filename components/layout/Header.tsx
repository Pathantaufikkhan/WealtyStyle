"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  Sun,
  Moon,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { SearchModal } from "@/components/layout/SearchModal";
import { MobileNav } from "./MobileNav";
import { WealthStyleLogo } from "@/components/ui/WealthStyleLogo";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();
  const { getItemCount, toggleCartDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated } = useAuthStore();

  const cartCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    {
      name: "Sunglasses",
      href: "/sunglasses",
      badge: "UV400",
      featured: [
        { name: "Aviators", href: "/sunglasses?frameShape=Aviator" },
        { name: "Polarized", href: "/sunglasses?lensType=Polarized" },
        { name: "Titanium Frames", href: "/sunglasses?tag=Titanium" },
      ],
    },
    {
      name: "Shoes",
      href: "/shoes",
      badge: "Italian",
      featured: [
        { name: "Oxfords & Dress", href: "/shoes?shoeStyle=Oxfords" },
        { name: "Suede Loafers", href: "/shoes?shoeStyle=Loafers" },
        { name: "Luxury Sneakers", href: "/shoes?shoeStyle=Sneakers" },
      ],
    },
    {
      name: "Watches",
      href: "/watches",
      badge: "Sapphire",
      featured: [
        { name: "Automatic Skeleton", href: "/watches?watchMovement=Automatic" },
        { name: "Chronographs", href: "/watches?watchMovement=Chronograph" },
        { name: "300M Divers", href: "/watches?tag=Diver" },
      ],
    },
    { name: "New Arrivals", href: "/new-arrivals", highlight: true },
    { name: "Best Sellers", href: "/#bestsellers" },
    { name: "Offers", href: "/offers", isSale: true },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-zinc-950 text-zinc-300 text-[11px] font-medium tracking-widest uppercase py-2 px-4 sm:px-6 lg:px-8 xl:px-12 border-b border-gold-500/20">
        <div className="w-full flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-gold-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>100% Certified Authentic Luxury</span>
          </div>

          <div className="mx-auto sm:mx-0 flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-gold-400 animate-pulse" />
            <span>
              Complimentary Express Delivery Over ₹2,499 | Use Code{" "}
              <strong className="text-gold-400 font-bold tracking-normal underline">
                WEALTHY10
              </strong>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-zinc-400">
            <Link href="/contact" className="hover:text-gold-400 transition-colors">
              Concierge
            </Link>
            <span>•</span>
            <Link href="/account/orders" className="hover:text-gold-400 transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Luxury Header */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "bg-zinc-950/95 shadow-2xl shadow-black/90 border-b border-gold-500/20 backdrop-blur-md"
            : "bg-zinc-950 border-b border-zinc-900/80"
        )}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 h-20 sm:h-22 flex items-center justify-between gap-4">
          {/* Far Left Corner: Mobile Menu Button + WS Logo */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-zinc-300 hover:text-gold-400 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Luxury WS Logo strictly in the far left corner */}
            <WealthStyleLogo variant="horizontal" size="md" href="/" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const hasDropdown = link.featured && link.featured.length > 0;

              return (
                <div key={link.name} className="relative group py-6">
                  <Link
                    href={link.href}
                    className={cn(
                      "text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 transition-all duration-200",
                      isActive
                        ? "text-gold-400 font-bold"
                        : "text-zinc-300 hover:text-gold-400",
                      link.isSale && "text-rose-400 hover:text-rose-300 font-bold",
                      link.highlight && "text-gold-400 font-bold"
                    )}
                  >
                    <span>{link.name}</span>
                    {hasDropdown && (
                      <ChevronDown className="h-3 w-3 text-zinc-400 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                    {link.badge && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-gold-500/15 text-gold-400 border border-gold-500/30 font-medium">
                        {link.badge}
                      </span>
                    )}
                  </Link>

                  {/* Active Indicator Underline */}
                  {isActive && (
                    <span className="absolute bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 rounded-full shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                  )}

                  {/* Dropdown Menu */}
                  {hasDropdown && (
                    <div className="absolute top-full left-0 w-52 py-2 px-1 bg-zinc-950/95 border border-gold-500/20 shadow-2xl shadow-black rounded-lg opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50 backdrop-blur-md">
                      <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-gold-400/80 border-b border-zinc-800">
                        Explore {link.name}
                      </div>
                      {link.featured?.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-2 text-xs text-zinc-300 hover:text-gold-400 hover:bg-gold-500/10 rounded transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-zinc-300 hover:text-gold-400 transition-colors rounded-full hover:bg-zinc-900/80"
              aria-label="Search store"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Dark / Light Mode Switcher */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-zinc-300 hover:text-gold-400 transition-colors rounded-full hover:bg-zinc-900/80"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-gold-400" />
                ) : (
                  <Moon className="h-5 w-5 text-zinc-300" />
                )}
              </button>
            )}

            {/* Wishlist Link */}
            <Link
              href="/account/wishlist"
              className="p-2 text-zinc-300 hover:text-gold-400 transition-colors relative rounded-full hover:bg-zinc-900/80"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-scale">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Admin link */}
            <Link
              href={isAuthenticated ? (user?.role === "admin" ? "/admin" : "/account") : "/login"}
              className="hidden sm:flex items-center gap-1.5 p-2 text-zinc-300 hover:text-gold-400 transition-colors rounded-full hover:bg-zinc-900/80"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
              {user?.role === "admin" && (
                <span className="text-[9px] bg-gold-500 text-zinc-950 font-bold px-1.5 py-0.5 rounded">
                  ADMIN
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => toggleCartDrawer(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 text-zinc-950 px-3.5 py-2 rounded shadow-md shadow-gold-500/10 hover:brightness-110 transition-all font-bold text-xs"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-zinc-950 text-gold-400 text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline tracking-wider uppercase text-[11px]">
                Bag
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Navigation */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
