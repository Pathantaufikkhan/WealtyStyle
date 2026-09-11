"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils/currency";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { Badge } from "@/components/ui/badge";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const { addItem: addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const hasSecondaryImage = product.images.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.variants?.[0], undefined, undefined, 1);
    toast.success(`Added ${product.name} to bag`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    if (added) {
      toast.success(`Added ${product.name} to wishlist`);
    } else {
      toast.info(`Removed from wishlist`);
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div
        className="group relative flex flex-col justify-between bg-card rounded-lg overflow-hidden border border-border/60 hover:border-gold-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <Link href={`/product/${product.slug}`} className="block h-full w-full">
            {/* Primary Image */}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-all duration-700 ease-out ${
                isHovered && hasSecondaryImage
                  ? "opacity-0 scale-105"
                  : "opacity-100 scale-100 group-hover:scale-105"
              }`}
            />

            {/* Secondary Hover Image */}
            {hasSecondaryImage && (
              <Image
                src={product.images[1]}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-all duration-700 ease-out absolute inset-0 ${
                  isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
              />
            )}
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.isNewArrival && <Badge variant="new">NEW</Badge>}
            {product.isBestSeller && <Badge variant="gold">BEST SELLER</Badge>}
            {product.discountPercentage > 0 && (
              <Badge variant="sale">-{product.discountPercentage}%</Badge>
            )}
            {!product.inStock && (
              <Badge variant="default" className="bg-zinc-800 text-zinc-300">
                OUT OF STOCK
              </Badge>
            )}
          </div>

          {/* Wishlist Button (Always Visible Top Right) */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              inWishlist
                ? "bg-rose-500 text-white shadow-md"
                : "bg-background/80 text-foreground/80 hover:bg-background hover:text-rose-500 hover:scale-110"
            }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-4 w-4 transition-transform ${
                inWishlist ? "fill-white" : ""
              }`}
            />
          </button>

          {/* Quick Action Overlay (Slide-up on Desktop Hover) */}
          <div className="absolute inset-x-3 bottom-3 hidden lg:flex items-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={handleQuickViewClick}
              className="flex-1 h-9 px-3 bg-background/95 hover:bg-background text-foreground text-[11px] font-bold uppercase tracking-wider rounded-sm shadow-md flex items-center justify-center gap-1.5 transition-colors border border-border backdrop-blur-sm"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Quick View</span>
            </button>

            {product.inStock && (
              <button
                onClick={handleQuickAdd}
                className="h-9 px-3.5 bg-gold-500 hover:bg-gold-400 text-zinc-950 text-[11px] font-bold uppercase tracking-wider rounded-sm shadow-md flex items-center justify-center gap-1 transition-colors"
                title="Add to Bag"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Details Section */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">
              <span>{product.category}</span>
              {product.rating > 0 && (
                <div className="flex items-center gap-1 text-gold-500 font-semibold">
                  <Star className="h-3 w-3 fill-gold-500" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <Link href={`/product/${product.slug}`}>
              <h3 className="text-xs sm:text-sm font-semibold text-foreground hover:text-gold-500 transition-colors line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-snug">
                {product.name}
              </h3>
            </Link>

            <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
              {product.tagline}
            </p>
          </div>

          {/* Pricing & Mobile Add to Cart */}
          <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[11px] text-zinc-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Mobile / Tablet Direct Add to Cart Button */}
            <button
              onClick={handleQuickAdd}
              className="lg:hidden p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-foreground hover:bg-gold-500 hover:text-zinc-950 transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
