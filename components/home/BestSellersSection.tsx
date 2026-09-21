"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ArrowRight, Star } from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

export function BestSellersSection() {
  const { products } = useStoreData();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const spotlightProduct = products.find((p) => p.slug === "chronos-tourbillon-automatic-skeleton") || products[0];

  return (
    <section id="bestsellers" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-gold-500 text-xs font-bold uppercase tracking-[0.25em] mb-2">
            <Award className="h-4 w-4" />
            <span>Maison Icons</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase">
            Best Sellers Collection
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            The most coveted timepieces, footwear, and eyewear defining modern elegance.
          </p>
        </div>

        {/* Feature Spotlight Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white mb-12 border border-gold-500/30 p-6 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:max-w-md space-y-4 z-10 w-full">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/30 inline-block">
              Spotlight of the Season
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-black uppercase leading-tight">
              {spotlightProduct.name}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              {spotlightProduct.description}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1 text-gold-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-400" />
                ))}
              </div>
              <span className="text-xs text-zinc-400 font-semibold">
                5.0 (156 Horology Reviews)
              </span>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link href={`/product/${spotlightProduct.slug}`}>
                <Button variant="luxury" size="lg" className="flex items-center gap-2">
                  <span>Acquire Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 w-full lg:w-1/2 rounded-xl overflow-hidden border border-white/10 z-10">
            <Image
              src={spotlightProduct.images[0]}
              alt={spotlightProduct.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="absolute inset-0 bg-dark-radial opacity-90" />
        </div>

        {/* 4 Best Seller Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
