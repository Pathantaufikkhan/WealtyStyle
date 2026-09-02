"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Grid3X3, LayoutGrid, Sparkles } from "lucide-react";
import { Product, CategorySlug } from "@/types";
import { categoriesMeta } from "@/lib/data/products";
import { ProductGrid } from "./ProductGrid";
import { ProductFilterSidebar, FilterState } from "./ProductFilterSidebar";

interface CategoryCatalogViewProps {
  categorySlug?: CategorySlug;
  customTitle?: string;
  customDescription?: string;
  customHeroImage?: string;
  allProducts: Product[];
  initialFilterTag?: string;
}

export function CategoryCatalogView({
  categorySlug,
  customTitle,
  customDescription,
  customHeroImage,
  allProducts,
  initialFilterTag,
}: CategoryCatalogViewProps) {
  const categoryMeta = categorySlug ? categoriesMeta[categorySlug] : null;

  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 25000],
    attributes: initialFilterTag ? { tag: [initialFilterTag] } : {},
    inStockOnly: false,
    minRating: 0,
    sortBy: "featured",
  });

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 25000],
      attributes: {},
      inStockOnly: false,
      minRating: 0,
      sortBy: "featured",
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Category check
        if (categorySlug && p.category !== categorySlug) return false;

        // Price range
        if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) {
          return false;
        }

        // In Stock
        if (filters.inStockOnly && !p.inStock) {
          return false;
        }

        // Rating
        if (filters.minRating > 0 && p.rating < filters.minRating) {
          return false;
        }

        // Attributes (frameShape, shoeStyle, watchMovement, lensType, etc.)
        for (const [key, selectedVals] of Object.entries(filters.attributes)) {
          if (selectedVals.length === 0) continue;

          if (key === "tag") {
            const hasTag = selectedVals.some((tag) =>
              p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
            );
            if (!hasTag) return false;
            continue;
          }

          const productAttrVal = p.attributes[key as keyof typeof p.attributes];
          if (Array.isArray(productAttrVal)) {
            const hasMatch = selectedVals.some((val) => productAttrVal.includes(val));
            if (!hasMatch) return false;
          } else if (typeof productAttrVal === "string") {
            if (!selectedVals.includes(productAttrVal)) return false;
          } else {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "rating":
            return b.rating - a.rating;
          case "discount":
            return b.discountPercentage - a.discountPercentage;
          case "newest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "featured":
          default:
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
      });
  }, [allProducts, categorySlug, filters]);

  const title = customTitle || categoryMeta?.name || "All Collections";
  const tagline = categoryMeta?.tagline || "Haute Couture Accessories";
  const description = customDescription || categoryMeta?.description || "Curated luxury eyewear, footwear, and horology.";
  const heroImage = customHeroImage || categoryMeta?.heroImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-background">
      {/* Category Hero Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-950 text-white flex items-center">
        <Image
          src={heroImage}
          alt={title}
          fill
          priority
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-zinc-950/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-3 uppercase tracking-wider">
            <Link href="/" className="hover:text-gold-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gold-400 font-semibold">{title}</span>
          </nav>

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{tagline}</span>
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-2 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Main Catalog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Control Bar: Count, Sort, Grid toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
          <div className="text-xs text-zinc-500 font-semibold">
            Showing <strong className="text-foreground">{filteredProducts.length}</strong> Luxury Creations
          </div>

          <div className="flex items-center gap-4">
            {/* Sorting Select */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400 uppercase font-bold tracking-wider hidden sm:inline">
                Sort By:
              </span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value })
                }
                className="h-9 px-3 rounded-sm border border-border bg-card text-foreground text-xs font-medium focus:outline-none focus:border-gold-500"
              >
                <option value="featured">Featured & Best Picks</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {/* Grid Column Switcher (Desktop) */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded border border-border bg-card">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-sm transition-colors ${
                  gridCols === 3
                    ? "bg-gold-500 text-zinc-950"
                    : "text-zinc-400 hover:text-foreground"
                }`}
                title="3 Columns"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-sm transition-colors ${
                  gridCols === 4
                    ? "bg-gold-500 text-zinc-950"
                    : "text-zinc-400 hover:text-foreground"
                }`}
                title="4 Columns"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filter Sidebar */}
          <ProductFilterSidebar
            category={categorySlug}
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
            totalCount={filteredProducts.length}
          />

          {/* Product Cards Grid */}
          <div className="flex-1 w-full">
            <ProductGrid products={filteredProducts} columns={gridCols} />
          </div>
        </div>
      </div>
    </div>
  );
}
