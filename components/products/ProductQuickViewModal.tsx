"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Heart, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/utils/currency";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickViewModal({
  product,
  isOpen,
  onClose,
}: ProductQuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.attributes?.shoeSize?.[0]
  );

  const { addItem: addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const currentPrice = selectedVariant?.price || product.price;

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedVariant,
      selectedVariant?.colorName,
      selectedSize,
      1
    );
    toast.success(`Added ${product.name} to your bag`);
    onClose();
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist(product);
    if (added) {
      toast.success(`Added ${product.name} to your wishlist`);
    } else {
      toast.info(`Removed from wishlist`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col lg:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Image Gallery */}
            <div className="w-full lg:w-1/2 p-6 bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between">
              <div className="relative h-64 sm:h-80 w-full rounded-lg overflow-hidden border border-border">
                <Image
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-300"
                />
                {product.discountPercentage > 0 && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="sale">-{product.discountPercentage}% OFF</Badge>
                  </div>
                )}
              </div>

              {/* Thumbnails Rail */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-14 w-14 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImageIndex === idx
                          ? "border-gold-500 shadow-md"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="thumb" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Details */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold-500">
                    {product.brand} • {product.category}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-500 italic mt-0.5">
                    {product.tagline}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-gold-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(product.rating)
                            ? "fill-gold-500 text-gold-500"
                            : "text-zinc-300 dark:text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-zinc-400">
                    ({product.reviewsCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-foreground">
                    {formatPrice(currentPrice)}
                  </span>
                  {product.originalPrice > currentPrice && (
                    <span className="text-sm text-zinc-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Variants Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                      Select Finish / Color:{" "}
                      <span className="text-foreground">
                        {selectedVariant?.colorName || selectedVariant?.name}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-1.5 rounded-sm text-xs font-medium border transition-all flex items-center gap-2 ${
                            selectedVariant?.id === v.id
                              ? "border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400 font-bold"
                              : "border-border hover:border-zinc-400 text-foreground"
                          }`}
                        >
                          {v.colorHex && (
                            <span
                              className="h-3 w-3 rounded-full border border-black/20"
                              style={{ backgroundColor: v.colorHex }}
                            />
                          )}
                          <span>{v.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shoe Sizes */}
                {product.category === "shoes" && product.attributes?.shoeSize && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                      Select Size:{" "}
                      <span className="text-foreground">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.attributes.shoeSize.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1.5 rounded-sm text-xs font-bold border transition-all ${
                            selectedSize === sz
                              ? "border-gold-500 bg-gold-500 text-zinc-950"
                              : "border-border hover:border-zinc-400 text-foreground"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action CTAs */}
              <div className="pt-6 space-y-3">
                <div className="flex gap-3">
                  <Button
                    variant="gold"
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 h-12"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Bag</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className={`h-12 w-12 p-0 flex items-center justify-center ${
                      inWishlist ? "text-rose-500 border-rose-500" : ""
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`h-5 w-5 ${inWishlist ? "fill-rose-500" : ""}`} />
                  </Button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="text-xs font-semibold text-gold-500 hover:underline flex items-center gap-1"
                  >
                    <span>View Full Product Specifications</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
                    <span>2-Yr Warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
