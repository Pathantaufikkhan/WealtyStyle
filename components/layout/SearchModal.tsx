"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Sparkles, ArrowRight, Tag } from "lucide-react";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/currency";
import { Product } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = [
  "Aviator Sunglasses",
  "Titanium Skeleton Watch",
  "Florentine Oxford Shoes",
  "Suede Loafers",
  "Polarized Shades",
  "Ceramic Chronograph",
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Aviator",
    "Tourbillon",
    "Chelsea Boot",
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .slice(0, 6);
  }, [query]);

  const handleSearchSubmit = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)]);
    }
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-3xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-6 border-b border-border flex items-center gap-3">
              <Search className="h-6 w-6 text-gold-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit(query);
                  if (e.key === "Escape") onClose();
                }}
                placeholder="Search Sunglasses, Shoes, Watches, Collections..."
                className="w-full bg-transparent text-base sm:text-lg text-foreground placeholder:text-zinc-400 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-full text-zinc-400 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-xs uppercase font-semibold tracking-wider text-zinc-400 hover:text-foreground px-2 py-1"
              >
                ESC
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Dynamic Search Results */}
              {query.trim() ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                      Found {filteredProducts.length} Results for &ldquo;{query}&rdquo;
                    </span>
                    {filteredProducts.length > 0 && (
                      <button
                        onClick={() => handleSearchSubmit(query)}
                        className="text-xs text-gold-500 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>View all results</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-2.5 rounded-lg border border-border/60 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all group"
                        >
                          <div className="relative h-16 w-16 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] uppercase font-bold text-gold-500 tracking-wider">
                              {product.category}
                            </span>
                            <h4 className="text-xs font-semibold text-foreground truncate group-hover:text-gold-500 transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-foreground">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="text-[10px] text-zinc-400 line-through">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-sm text-zinc-400">
                        No luxury items found matching &ldquo;{query}&rdquo;.
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Try searching for &quot;Titanium&quot;, &quot;Oxford&quot;, or &quot;Automatic&quot;.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty query: show Recent & Popular Searches */
                <div className="space-y-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
                        <TrendingUp className="h-3.5 w-3.5 text-gold-500" />
                        <span>Recent Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => {
                              setQuery(term);
                              handleSearchSubmit(term);
                            }}
                            className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-gold-500/15 hover:text-gold-500 border border-border/50 text-foreground transition-all"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Trend Searches */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
                      <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                      <span>Trending Curations</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setQuery(term);
                            handleSearchSubmit(term);
                          }}
                          className="text-xs px-3.5 py-1.5 rounded-full bg-gold-500/10 hover:bg-gold-500 text-gold-600 hover:text-zinc-950 dark:text-gold-300 font-medium border border-gold-500/30 transition-all flex items-center gap-1.5"
                        >
                          <Tag className="h-3 w-3" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Featured Category Quick Links */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-3">
                      Shop By Category
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <Link
                        href="/sunglasses"
                        onClick={onClose}
                        className="p-3 rounded-lg border border-border/60 hover:border-gold-500 text-center group transition-all"
                      >
                        <p className="text-xs font-bold text-foreground group-hover:text-gold-500">
                          Sunglasses
                        </p>
                        <span className="text-[10px] text-zinc-400">10 Models</span>
                      </Link>
                      <Link
                        href="/shoes"
                        onClick={onClose}
                        className="p-3 rounded-lg border border-border/60 hover:border-gold-500 text-center group transition-all"
                      >
                        <p className="text-xs font-bold text-foreground group-hover:text-gold-500">
                          Artisanal Shoes
                        </p>
                        <span className="text-[10px] text-zinc-400">10 Styles</span>
                      </Link>
                      <Link
                        href="/watches"
                        onClick={onClose}
                        className="p-3 rounded-lg border border-border/60 hover:border-gold-500 text-center group transition-all"
                      >
                        <p className="text-xs font-bold text-foreground group-hover:text-gold-500">
                          Haute Horlogerie
                        </p>
                        <span className="text-[10px] text-zinc-400">10 Timepieces</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
