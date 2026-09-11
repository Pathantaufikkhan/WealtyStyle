"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Glasses,
  Footprints,
  Watch,
  ArrowRight,
  Crosshair,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const filmScenes = [
  {
    id: "scene-optics",
    sceneNumber: "SCENE 01",
    location: "BELLUNO, ITALY",
    focalLength: "85MM T1.5 ANAMORPHIC",
    iso: "ISO 200 • 1/48s",
    pillar: "Haute Eyewear",
    title: "Aero Titanium 24K Gold Aviator",
    tagline: "Precision-sculpted beta-titanium with laser-engraved bridge filigree.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=85&w=1800&auto=format&fit=crop",
    href: "/product/aero-gold-titanium-aviator",
    specs: [
      { label: "Lens Material", val: "High-Index Optical Glass" },
      { label: "Polarization", val: "99.8% Glare Nullification" },
      { label: "Plating", val: "24K Gold Electroplate" },
      { label: "Weight", val: "18.4g Ultralight" },
    ],
    icon: Glasses,
  },
  {
    id: "scene-leather",
    sceneNumber: "SCENE 02",
    location: "FLORENCE, ITALY",
    focalLength: "100MM MACRO T2.8",
    iso: "ISO 400 • 1/48s",
    pillar: "Artisanal Footwear",
    title: "Firenze Hand-Burnished Oxfords",
    tagline: "360° Goodyear-welted French calfskin with multi-layer patina.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=85&w=1800&auto=format&fit=crop",
    href: "/product/firenze-burnished-leather-oxford",
    specs: [
      { label: "Hide Selection", val: "Full-Grain French Calfskin" },
      { label: "Sole Architecture", val: "Goodyear Double Sole" },
      { label: "Patina Process", val: "Hand-Burnished 7-Layer" },
      { label: "Last Profile", val: "Bespoke Chisel" },
    ],
    icon: Footprints,
  },
  {
    id: "scene-horology",
    sceneNumber: "SCENE 03",
    location: "GENEVA, SWITZERLAND",
    focalLength: "65MM T1.8 ANAMORPHIC",
    iso: "ISO 160 • 1/48s",
    pillar: "Haute Horlogerie",
    title: "Chronos Tourbillon Skeleton",
    tagline: "Exposed titanium cage revolving at 1 RPM with blued steel screws.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=85&w=1800&auto=format&fit=crop",
    href: "/product/chronos-tourbillon-automatic-skeleton",
    specs: [
      { label: "Caliber", val: "WS-Caliber 088 Tourbillon" },
      { label: "Frequency", val: "28,800 VPH (4.0 Hz)" },
      { label: "Power Reserve", val: "72-Hour Twin Barrel" },
      { label: "Crystal", val: "AR Sapphire Glass" },
    ],
    icon: Watch,
  },
];

// Isolated lightweight timecode component to avoid re-rendering entire section
function LiveTimecode() {
  const [tc, setTc] = useState("00:04:18:22");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTc(`${h}:${m}:${s}:24`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span>TC: {tc}</span>;
}

export function CinematicFilmShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);

  const currentScene = filmScenes[activeIdx];

  return (
    <section className="py-16 sm:py-24 bg-black text-white relative overflow-hidden border-y border-zinc-900 select-none">
      {/* Cinematic Film Grain Overlay */}
      <div className="absolute inset-0 cinematic-grain opacity-40 pointer-events-none" />
      <div className="absolute inset-0 cinematic-vignette pointer-events-none" />

      {/* Top Ambient Gold Flare Beam */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] anamorphic-beam opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-mono font-bold uppercase tracking-[0.3em] mb-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20">
              <Camera className="h-3.5 w-3.5 text-gold-400" />
              <span>CINEMATIC ATELIER EXPLORER</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
              Macro Craftsmanship in 4K
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-lg">
              High-definition anamorphic film examination of our three foundational ateliers.
            </p>
          </div>

          {/* Timecode & Camera Telemetry */}
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-xl backdrop-blur-md self-start md:self-auto">
            <div className="flex items-center gap-2 text-gold-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <LiveTimecode />
            </div>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">{currentScene.iso}</span>
          </div>
        </div>

        {/* Scene Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 sm:mb-8">
          {filmScenes.map((scene, idx) => {
            const Icon = scene.icon;
            const isSelected = activeIdx === idx;
            return (
              <button
                key={scene.id}
                onClick={() => setActiveIdx(idx)}
                className={`p-3.5 sm:p-4 rounded-xl text-left transition-all duration-300 border flex items-center justify-between gap-3 backdrop-blur-md ${
                  isSelected
                    ? "bg-zinc-900 border-gold-500 text-white shadow-[0_0_20px_rgba(212,175,55,0.25)] ring-1 ring-gold-500/50"
                    : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                      isSelected
                        ? "bg-gold-500 text-zinc-950 shadow-md"
                        : "bg-zinc-900 text-gold-400 border border-zinc-800"
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gold-400 font-bold tracking-widest block">
                      {scene.sceneNumber}
                    </span>
                    <span className="font-serif text-xs sm:text-sm font-bold text-white block">
                      {scene.pillar}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                  {scene.location}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cinema Scope 2.39:1 Main Frame Container */}
        <div className="relative rounded-2xl overflow-hidden border border-gold-500/40 bg-zinc-950 shadow-[0_25px_60px_rgba(0,0,0,0.9)] group">
          {/* 35mm Film Strip Top Info */}
          <div className="px-4 sm:px-5 py-2.5 bg-black/90 border-b border-zinc-800 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400 z-20 relative">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-gold-400 font-bold tracking-wider">
                WEALTHY STYLE ATELIER ARCHIVE
              </span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-zinc-400 hidden sm:inline">
                {currentScene.focalLength}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gold-400 font-semibold">
              <Crosshair className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-500" />
              <span>{currentScene.location}</span>
            </div>
          </div>

          {/* Main Visual Display */}
          <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] w-full overflow-hidden bg-black flex flex-col justify-between p-4 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 gpu-layer will-change-transform"
              >
                <Image
                  src={currentScene.image}
                  alt={currentScene.title}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover object-center brightness-[0.52] contrast-[1.1] group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </motion.div>
            </AnimatePresence>

            {/* Subtle Viewfinder Crosshair in Center */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25 group-hover:opacity-50 transition-opacity">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 border border-gold-500/40 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-gold-400 rounded-full" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-[1px] bg-gold-400" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-3 w-[1px] bg-gold-400" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-gold-400" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-gold-400" />
              </div>
            </div>

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-95 pointer-events-none" />

            {/* Top Area: Telemetry Specs Grid Floating Overlay */}
            <div className="relative z-20 flex flex-wrap gap-2 sm:gap-3 max-w-xl">
              <div className="bg-black/80 p-3 sm:p-4 rounded-xl border border-gold-500/30 backdrop-blur-md w-full sm:w-auto">
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-gold-400 font-bold block mb-2">
                  ATELIER SPECIFICATIONS
                </span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] sm:text-xs font-mono">
                  {currentScene.specs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 text-zinc-300">
                      <span className="text-zinc-500">{spec.label}:</span>
                      <span className="text-white font-semibold">{spec.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Scene Story & Action Button */}
            <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6">
              <div className="max-w-xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-gold-400" />
                  <span>{currentScene.pillar} Masterpiece</span>
                </div>

                <h3 className="font-serif text-xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                  {currentScene.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-lg">
                  {currentScene.tagline}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <Link href={currentScene.href}>
                  <Button
                    variant="luxury"
                    size="lg"
                    className="flex items-center gap-2.5 px-6 py-5 text-xs sm:text-sm font-bold tracking-widest shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                  >
                    <span>Acquire {currentScene.pillar.split(" ")[1] || "Creation"}</span>
                    <ArrowRight className="h-4 w-4 text-zinc-950" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* 35mm Bottom Film Track Counter */}
          <div className="px-4 sm:px-5 py-2 bg-black/90 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500 z-20 relative">
            <span>WEALTHY STYLE MAISON • 4K ULTRA-MASTER 2.39:1 CINEMASCOPE</span>
            <span className="text-gold-400 font-bold">ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </section>
  );
}

