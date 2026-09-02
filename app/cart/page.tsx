"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Heart,
  Truck,
  ShieldCheck,
  Tag,
  CheckCircle2,
  X,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { initialCoupons } from "@/lib/data/initialStore";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getGrandTotal,
    getFreeShippingProgress,
  } = useCartStore();

  const { addItem: addToWishlist } = useWishlistStore();
  const [couponCodeInput, setCouponCodeInput] = useState("");

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const grandTotal = getGrandTotal();
  const freeShipping = getFreeShippingProgress();

  const handleMoveToWishlist = (item: (typeof items)[0]) => {
    addToWishlist(item.product);
    removeItem(item.id);
    toast.success(`Saved ${item.product.name} to your wishlist`);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    const matchedCoupon = initialCoupons.find(
      (c) => c.code.toUpperCase() === couponCodeInput.trim().toUpperCase() && c.isActive
    );

    if (!matchedCoupon) {
      toast.error("Invalid coupon code. Try GLAM10 or WELCOME500");
      return;
    }

    if (subtotal < matchedCoupon.minOrderValue) {
      toast.error(
        `Coupon requires a minimum order value of ${formatPrice(
          matchedCoupon.minOrderValue
        )}`
      );
      return;
    }

    applyCoupon(matchedCoupon);
    toast.success(`Applied ${matchedCoupon.code}! Saved ${formatPrice(matchedCoupon.discountValue)}`);
    setCouponCodeInput("");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-6">
          <ShoppingBag className="h-10 w-10 text-gold-500" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Your Bag is Currently Empty
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mt-2 mb-8">
          Explore our handcrafted sunglasses, Italian Goodyear-welted shoes, and Haute Horlogerie mechanical watches.
        </p>
        <Link href="/new-arrivals">
          <Button variant="luxury" size="lg" className="flex items-center gap-2">
            <span>Explore Collections</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
              Review Selections
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tight mt-1">
              Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h1>
          </div>
          <button
            onClick={() => {
              clearCart();
              toast.info("Cleared all items from your bag");
            }}
            className="text-xs text-zinc-400 hover:text-rose-500 transition-colors uppercase font-semibold tracking-wider"
          >
            Clear Bag
          </button>
        </div>

        {/* Free Shipping Progress Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-border mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold mb-2">
            <div className="flex items-center gap-2 text-foreground">
              <Truck className="h-4 w-4 text-gold-500" />
              {freeShipping.isQualified ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  Congratulations! You unlocked complimentary Express Courier across India.
                </span>
              ) : (
                <span>
                  Add{" "}
                  <strong className="text-gold-600 dark:text-gold-400">
                    {formatPrice(freeShipping.amountNeeded)}
                  </strong>{" "}
                  more to unlock FREE Express Delivery.
                </span>
              )}
            </div>
            <span className="text-zinc-500">{freeShipping.progressPercentage}% of threshold</span>
          </div>
          <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-amber-300 transition-all duration-500"
              style={{ width: `${freeShipping.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Main Content Grid: Items List (Left 8) + Summary (Right 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-4 divide-y divide-border/60">
            {items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-4 sm:gap-6 group">
                {/* Thumbnail */}
                <Link
                  href={`/product/${item.product.slug}`}
                  className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-border flex-shrink-0"
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Info & Quantity */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gold-500 tracking-wider">
                          {item.product.brand} • {item.product.category}
                        </span>
                        <Link href={`/product/${item.product.slug}`}>
                          <h3 className="text-sm sm:text-base font-semibold text-foreground hover:text-gold-500 transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                      </div>
                      <span className="text-base font-bold text-foreground whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-500 mt-1 flex flex-wrap gap-x-4">
                      {item.selectedColor && (
                        <span>
                          Color: <strong className="text-foreground">{item.selectedColor}</strong>
                        </span>
                      )}
                      {item.selectedSize && (
                        <span>
                          Size: <strong className="text-foreground">{item.selectedSize}</strong>
                        </span>
                      )}
                      <span>
                        Unit Price: <strong className="text-foreground">{formatPrice(item.price)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions & Quantity Stepper */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                    <div className="flex items-center border border-border rounded-sm bg-card h-9">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 text-zinc-400 hover:text-foreground transition-colors font-bold text-sm"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 text-zinc-400 hover:text-foreground transition-colors font-bold text-sm"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="text-zinc-400 hover:text-gold-500 transition-colors flex items-center gap-1 font-medium"
                      >
                        <Heart className="h-3.5 w-3.5" />
                        <span>Move to Wishlist</span>
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-400 hover:text-rose-500 transition-colors flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <Link href="/sunglasses">
                <Button variant="ghost" className="text-xs flex items-center gap-2">
                  <span>← Continue Shopping</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Order Summary */}
          <div className="lg:col-span-4 p-6 rounded-xl bg-card border border-border shadow-sm space-y-6 sticky top-24">
            <h3 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider pb-3 border-b border-border">
              Order Summary
            </h3>

            {/* Coupon Application Box */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-gold-500" />
                <span>Apply Promo Code</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{appliedCoupon.code} Applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-zinc-400 hover:text-rose-500 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="e.g. GLAM10"
                    className="h-10 px-3 rounded-sm border border-border bg-background text-xs uppercase font-mono text-foreground placeholder:text-zinc-400 focus:outline-none focus:border-gold-500 flex-1"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="h-10">
                    Apply
                  </Button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-border">
              <div className="flex justify-between text-zinc-500">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Savings ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-500">
                <span>Express Insured Shipping</span>
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

              <div className="flex justify-between text-zinc-500">
                <span>Estimated GST Tax</span>
                <span className="font-semibold text-foreground">Included</span>
              </div>

              <div className="pt-3 border-t border-border flex justify-between text-base font-bold text-foreground">
                <span>Grand Total</span>
                <span className="text-xl text-gold-600 dark:text-gold-400">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="space-y-3 pt-2">
              <Link href="/checkout" className="block w-full">
                <Button
                  variant="gold"
                  className="w-full h-13 flex items-center justify-center gap-2 font-black tracking-widest text-xs"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
                <span>Protected by Razorpay 256-Bit SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
