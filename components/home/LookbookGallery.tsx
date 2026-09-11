"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Film,
  Sparkles,
  ArrowUpRight,
  Glasses,
  Footprints,
  Watch,
  Maximize2,
} from "lucide-react";

const cinematicReelFrames = [
  {
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop",
    category: "Haute Eyewear",
    title: "Aero Gold Titanium Aviator",
    sceneCode: "FRAME 01 • ST. TROPEZ",
    timecode: "00:01:14:08",
    aspect: "Beta-Titanium / Polarized",
    href: "/product/aero-gold-titanium-aviator",
    icon: Glasses,
  },
  {
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop",
    category: "Artisanal Footwear",
    title: "Firenze Burnished Oxfords",
    sceneCode: "FRAME 02 • FLORENCE",
    timecode: "00:02:45:19",
    aspect: "Goodyear-Welted Calfskin",
    href: "/product/firenze-burnished-leather-oxford",
    icon: Footprints,
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    category: "Haute Horlogerie",
    title: "Chronos Tourbillon Skeleton",
    sceneCode: "FRAME 03 • GENEVA",
    timecode: "00:04:12:02",
    aspect: "28,800 VPH Swiss Caliber",
    href: "/product/chronos-tourbillon-automatic-skeleton",
    icon: Watch,
  },
  {
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop",
    category: "Haute Eyewear",
    title: "Monaco Vintage Wayfarer",
    sceneCode: "FRAME 04 • MONACO",
    timecode: "00:05:30:11",
    aspect: "Mazzucchelli 1849 Acetate",
    href: "/product/monaco-vintage-acetate-wayfarer",
    icon: Glasses,
  },
  {
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop",
    category: "Artisanal Footwear",
    title: "Strata Italian Calfskin",
    sceneCode: "FRAME 05 • MAYFAIR",
    timecode: "00:07:18:24",
    aspect: "Hand-Stitched Margom Sole",
    href: "/product/strata-minimalist-calfskin-sneaker",
    icon: Footprints,
  },
  {
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop",
    category: "Haute Horlogerie",
    title: "Abyss 300M Ceramic Diver",
    sceneCode: "FRAME 06 • PORTOFINO",
    timecode: "00:09:04:16",
    aspect: "300M Helium Release Valve",
    href: "/product/abyss-300m-automatic-diver-blue",
    icon: Watch,
  },
];

export function LookbookGallery() {
  const [activeHoverIdx, setActiveHoverIdx] = useState<number | null>(null);

  return (
    <section className="py-24 bg-zinc-950 text-white relative overflow-hidden border-t border-zinc-900">
      {/* Background cinematic vignette */}
      <div className="absolute inset-0 cinematic-grain opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-mono font-bold uppercase tracking-[0.3em] mb-3">
              <Film className="h-4 w-4 text-gold-500" />
              <span>35MM CINEMATIC REEL</span>
              <span className="text-zinc-600">•</span>
              <span>SCENE ARCHIVE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
              The Atelier Lookbook
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl">
              High-definition cinematic frames showcasing pure artisanal craftsmanship across eyewear, leathercraft, and horlogerie.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-gold-400/90">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>4K ULTRA MASTER RESOLUTION</span>
          </div>
        </div>

        {/* 6-Frame Cinematic Film Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cinematicReelFrames.map((frame, idx) => {
            const Icon = frame.icon;
            const isHovered = activeHoverIdx === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onMouseEnter={() => setActiveHoverIdx(idx)}
                onMouseLeave={() => setActiveHoverIdx(null)}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-gold-500/60 transition-all duration-500 shadow-2xl flex flex-col"
              >
                {/* 35mm Film Strip Top Header */}
                <div className="px-4 py-2 bg-black/80 border-b border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400 z-10">
                  <span className="text-gold-400 font-bold">{frame.sceneCode}</span>
                  <span className="text-zinc-500">{frame.timecode}</span>
                </div>

                {/* Main Product Image Container */}
                <Link href={frame.href} className="relative aspect-[4/3] overflow-hidden block">
                  <Image
                    src={frame.image}
                    alt={frame.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out brightness-90 group-hover:brightness-100 will-change-transform"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 text-gold-400 border border-gold-500/30 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      <Icon className="h-3 w-3" />
                      <span>{frame.category}</span>
                    </span>
                  </div>

                  {/* Quick Expand Button */}
                  <div className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-black/70 text-zinc-400 group-hover:text-gold-400 border border-zinc-700 group-hover:border-gold-500/50 flex items-center justify-center transition-colors">
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>

                {/* Bottom Frame Details */}
                <div className="p-5 bg-zinc-950 flex-1 flex flex-col justify-between border-t border-zinc-800/60">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white tracking-wide group-hover:text-gold-400 transition-colors">
                      {frame.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 font-mono">
                      Craft: {frame.aspect}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-zinc-900 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gold-500 tracking-widest flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>View Specifications</span>
                    </span>
                    <Link
                      href={frame.href}
                      className="text-xs font-bold text-white hover:text-gold-400 transition-colors"
                    >
                      Acquire &rarr;
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
