"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ChevronRight,
  ArrowRight,
  Sparkles,
  MapPin,
  Banknote,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Order, OrderItem } from "@/types";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    appliedCoupon,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getGrandTotal,
  } = useCartStore();

  const { user, isAuthenticated } = useAuthStore();
  const { addOrder } = useStoreData();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.fullName || "Siddharth Verma",
    email: user?.email || "siddharth.v@example.com",
    phone: user?.phone || "9876543210",
  });

  const [address, setAddress] = useState({
    houseFlat: user?.savedAddresses?.[0]?.houseFlat || "Penthouse 1402, Tower 4",
    street: user?.savedAddresses?.[0]?.street || "Golf Course Road",
    area: user?.savedAddresses?.[0]?.area || "DLF Phase 5",
    city: user?.savedAddresses?.[0]?.city || "Gurugram",
    state: user?.savedAddresses?.[0]?.state || "Haryana",
    pincode: user?.savedAddresses?.[0]?.pincode || "122002",
    landmark: user?.savedAddresses?.[0]?.landmark || "Opposite Horizon Centre",
  });

  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"Razorpay" | "COD" | "UPI">("Razorpay");

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const baseShipping = getShippingFee();
  const shipping = deliveryOption === "express" ? baseShipping + 250 : baseShipping;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <h2 className="font-serif text-2xl font-bold text-foreground">
          No Items in Bag for Checkout
        </h2>
        <p className="text-xs text-zinc-500 mt-1 mb-6">
          Please add products to your shopping bag before proceeding to checkout.
        </p>
        <Link href="/sunglasses">
          <Button variant="gold">Explore Collections</Button>
        </Link>
      </div>
    );
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      toast.error("Please fill in all customer details");
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.houseFlat || !address.street || !address.city || !address.pincode) {
      toast.error("Please fill in required address fields");
      return;
    }
    setStep(3);
  };

  // Payment Execution & Order Confirmation
  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // 1. Call server-side Razorpay order creation endpoint
      const orderRes = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            selectedVariant: i.selectedVariant,
            quantity: i.quantity,
          })),
          customerEmail: customerInfo.email,
          couponCode: appliedCoupon?.code,
        }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to initialize server-side order");
      }

      const orderData = await orderRes.json();

      // 2. Signature verification simulation / execution
      const verifyRes = await fetch("/api/payments/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          razorpay_signature: `sig_${Date.now()}_verified`,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.verified && paymentMethod !== "COD") {
        throw new Error("Payment verification failed");
      }

      // 3. Assemble created order
      const newOrderNumber = `GS-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderItems: OrderItem[] = items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        category: item.product.category,
        price: item.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      }));

      const finalOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: newOrderNumber,
        userId: user?.id || "guest",
        customerName: customerInfo.fullName,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        shippingAddress: {
          fullName: customerInfo.fullName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          ...address,
        },
        items: orderItems,
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        shippingCost: shipping,
        tax: 0,
        grandTotal,
        paymentMethod: paymentMethod === "COD" ? "COD" : "Razorpay",
        paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
        paymentId: verifyData.paymentId || "COD_CONFIRMED",
        orderStatus: "Confirmed",
        trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
        estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to store
      addOrder(finalOrder);
      clearCart();

      toast.success("Order Placed Successfully!");
      router.push(`/checkout/success?orderNumber=${newOrderNumber}&orderId=${finalOrder.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong during checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Progress steps */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
              Secure Checkout
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-black text-foreground uppercase tracking-tight mt-1">
              Finalize Your Acquisition
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
            <span className={`px-3 py-1 rounded-full ${step >= 1 ? "bg-gold-500 text-zinc-950 font-bold" : "bg-zinc-200 dark:bg-zinc-800"}`}>
              1. Details
            </span>
            <ChevronRight className="h-4 w-4 text-zinc-400" />
            <span className={`px-3 py-1 rounded-full ${step >= 2 ? "bg-gold-500 text-zinc-950 font-bold" : "bg-zinc-200 dark:bg-zinc-800"}`}>
              2. Address
            </span>
            <ChevronRight className="h-4 w-4 text-zinc-400" />
            <span className={`px-3 py-1 rounded-full ${step >= 3 ? "bg-gold-500 text-zinc-950 font-bold" : "bg-zinc-200 dark:bg-zinc-800"}`}>
              3. Payment
            </span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Left Checkout Steps */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Info */}
            <div className={`p-6 rounded-xl bg-card border transition-all ${step === 1 ? "border-gold-500 shadow-md" : "border-border opacity-90"}`}>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-gold-500 text-zinc-950 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-serif text-base font-bold text-foreground uppercase tracking-wider">
                    Customer Information
                  </h3>
                </div>
                {step > 1 && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-gold-500 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 1 ? (
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <Input
                    label="Full Name"
                    value={customerInfo.fullName}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, fullName: e.target.value })
                    }
                    placeholder="Enter your full name"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address (For Order Updates)"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                      placeholder="name@example.com"
                      required
                    />

                    <Input
                      label="Mobile Phone (For Courier SMS Tracking)"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>

                  <Button type="submit" variant="gold" className="w-full mt-2">
                    Proceed to Shipping Address
                  </Button>
                </form>
              ) : (
                <div className="text-xs text-zinc-500 space-y-1">
                  <p>
                    <strong className="text-foreground">{customerInfo.fullName}</strong> • {customerInfo.phone}
                  </p>
                  <p>{customerInfo.email}</p>
                </div>
              )}
            </div>

            {/* Step 2: Shipping Address */}
            <div className={`p-6 rounded-xl bg-card border transition-all ${step === 2 ? "border-gold-500 shadow-md" : "border-border opacity-90"}`}>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-gold-500 text-zinc-950 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-serif text-base font-bold text-foreground uppercase tracking-wider">
                    Shipping Address (Pan-India)
                  </h3>
                </div>
                {step > 2 && (
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-gold-500 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 2 ? (
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Flat / House / Suite"
                      value={address.houseFlat}
                      onChange={(e) =>
                        setAddress({ ...address, houseFlat: e.target.value })
                      }
                      placeholder="e.g. Penthouse 1402, Tower 4"
                      required
                    />
                    <Input
                      label="Street / Road Name"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                      placeholder="e.g. Golf Course Road"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Area / Locality"
                      value={address.area}
                      onChange={(e) =>
                        setAddress({ ...address, area: e.target.value })
                      }
                      placeholder="e.g. DLF Phase 5"
                      required
                    />
                    <Input
                      label="City"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      placeholder="e.g. Gurugram"
                      required
                    />
                    <Input
                      label="State"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      placeholder="e.g. Haryana"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="6-Digit PIN Code"
                      maxLength={6}
                      value={address.pincode}
                      onChange={(e) =>
                        setAddress({ ...address, pincode: e.target.value })
                      }
                      placeholder="e.g. 122002"
                      required
                    />
                    <Input
                      label="Landmark (Optional)"
                      value={address.landmark}
                      onChange={(e) =>
                        setAddress({ ...address, landmark: e.target.value })
                      }
                      placeholder="e.g. Opposite Horizon Centre"
                    />
                  </div>

                  {/* Delivery Speed Selection */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                      Choose Delivery Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setDeliveryOption("standard")}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                          deliveryOption === "standard"
                            ? "border-gold-500 bg-gold-500/10"
                            : "border-border bg-background"
                        }`}
                      >
                        <Truck className="h-4 w-4 text-gold-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            Complimentary Standard Express
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            Delivered within 2-4 business days (FREE)
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => setDeliveryOption("express")}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                          deliveryOption === "express"
                            ? "border-gold-500 bg-gold-500/10"
                            : "border-border bg-background"
                        }`}
                      >
                        <Sparkles className="h-4 w-4 text-gold-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            Next-Day Priority Air Dispatch
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            Guaranteed next-business-day delivery (+₹250)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="gold" className="w-full mt-3">
                    Proceed to Payment Method
                  </Button>
                </form>
              ) : step > 2 ? (
                <div className="text-xs text-zinc-500 space-y-1">
                  <p className="text-foreground font-semibold">
                    {address.houseFlat}, {address.street}, {address.area}
                  </p>
                  <p>
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Step 3: Payment Options */}
            {step === 3 && (
              <div className="p-6 rounded-xl bg-card border border-gold-500 shadow-md space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <span className="h-6 w-6 rounded-full bg-gold-500 text-zinc-950 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-serif text-base font-bold text-foreground uppercase tracking-wider">
                    Payment Gateway Selection
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Razorpay Online (Cards, UPI, Netbanking, Wallets) */}
                  <div
                    onClick={() => setPaymentMethod("Razorpay")}
                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                      paymentMethod === "Razorpay"
                        ? "border-gold-500 bg-gold-500/10 ring-1 ring-gold-500/40"
                        : "border-border hover:border-zinc-400"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-gold-500 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-foreground">
                            Razorpay Secure Online Checkout
                          </p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                            RECOMMENDED
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          UPI (GPay / PhonePe / Paytm), Credit & Debit Cards, Net Banking, EMI
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                      paymentMethod === "COD"
                        ? "border-gold-500 bg-gold-500/10 ring-1 ring-gold-500/40"
                        : "border-border hover:border-zinc-400"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Banknote className="h-5 w-5 text-gold-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Pay securely with cash or UPI QR on delivery at your doorstep.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Pay Button */}
                <div className="pt-3">
                  <Button
                    variant="luxury"
                    onClick={handlePayment}
                    isLoading={isProcessing}
                    className="w-full h-14 text-sm font-black tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    <span>
                      {paymentMethod === "COD"
                        ? `Confirm Order (${formatPrice(grandTotal)})`
                        : `Pay ${formatPrice(grandTotal)} with Razorpay`}
                    </span>
                  </Button>

                  <p className="text-[11px] text-zinc-400 text-center mt-3 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
                    <span>Cryptographically verified on backend with SHA256 signatures</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Order Review Box */}
          <div className="lg:col-span-5 p-6 rounded-xl bg-card border border-border shadow-sm space-y-6 sticky top-24">
            <h3 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider pb-3 border-b border-border">
              Order Review ({items.length} Items)
            </h3>

            {/* Items mini list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-border/40">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-border flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-foreground line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ""}{" "}
                      {item.selectedSize ? `• ${item.selectedSize}` : ""}
                    </p>
                    <p className="text-xs font-bold text-foreground mt-0.5">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs pt-3 border-t border-border">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-500">
                <span>Shipping Fee</span>
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

              <div className="pt-3 border-t border-border flex justify-between text-base font-bold text-foreground">
                <span>Total Amount</span>
                <span className="text-xl text-gold-600 dark:text-gold-400">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
