"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { products } from "@/lib/data/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";

export function TrendingSection() {
  const [activeTab, setActiveTab] = useState<"all" | "sunglasses" | "shoes" | "watches">("all");

  const filteredTrending = products
    .filter((p) => (activeTab === "all" ? true : p.category === activeTab))
    .slice(0, 8);

  const tabs = [
    { id: "all", label: "All Curations" },
    { id: "sunglasses", label: "Sunglasses" },
    { id: "shoes", label: "Footwear" },
    { id: "watches", label: "Timepieces" },
  ] as const;

  return (
    <section className="py-20 bg-zinc-50/50 dark:bg-zinc-950/40 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-gold-500 text-xs font-bold uppercase tracking-[0.25em] mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>In High Demand</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-foreground uppercase">
              Trending Now
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-200/60 dark:bg-zinc-900 border border-border/50 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-zinc-950 text-white dark:bg-gold-500 dark:text-zinc-950 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Product Grid */}
        <ProductGrid products={filteredTrending} columns={4} />

        {/* Explore All CTA Button */}
        <div className="mt-14 text-center">
          <Link href={activeTab === "all" ? "/new-arrivals" : `/${activeTab}`}>
            <Button
              variant="outline"
              size="lg"
              className="inline-flex items-center gap-2 group hover:border-gold-500"
            >
              <span>Explore All {activeTab.toUpperCase()}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-gold-500" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
