"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AccountWishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleMoveToCart = (product: (typeof items)[0]) => {
    addToCart(product, product.variants?.[0], undefined, undefined, 1);
    removeItem(product.id);
    toast.success(`Moved ${product.name} to your bag`);
  };

  const handleMoveAllToCart = () => {
    items.forEach((p) => {
      addToCart(p, p.variants?.[0], undefined, undefined, 1);
    });
    clearWishlist();
    toast.success("Moved all saved items to your shopping bag!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-gold-500">
            Curated Favorites
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight mt-0.5">
            My Saved Wishlist ({items.length})
          </h2>
        </div>

        {items.length > 0 && (
          <Button
            variant="gold"
            size="sm"
            onClick={handleMoveAllToCart}
            className="flex items-center gap-1.5"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Move All to Bag</span>
          </Button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((product) => (
            <div
              key={product.id}
              className="rounded-xl bg-card border border-border/80 p-4 space-y-4 shadow-sm group flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={() => {
                    removeItem(product.id);
                    toast.info(`Removed from wishlist`);
                  }}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-background/80 hover:bg-background text-rose-500 shadow-md backdrop-blur-sm"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gold-500 tracking-wider">
                  {product.category}
                </span>
                <Link href={`/product/${product.slug}`}>
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground hover:text-gold-500 transition-colors line-clamp-1">
                    {product.name}
                  </h4>
                </Link>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-zinc-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMoveToCart(product)}
                className="w-full flex items-center justify-center gap-2 hover:border-gold-500"
              >
                <ShoppingBag className="h-3.5 w-3.5 text-gold-500" />
                <span>Move to Bag</span>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-xs text-zinc-500 space-y-3">
          <Heart className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <p className="font-serif text-lg font-bold text-foreground">
            Your Wishlist is Empty
          </p>
          <p className="max-w-xs mx-auto">
            Save pieces you love while browsing and return to them anytime.
          </p>
          <Link href="/sunglasses">
            <Button variant="gold" size="sm" className="mt-2">
              Browse Collections
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
