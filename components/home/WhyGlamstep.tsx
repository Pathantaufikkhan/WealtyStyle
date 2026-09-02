"use client";

import React from "react";
import { ShieldCheck, CreditCard, Truck, RefreshCw, Sparkles, Award, Lock, CheckCircle2 } from "lucide-react";

export function WhyGlamstep() {
  const pillars = [
    {
      icon: Award,
      badge: "CRAFTSMANSHIP",
      title: "Pure Atelier Selection",
      description: "Masterpieces from premier workshops in Belluno (optics), Florence (leathercraft), and Geneva (horlogerie).",
    },
    {
      icon: Lock,
      badge: "SECURITY",
      title: "Encrypted Transactions",
      description: "Seamless 256-bit PCI-DSS Level 1 compliant checkout with Razorpay, UPI, cards, and concierge support.",
    },
    {
      icon: Truck,
      badge: "LOGISTICS",
      title: "White-Glove Express",
      description: "Insured express shipping across 19,000+ Indian pincodes in signature gold-embossed bespoke packaging.",
    },
    {
      icon: RefreshCw,
      badge: "CONFIDENCE",
      title: "Doorstep Exchange",
      description: "Complimentary 7-day doorstep pickup, authentication warranty, and immediate refunds to your source account.",
    },
  ];

  return (
    <section className="py-24 bg-zinc-950 text-white border-y border-zinc-900 relative overflow-hidden">
      {/* Background Subtle Cinematic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-mono font-bold uppercase tracking-[0.3em] mb-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-400" />
            <span>THE WEALTHY STYLE PROMISE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
            The Standards of Excellence
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Every creation is verified by master horologists, opticians, and leather artisans.
          </p>
        </div>

        {/* 4 Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 hover:border-gold-500/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8)] group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-zinc-950 transition-colors duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider mb-2 group-hover:text-gold-400 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-zinc-800/60 flex items-center gap-1.5 text-[10px] font-mono text-gold-400/80">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold-500" />
                  <span>Verified Guarantee</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
