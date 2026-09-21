"use client";

import React, { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { ProductGrid } from "@/components/products/ProductGrid";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { products } = useStoreData();

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, products]);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-gold-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gold-500 font-semibold">Search Results</span>
        </nav>

        {/* Title */}
        <div className="mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-gold-500" />
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-foreground">
              Search results for &ldquo;{query}&rdquo;
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Found {searchResults.length} matching luxury accessories.
          </p>
        </div>

        {/* Results Grid */}
        {searchResults.length > 0 ? (
          <ProductGrid products={searchResults} columns={4} />
        ) : (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-dashed border-border space-y-3">
            <Search className="h-10 w-10 text-zinc-400 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-foreground">
              No products found matching &ldquo;{query}&rdquo;
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Please check your spelling or explore our curated categories below.
            </p>
            <div className="flex justify-center gap-3 pt-3">
              <Link
                href="/sunglasses"
                className="text-xs px-4 py-2 rounded-sm bg-card border border-border hover:border-gold-500 text-foreground"
              >
                Sunglasses
              </Link>
              <Link
                href="/shoes"
                className="text-xs px-4 py-2 rounded-sm bg-card border border-border hover:border-gold-500 text-foreground"
              >
                Shoes
              </Link>
              <Link
                href="/watches"
                className="text-xs px-4 py-2 rounded-sm bg-card border border-border hover:border-gold-500 text-foreground"
              >
                Watches
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
