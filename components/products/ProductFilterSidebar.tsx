"use client";

import React, { useState } from "react";
import { SlidersHorizontal, X, RotateCcw, ChevronDown, Check } from "lucide-react";
import { CategorySlug } from "@/types";
import { categoriesMeta } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/currency";

export interface FilterState {
  priceRange: [number, number];
  attributes: Record<string, string[]>;
  inStockOnly: boolean;
  minRating: number;
  sortBy: string;
}

interface ProductFilterSidebarProps {
  category?: CategorySlug;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  totalCount: number;
}

export function ProductFilterSidebar({
  category,
  filters,
  onFilterChange,
  onReset,
  totalCount,
}: ProductFilterSidebarProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    attributes: true,
    rating: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAttributeToggle = (key: string, value: string) => {
    const current = filters.attributes[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    onFilterChange({
      ...filters,
      attributes: {
        ...filters.attributes,
        [key]: updated,
      },
    });
  };

  const categoryMeta = category ? categoriesMeta[category] : null;

  const hasActiveFilters =
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 25000 ||
    filters.inStockOnly ||
    filters.minRating > 0 ||
    Object.values(filters.attributes).some((arr) => arr.length > 0);

  const filterContent = (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gold-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-foreground">
            Filters ({totalCount})
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-[11px] text-gold-500 hover:underline flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* In Stock Toggle */}
      <div className="flex items-center justify-between py-2">
        <span className="text-xs font-medium text-foreground">In Stock Only</span>
        <button
          type="button"
          onClick={() =>
            onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly })
          }
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            filters.inStockOnly ? "bg-gold-500" : "bg-zinc-300 dark:bg-zinc-700"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              filters.inStockOnly ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("price")}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Price Range
          </span>
          <ChevronDown
            className={`h-4 w-4 text-zinc-400 transition-transform ${
              openSections.price ? "rotate-180" : ""
            }`}
          />
        </div>
        {openSections.price && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
            <input
              type="range"
              min="0"
              max="25000"
              step="500"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  priceRange: [filters.priceRange[0], parseInt(e.target.value, 10)],
                })
              }
              className="w-full accent-gold-500 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Dynamic Category Specific Filters */}
      {categoryMeta &&
        categoryMeta.filters.map((filterGroup) => (
          <div key={filterGroup.key} className="space-y-3 pt-4 border-t border-border">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection(filterGroup.key)}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                {filterGroup.name}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-zinc-400 transition-transform ${
                  openSections[filterGroup.key] !== false ? "rotate-180" : ""
                }`}
              />
            </div>
            {openSections[filterGroup.key] !== false && (
              <div className="space-y-2 pt-1">
                {filterGroup.options.map((option) => {
                  const isChecked = (
                    filters.attributes[filterGroup.key] || []
                  ).includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-2.5 text-xs text-foreground/85 hover:text-foreground cursor-pointer select-none"
                    >
                      <div
                        onClick={() =>
                          handleAttributeToggle(filterGroup.key, option.value)
                        }
                        className={`h-4 w-4 rounded-xs border flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-gold-500 border-gold-500 text-zinc-950"
                            : "border-border hover:border-zinc-400"
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}

      {/* Customer Rating Filter */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("rating")}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Minimum Rating
          </span>
          <ChevronDown
            className={`h-4 w-4 text-zinc-400 transition-transform ${
              openSections.rating ? "rotate-180" : ""
            }`}
          />
        </div>
        {openSections.rating && (
          <div className="space-y-2 pt-1">
            {[4.5, 4.0, 3.5].map((rating) => {
              const isSelected = filters.minRating === rating;
              return (
                <label
                  key={rating}
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      minRating: isSelected ? 0 : rating,
                    })
                  }
                  className="flex items-center gap-2.5 text-xs cursor-pointer select-none text-foreground/85 hover:text-foreground"
                >
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-gold-500 border-gold-500 text-zinc-950"
                        : "border-border hover:border-zinc-400"
                    }`}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-zinc-950" />}
                  </div>
                  <span>{rating}★ & above</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Left Column) */}
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-card rounded-lg border border-border/60 p-5 h-fit sticky top-24">
        {filterContent}
      </aside>

      {/* Mobile / Tablet Filter Button */}
      <div className="lg:hidden flex items-center justify-between mb-4 w-full">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-sm border border-border bg-card text-xs font-bold uppercase tracking-wider text-foreground hover:border-gold-500 transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-gold-500" />
          <span>Filters ({totalCount})</span>
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-gold-500" />
          )}
        </button>
      </div>

      {/* Mobile Filter Bottom Sheet / Modal */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div className="relative w-[85%] max-w-sm bg-background border-l border-border h-full flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Filter Products
                </h3>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {filterContent}
            </div>

            <div className="pt-6 border-t border-border mt-6">
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full py-3 bg-gold-500 text-zinc-950 font-bold uppercase tracking-wider text-xs rounded-sm"
              >
                Apply Filters ({totalCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
