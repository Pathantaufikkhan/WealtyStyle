"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Instagram,
  Facebook,
  Youtube,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { WealthStyleLogo } from "@/components/ui/WealthStyleLogo";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubscribed(true);
    toast.success("Welcome to GLAMSTEP VIP! Your ₹500 welcome code: WELCOME500");
  };

  const footerLinks = {
    shop: [
      { name: "Luxury Sunglasses", href: "/sunglasses" },
      { name: "Artisanal Footwear", href: "/shoes" },
      { name: "Haute Horlogerie", href: "/watches" },
      { name: "New Arrivals 2025", href: "/new-arrivals" },
      { name: "Exclusive Offers", href: "/offers" },
      { name: "Best Sellers", href: "/#bestsellers" },
    ],
    concierge: [
      { name: "Track Your Order", href: "/account/orders" },
      { name: "Shipping & Delivery Policy", href: "/shipping-policy" },
      { name: "Returns & Exchange", href: "/return-policy" },
      { name: "Refund Guarantee", href: "/refund-policy" },
      { name: "Contact Client Concierge", href: "/contact" },
      { name: "Store FAQs", href: "/contact#faqs" },
    ],
    account: [
      { name: "My Luxury Profile", href: "/account" },
      { name: "Order History", href: "/account/orders" },
      { name: "Saved Wishlist", href: "/account/wishlist" },
      { name: "Saved Addresses", href: "/account/addresses" },
      { name: "Admin Portal", href: "/admin" },
    ],
    maison: [
      { name: "About WEALTHY STYLE", href: "/contact" },
      { name: "Atelier Craftsmanship", href: "/sunglasses" },
      { name: "Sustainability & Materials", href: "/shoes" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-gold-500/20 pt-16 pb-24 lg:pb-12">
      {/* 4 Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 flex-shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white tracking-wider uppercase">
                100% Certified Authentic
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Direct from verified artisanal ateliers in Florence, Geneva, and Milan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 flex-shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white tracking-wider uppercase">
                Express Pan-India Delivery
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Complimentary insured courier with real-time SMS tracking on orders over ₹2,499.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 flex-shrink-0">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white tracking-wider uppercase">
                7-Day Seamless Returns
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Doorstep pickup and instant exchange or full refund to original payment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 flex-shrink-0">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white tracking-wider uppercase">
                24/7 Dedicated Concierge
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Personal styling advice and VIP support via WhatsApp and phone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
          {/* Brand Col */}
          <div className="sm:col-span-2 space-y-4">
            <WealthStyleLogo variant="horizontal" size="lg" href="/" />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Curating iconic personal style through precision-engineered Italian sunglasses, handcrafted Goodyear-welted leather footwear, and Swiss horological masterpieces.
            </p>

            {/* Newsletter VIP Box */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-400 flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Join the Maison Circle</span>
              </p>
              {isSubscribed ? (
                <div className="p-3 rounded bg-gold-500/10 border border-gold-500/30 text-xs text-gold-300 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-400" />
                  <span>Use code <strong>WELCOME500</strong> for ₹500 off!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for ₹500 off..."
                    className="h-10 px-3.5 bg-zinc-900 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-gold-500 rounded-l-sm flex-1"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 bg-gold-500 hover:bg-gold-400 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-r-sm transition-colors flex items-center gap-1"
                  >
                    <span>Join</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-zinc-900 hover:bg-gold-500 hover:text-zinc-950 text-zinc-400 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-zinc-900 hover:bg-gold-500 hover:text-zinc-950 text-zinc-400 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full bg-zinc-900 hover:bg-gold-500 hover:text-zinc-950 text-zinc-400 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h5 className="font-serif text-xs font-bold uppercase tracking-widest text-white mb-4">
              Shop Collections
            </h5>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Client Concierge */}
          <div>
            <h5 className="font-serif text-xs font-bold uppercase tracking-widest text-white mb-4">
              Client Concierge
            </h5>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.concierge.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Account */}
          <div>
            <h5 className="font-serif text-xs font-bold uppercase tracking-widest text-white mb-4">
              My Account
            </h5>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.account.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Maison */}
          <div>
            <h5 className="font-serif text-xs font-bold uppercase tracking-widest text-white mb-4">
              The Maison
            </h5>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.maison.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-gold-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Security */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© {new Date().getFullYear()} WEALTHY STYLE Luxury Atelier. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <span>Razorpay Verified Merchant</span>
          <span>•</span>
          <span>PCI-DSS Level 1 Compliant</span>
          <span>•</span>
          <Link href="/privacy-policy" className="hover:text-zinc-300">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-zinc-300">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
