"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { products } from "@/lib/data/products";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductReviews } from "@/components/products/ProductReviews";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/currency";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useStoreData } from "@/lib/store/useStoreData";
import { toast } from "sonner";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }> | {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const router = useRouter();
  const resolvedParams = "then" in params ? React.use(params as Promise<{ slug: string }>) : params;
  const slug = resolvedParams.slug;

  const { products: storeProducts } = useStoreData();

  const allProductsList = storeProducts && storeProducts.length > 0 ? storeProducts : products;
  const product = allProductsList.find((p) => p.slug === slug);

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.attributes?.shoeSize?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Accordion open tabs state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    specifications: true,
    shipping: false,
    returns: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { addItem: addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  if (!product) {
    notFound();
  }

  const inWishlist = isInWishlist(product.id);
  const currentPrice = selectedVariant?.price || product.price;

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedVariant,
      selectedVariant?.colorName,
      selectedSize,
      quantity
    );
    toast.success(`Added ${quantity} x ${product.name} to your bag`);
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      selectedVariant,
      selectedVariant?.colorName,
      selectedSize,
      quantity
    );
    router.push("/checkout");
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist(product);
    if (added) {
      toast.success(`Added ${product.name} to your wishlist`);
    } else {
      toast.info(`Removed from wishlist`);
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      toast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }
    setPincodeStatus(`Available! Estimated express delivery by ${new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}.`);
    toast.success("Delivery available to your location!");
  };

  // Related recommendations
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // JSON-LD structured schema
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `https://glamstep.luxury/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
  };

  React.useEffect(() => {
    if (!product) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(productSchema);
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [product?.id, product?.slug]);

  return (
    <>
      <div className="min-h-screen bg-background py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8 uppercase tracking-wider">
            <Link href="/" className="hover:text-gold-500 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/${product.category}`}
              className="hover:text-gold-500 transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gold-500 font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          {/* Product Overview Split: Left Gallery, Right Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Image Gallery */}
            <div className="lg:col-span-7 sticky top-24">
              <ProductGallery
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Right Product Buy Box */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-500 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{product.brand}</span>
                  </span>
                  {product.isNewArrival && <Badge variant="new">NEW ARRIVAL</Badge>}
                  {product.isBestSeller && <Badge variant="gold">BEST SELLER</Badge>}
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight mt-1">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 italic mt-1">
                  &ldquo;{product.tagline}&rdquo;
                </p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 py-2 border-y border-border/60">
                <div className="flex items-center gap-1 text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-gold-500 text-gold-500"
                          : "text-zinc-300 dark:text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-foreground">
                  {product.rating.toFixed(1)} / 5.0
                </span>
                <span className="text-xs text-zinc-400">•</span>
                <a
                  href="#reviews"
                  className="text-xs text-gold-500 hover:underline font-semibold"
                >
                  {product.reviewsCount} Verified Reviews
                </a>
              </div>

              {/* Price & Savings */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                    {formatPrice(currentPrice)}
                  </span>
                  {product.originalPrice > currentPrice && (
                    <span className="text-base text-zinc-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <Badge variant="sale" className="text-xs px-2 py-1">
                      SAVE {product.discountPercentage}%
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">
                  Inclusive of all taxes. Free insured express shipping across India.
                </p>
              </div>

              {/* Variant Selector (Colors / Metals) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                    Finish / Color:{" "}
                    <span className="text-foreground">
                      {selectedVariant?.colorName || selectedVariant?.name}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-3.5 py-2 rounded-sm text-xs font-semibold border transition-all flex items-center gap-2 ${
                            isSelected
                              ? "border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400 shadow-sm"
                              : "border-border hover:border-zinc-400 text-foreground"
                          }`}
                        >
                          {variant.colorHex && (
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-black/30"
                              style={{ backgroundColor: variant.colorHex }}
                            />
                          )}
                          <span>{variant.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shoe Size Selector */}
              {product.category === "shoes" && product.attributes?.shoeSize && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Select Size: <span className="text-foreground">{selectedSize}</span>
                    </label>
                    <span className="text-[11px] text-gold-500 hover:underline cursor-pointer">
                      Size Guide
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.attributes.shoeSize.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-sm text-xs font-bold border transition-all ${
                            isSelected
                              ? "border-gold-500 bg-gold-500 text-zinc-950 shadow-md"
                              : "border-border hover:border-zinc-400 text-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-border rounded-sm bg-card h-12">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 text-zinc-400 hover:text-foreground transition-colors font-bold text-sm"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 text-zinc-400 hover:text-foreground transition-colors font-bold text-sm"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag */}
                  <Button
                    variant="gold"
                    onClick={handleAddToCart}
                    className="flex-1 h-12 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Bag</span>
                  </Button>

                  {/* Wishlist Heart */}
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

                {/* Buy Now Direct Checkout Button */}
                <Button
                  variant="luxury"
                  onClick={handleBuyNow}
                  className="w-full h-12 flex items-center justify-center gap-2 uppercase tracking-widest font-black text-xs"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Pincode Delivery Estimator */}
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-border/70 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                  <MapPin className="h-4 w-4 text-gold-500" />
                  <span>Check Delivery & Cod Availability</span>
                </div>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit PIN Code (e.g. 110001)"
                    className="h-10 px-3 rounded-sm border border-border bg-card text-xs text-foreground placeholder:text-zinc-400 focus:outline-none focus:border-gold-500 flex-1"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="h-10">
                    Check
                  </Button>
                </form>
                {pincodeStatus && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{pincodeStatus}</span>
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-zinc-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-gold-500 flex-shrink-0" />
                  <span>2-Year International Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-gold-500 flex-shrink-0" />
                  <span>7-Day Easy Doorstep Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gold-500 flex-shrink-0" />
                  <span>Free Insured Express Courier</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gold-500 flex-shrink-0" />
                  <span>256-Bit Razorpay SSL Checkout</span>
                </div>
              </div>

              {/* Expandable Accordions */}
              <div className="pt-4 border-t border-border divide-y divide-border">
                {/* 1. Description */}
                <div className="py-3">
                  <button
                    onClick={() => toggleAccordion("description")}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-foreground text-left"
                  >
                    <span>Product Story & Design</span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-400 transition-transform ${
                        openAccordions.description ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAccordions.description && (
                    <div className="pt-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2">
                      <p>{product.description}</p>
                      {product.materials && (
                        <p>
                          <strong className="text-foreground">Materials: </strong>
                          {product.materials.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Specifications */}
                <div className="py-3">
                  <button
                    onClick={() => toggleAccordion("specifications")}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-foreground text-left"
                  >
                    <span>Technical Specifications</span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-400 transition-transform ${
                        openAccordions.specifications ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAccordions.specifications && (
                    <div className="pt-3">
                      <div className="rounded-md border border-border overflow-hidden text-xs">
                        {product.specifications.map((spec, i) => (
                          <div
                            key={spec.label}
                            className={`flex justify-between p-2.5 ${
                              i % 2 === 0
                                ? "bg-zinc-50 dark:bg-zinc-900/50"
                                : "bg-card"
                            }`}
                          >
                            <span className="text-zinc-500 font-medium">
                              {spec.label}
                            </span>
                            <span className="font-semibold text-foreground text-right">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Shipping & Delivery */}
                <div className="py-3">
                  <button
                    onClick={() => toggleAccordion("shipping")}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-foreground text-left"
                  >
                    <span>Shipping & Delivery</span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-400 transition-transform ${
                        openAccordions.shipping ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAccordions.shipping && (
                    <div className="pt-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2">
                      <p>
                        All GLAMSTEP orders are dispatched in tamper-evident, climate-controlled luxury packaging within 24 hours of confirmation.
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Metro cities: 24 to 48 hours delivery.</li>
                        <li>Rest of India: 2 to 4 business days.</li>
                        <li>Complimentary insurance covers 100% of order value in transit.</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* 4. Returns & Care */}
                <div className="py-3">
                  <button
                    onClick={() => toggleAccordion("returns")}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-foreground text-left"
                  >
                    <span>Returns, Exchange & Care</span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-400 transition-transform ${
                        openAccordions.returns ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openAccordions.returns && (
                    <div className="pt-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2">
                      <p>
                        We offer a complimentary 7-day doorstep return and exchange policy. Simply initiate a request from your Account dashboard or WhatsApp concierge.
                      </p>
                      {product.careInstructions && (
                        <div>
                          <strong className="text-foreground block mb-1">
                            Care Guidelines:
                          </strong>
                          <ul className="list-disc pl-4 space-y-1">
                            {product.careInstructions.map((inst, i) => (
                              <li key={i}>{inst}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div id="reviews" className="mt-20 pt-12 border-t border-border">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
                Verified Feedback
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase mt-1">
                Customer Reviews ({product.reviewsCount})
              </h2>
            </div>
            <ProductReviews
              productId={product.id}
              productName={product.name}
              rating={product.rating}
              reviewsCount={product.reviewsCount}
            />
          </div>

          {/* Related / You May Also Like Recommendations */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-border">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
                    Complete The Ensemble
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase mt-1">
                    You May Also Appreciate
                  </h2>
                </div>
                <Link
                  href={`/${product.category}`}
                  className="text-xs font-bold uppercase tracking-wider text-gold-500 hover:underline flex items-center gap-1"
                >
                  <span>View All {product.category}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
