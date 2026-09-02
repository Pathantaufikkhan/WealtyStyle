"use client";

import React from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-dashed border-border">
        <p className="font-serif text-lg font-bold text-foreground">
          No Products Found
        </p>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
          We could not find any luxury products matching your selected criteria. Try adjusting your active filters.
        </p>
      </div>
    );
  }

  const columnClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${columnClass} gap-4 sm:gap-6`}>
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} priority={idx < 4} />
      ))}
    </div>
  );
}
