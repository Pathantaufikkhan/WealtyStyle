"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const showcaseCategories = [
  {
    slug: "sunglasses",
    title: "SUNGLASSES",
    tagline: "See the difference.",
    description: "Hand-polished Mazzucchelli acetate, Japanese titanium, and precision UV400 polarized optics.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop",
    href: "/sunglasses",
    count: "10 Distinct Models",
    accent: "from-amber-500/20 to-transparent",
  },
  {
    slug: "shoes",
    title: "SHOES",
    tagline: "Step into your style.",
    description: "Florentine hand-burnished calfskin, Goodyear welted soles, and supple Italian suede loafers.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
    href: "/shoes",
    count: "10 Artisanal Pairs",
    accent: "from-gold-500/20 to-transparent",
  },
  {
    slug: "watches",
    title: "WATCHES",
    tagline: "Time meets style.",
    description: "Exposed tourbillon skeletons, meca-quartz chronographs, and 300m ceramic deep divers.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
    href: "/watches",
    count: "10 Masterpieces",
    accent: "from-yellow-500/20 to-transparent",
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-gold-500 text-xs font-bold uppercase tracking-[0.25em] mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Maison Pillars</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase">
            Curated Categories
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            Explore the tripartite foundation of personal prestige.
          </p>
        </div>

        {/* 3 Large Premium Category Cards (3 columns on desktop, stacked on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {showcaseCategories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative h-[480px] sm:h-[540px] rounded-2xl overflow-hidden shadow-lg border border-border/80 flex flex-col justify-end p-6 sm:p-8"
            >
              {/* Background Image with Zoom on Hover */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Top Accent Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-black/60 text-gold-400 border border-gold-500/30 backdrop-blur-md">
                  {cat.count}
                </span>
              </div>

              {/* Card Bottom Details */}
              <div className="relative z-10 space-y-3 transform group-hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-black text-white tracking-widest uppercase">
                    {cat.title}
                  </h3>
                  <p className="text-sm font-serif italic text-gold-400 mt-0.5">
                    &ldquo;{cat.tagline}&rdquo;
                  </p>
                </div>

                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="pt-2">
                  <Link href={cat.href}>
                    <Button
                      variant="gold"
                      className="w-full flex items-center justify-center gap-2 group/btn font-bold tracking-widest"
                    >
                      <span>Explore {cat.title}</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
