"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Heart,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const pathname = usePathname();
  const {
    items,
    isCartDrawerOpen,
    toggleCartDrawer,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getGrandTotal,
    getFreeShippingProgress,
  } = useCartStore();

  const { addItem: addToWishlist } = useWishlistStore();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const grandTotal = getGrandTotal();
  const freeShipping = getFreeShippingProgress();

  const handleMoveToWishlist = (item: (typeof items)[0]) => {
    addToWishlist(item.product);
    removeItem(item.id);
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCartDrawer(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-background border-l border-border shadow-2xl flex flex-col justify-between"
            >
              {/* Top Header */}
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-gold-500" />
                  <h3 className="font-serif text-lg font-bold tracking-wider text-foreground">
                    Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
                  </h3>
                </div>
                <button
                  onClick={() => toggleCartDrawer(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 border-b border-border">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <div className="flex items-center gap-1.5 text-foreground">
                    <Truck className="h-4 w-4 text-gold-500" />
                    {freeShipping.isQualified ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        You have unlocked FREE Express Shipping!
                      </span>
                    ) : (
                      <span>
                        Add{" "}
                        <strong className="text-gold-600 dark:text-gold-400">
                          {formatPrice(freeShipping.amountNeeded)}
                        </strong>{" "}
                        more for Free Express Delivery
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-500">{freeShipping.progressPercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${freeShipping.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-border/40">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 group">
                      {/* Image Thumbnail */}
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => toggleCartDrawer(false)}
                        className="relative h-20 w-20 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex-shrink-0 border border-border/60"
                      >
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${item.product.slug}`}
                              onClick={() => toggleCartDrawer(false)}
                              className="text-xs font-semibold text-foreground hover:text-gold-500 transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Selected Variant / Color / Size */}
                          <div className="text-[11px] text-zinc-500 flex flex-wrap gap-x-2 mt-0.5">
                            {item.selectedColor && (
                              <span>Color: <strong className="text-foreground">{item.selectedColor}</strong></span>
                            )}
                            {item.selectedSize && (
                              <span>Size: <strong className="text-foreground">{item.selectedSize}</strong></span>
                            )}
                          </div>
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-border rounded-sm bg-zinc-50 dark:bg-zinc-900">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-zinc-500 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-l-sm transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-zinc-500 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-r-sm transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleMoveToWishlist(item)}
                              className="text-[10px] text-zinc-400 hover:text-gold-500 transition-colors flex items-center gap-1"
                              title="Save to Wishlist"
                            >
                              <Heart className="h-3 w-3" />
                              <span className="hidden sm:inline">Save</span>
                            </button>
                            <span className="text-xs font-bold text-foreground">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-serif text-lg font-bold text-foreground">
                        Your bag is currently empty
                      </p>
                      <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                        Explore our handcrafted sunglasses, Italian footwear, and haute horlogerie timepieces.
                      </p>
                    </div>
                    <Button
                      variant="gold"
                      onClick={() => toggleCartDrawer(false)}
                      className="mt-2"
                    >
                      Explore Collections
                    </Button>
                  </div>
                )}
              </div>

              {/* Bottom Summary & Checkout CTA */}
              {items.length > 0 && (
                <div className="p-5 border-t border-border bg-zinc-50/70 dark:bg-zinc-950/70 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-500">
                      <span>Subtotal</span>
                      <span className="font-medium text-foreground">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Coupon Discount</span>
                        <span className="font-bold">-{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-zinc-500">
                      <span>Estimated Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <strong className="text-emerald-600 dark:text-emerald-400 uppercase font-bold">
                            FREE
                          </strong>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-foreground">
                      <span>Estimated Total</span>
                      <span className="text-base text-gold-600 dark:text-gold-400">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href="/cart"
                      onClick={() => toggleCartDrawer(false)}
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        View Bag
                      </Button>
                    </Link>

                    <Link
                      href="/checkout"
                      onClick={() => toggleCartDrawer(false)}
                      className="w-full"
                    >
                      <Button variant="gold" className="w-full flex items-center justify-center gap-1.5">
                        <span>Checkout</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 text-center pt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
                    <span>256-Bit SSL Encrypted Luxury Checkout</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
