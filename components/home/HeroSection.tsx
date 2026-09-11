"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Glasses,
  Footprints,
  Watch,
  Disc3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const cinematicScenes = [
  {
    id: "sunglasses",
    tag: "SCENE 01 / 03 • BELLUNO OPTICS",
    categoryName: "Haute Eyewear",
    titlePrimary: "SCULPTED IN GOLD.",
    titleHighlight: "DRIVEN BY LIGHT.",
    description:
      "Aerospace beta-titanium and hand-carved bio-acetate sunglasses engineered with polarized UV400 Japanese optics.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=85&w=2400&auto=format&fit=crop",
    href: "/sunglasses",
    cta: "Explore Eyewear Atelier",
    aspectIcon: Glasses,
    focalPoint: "24K Gold Inlaid Temples",
  },
  {
    id: "shoes",
    tag: "SCENE 02 / 03 • FLORENTINE ATELIER",
    categoryName: "Artisanal Footwear",
    titlePrimary: "THE ART OF",
    titleHighlight: "BESPOKE LEATHER.",
    description:
      "Goodyear-welted Florentine calfskin and butter-soft Italian suede loafers, hand-burnished by multi-generational master craftsmen.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=85&w=2400&auto=format&fit=crop",
    href: "/shoes",
    cta: "Discover Footwear Collection",
    aspectIcon: Footprints,
    focalPoint: "Goodyear-Welted 5mm Soles",
  },
  {
    id: "watches",
    tag: "SCENE 03 / 03 • GENEVA HORLOGERIE",
    categoryName: "Haute Horlogerie",
    titlePrimary: "PRECISION MEETS",
    titleHighlight: "ETERNITY.",
    description:
      "Exposed tourbillon skeletons, 28,800 VPH mechanical movements, and scratchproof sapphire crystal exhibition casebacks.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=85&w=2400&auto=format&fit=crop",
    href: "/watches",
    cta: "View Timepiece Collection",
    aspectIcon: Watch,
    focalPoint: "Exposed Swiss Tourbillon Movement",
  },
];

export function HeroSection() {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-advance scenes every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % cinematicScenes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const scene = cinematicScenes[currentIdx];
  const SceneIcon = scene.aspectIcon;

  return (
    <section className="relative min-h-[90vh] lg:min-h-[94vh] flex flex-col justify-between overflow-hidden bg-black text-white select-none py-6 sm:py-8">
      {/* 1. Cinematic Background Reel with Crossfade & Ken Burns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={scene.image}
            alt={scene.titlePrimary}
            fill
            priority
            className="object-cover object-center brightness-[0.45] contrast-[1.1]"
          />
        </motion.div>
      </AnimatePresence>

      {/* 2. Cinematic Grain & Radial Vignette */}
      <div className="absolute inset-0 z-[1] cinematic-grain pointer-events-none opacity-40" />
      <div className="absolute inset-0 z-[2] cinematic-vignette pointer-events-none" />

      {/* 3. Anamorphic Horizontal Gold Lens Flare Line */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[1.5px] z-[3] anamorphic-beam opacity-30 pointer-events-none" />

      {/* 4. Top Film Strip Metadata Bar */}
      <div className="relative z-20 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] sm:text-xs font-mono tracking-widest text-gold-400/80 pt-2 sm:pt-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-white font-bold uppercase tracking-wider">REC</span>
          <span className="text-zinc-500">|</span>
          <span>4K HDR • 24.00 FPS</span>
        </div>

        <div className="flex items-center gap-2 text-zinc-400 text-[10px] uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          <span className="hidden xs:inline">MILAN • GENEVA • FLORENCE</span>
        </div>
      </div>

      {/* 5. Main Hero Editorial Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 text-center flex flex-col items-center justify-center my-auto">
        {/* Scene Chapter Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.tag}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.28em] mb-4 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            <SceneIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{scene.tag}</span>
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Headline */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={scene.titlePrimary + scene.titleHighlight}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight uppercase leading-[1.08] sm:leading-[1.05]"
          >
            {scene.titlePrimary} <br />
            <span className="bg-gradient-to-r from-gold-300 via-amber-200 to-gold-500 bg-clip-text text-transparent italic animate-gold-shimmer">
              {scene.titleHighlight}
            </span>
          </motion.h1>
        </AnimatePresence>

        {/* Subtitle / Focus Point */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.description}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 sm:mt-6 max-w-2xl px-2"
          >
            <p className="text-xs sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed tracking-wide">
              {scene.description}
            </p>
            <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-gold-400/90 tracking-widest uppercase">
              <Disc3 className="h-3 w-3 text-gold-500 flex-shrink-0" />
              <span className="line-clamp-1">CRAFT: {scene.focalPoint}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href={scene.href}>
            <Button
              variant="luxury"
              size="lg"
              className="flex items-center gap-2 sm:gap-3 group px-6 sm:px-8 py-5 sm:py-6 text-xs sm:text-sm font-bold tracking-widest shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
              <span>{scene.cta}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform text-zinc-950" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* 6. Bottom Scene Director Bar & Navigation Controls */}
      <div className="relative z-20 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between gap-2 sm:gap-4 pb-2">
        {/* Category Direct Quick-Pills (Strictly Sunglasses, Shoes, Watches - NO Clothes) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {cinematicScenes.map((item, idx) => {
            const Icon = item.aspectIcon;
            const isActive = idx === currentIdx;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentIdx(idx)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all backdrop-blur-md flex-shrink-0 ${
                  isActive
                    ? "bg-gold-500 text-zinc-950 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                    : "bg-black/60 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden xs:inline">{item.categoryName}</span>
              </button>
            );
          })}
        </div>

        {/* Scene Slider Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() =>
              setCurrentIdx((prev) => (prev - 1 + cinematicScenes.length) % cinematicScenes.length)
            }
            className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-gold-500 hover:text-zinc-950 text-gold-400 border border-gold-500/30 transition-colors backdrop-blur-md"
            aria-label="Previous Scene"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Progress Indicator */}
          <div className="flex items-center gap-1.5">
            {cinematicScenes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                aria-label={`Go to scene ${i + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentIdx
                    ? "w-6 sm:w-8 bg-gold-400 shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                    : "w-2 bg-zinc-700 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentIdx((prev) => (prev + 1) % cinematicScenes.length)
            }
            className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-gold-500 hover:text-zinc-950 text-gold-400 border border-gold-500/30 transition-colors backdrop-blur-md"
            aria-label="Next Scene"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

