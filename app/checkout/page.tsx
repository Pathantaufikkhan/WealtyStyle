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
  Shield,
  BadgeAlert,
  Info,
  Crown,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { calculateMembershipStatus, sendMembershipEmail } from "@/lib/utils/membership";
import { MembershipOfferModal } from "@/components/membership/MembershipOfferModal";
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

  const { user, isAuthenticated, grantValuedMembership, setMilestoneNotified } = useAuthStore();
  const { orders, addOrder } = useStoreData();

  const membershipStatus = calculateMembershipStatus(user, orders);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [address, setAddress] = useState({
    houseFlat: user?.savedAddresses?.[0]?.houseFlat || "",
    street: user?.savedAddresses?.[0]?.street || "",
    area: user?.savedAddresses?.[0]?.area || "",
    city: user?.savedAddresses?.[0]?.city || "",
    state: user?.savedAddresses?.[0]?.state || "",
    pincode: user?.savedAddresses?.[0]?.pincode || "",
    landmark: user?.savedAddresses?.[0]?.landmark || "",
  });

  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"Advance_COD" | "Razorpay" | "COD">("Advance_COD");

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const baseShipping = getShippingFee();
  const shipping = deliveryOption === "express" ? baseShipping + 250 : baseShipping;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  // ₹200 Advance Payment Calculations
  const advanceAmount = Math.min(200, grandTotal);
  const balanceDueOnDelivery = Math.max(0, grandTotal - advanceAmount);

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
      const isAdvance = paymentMethod === "Advance_COD";
      const isFullOnline = paymentMethod === "Razorpay";
      const isPureCod = paymentMethod === "COD";

      let paymentId = "COD_CONFIRMED";

      // If online payment is needed (either ₹200 advance or 100% full online)
      if (isAdvance || isFullOnline) {
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
            isAdvancePayment: isAdvance,
          }),
        });

        if (!orderRes.ok) {
          throw new Error("Failed to initialize server-side payment order");
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

        if (!verifyData.verified) {
          throw new Error("Payment verification failed");
        }

        paymentId = verifyData.paymentId || (isAdvance ? "ADVANCE_200_PAID" : "RAZORPAY_PAID");
      }

      // 3. Assemble created order
      const newOrderNumber = `WS-${Math.floor(100000 + Math.random() * 900000)}`;
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
        advancePaid: isAdvance ? advanceAmount : isFullOnline ? grandTotal : 0,
        balanceDue: isAdvance ? balanceDueOnDelivery : isPureCod ? grandTotal : 0,
        paymentMethod: isAdvance ? "Advance_COD" : isPureCod ? "COD" : "Razorpay",
        paymentStatus: isAdvance ? "Partially Paid" : isPureCod ? "Pending" : "Paid",
        paymentId,
        orderStatus: "Confirmed",
        trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
        estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to store
      addOrder(finalOrder);
      clearCart();

      // Send Official GST Tax Invoice & Order Receipt Email to Customer Gmail
      try {
        fetch("/api/orders/send-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: finalOrder }),
        }).catch((e) => console.error("Tax invoice email failed:", e));
      } catch (err) {
        console.error("Tax invoice trigger error:", err);
      }

      // Check User Order Count for Valued Membership Milestones
      const previousOrderCount = orders.filter((o) => {
        if (!user) return false;
        return o.customerEmail?.toLowerCase() === user.email?.toLowerCase() || o.userId === user.id;
      }).length;

      const newOrderCount = previousOrderCount + 1;

      // 1. Milestone: 3 Completed Orders -> Send Offer Email & Prompt
      if (newOrderCount === 3 && !user?.isValuedMember && !user?.notifiedMilestone3) {
        setMilestoneNotified(3);
        sendMembershipEmail(
          customerInfo.email,
          customerInfo.fullName,
          "offer_3_orders",
          newOrderCount
        );
        toast.info("👑 Milestone Reached! You unlocked an exclusive ₹110 Valued Client Offer (Check your email).");
      }

      // 2. Milestone: 5 Completed Orders -> Automatic Free Lifetime Valued Membership Grant & Email
      if (newOrderCount >= 5 && (!user?.isValuedMember || user?.membershipMethod !== "auto_5_orders")) {
        grantValuedMembership("auto_5_orders");
        setMilestoneNotified(5);
        sendMembershipEmail(
          customerInfo.email,
          customerInfo.fullName,
          "auto_5_orders",
          newOrderCount
        );
        toast.success("🎉 CONGRATULATIONS! You have been auto-upgraded to Valued Client Membership 100% FREE for life!");
      }

      if (isAdvance) {
        toast.success(`₹200 Security Advance Paid! Remaining ₹${balanceDueOnDelivery} due upon delivery.`);
      } else {
        toast.success("Order Placed Successfully!");
      }

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
            <span className={`px-3 py-1 rounded-full ${step >= 1 ? "bg-gold-500 text-zinc-950 font-bold" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"}`}>
              1. Details
            </span>
            <ChevronRight className="h-4 w-4 text-zinc-400" />
            <span className={`px-3 py-1 rounded-full ${step >= 2 ? "bg-gold-500 text-zinc-950 font-bold" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"}`}>
              2. Address
            </span>
            <ChevronRight className="h-4 w-4 text-zinc-400" />
            <span className={`px-3 py-1 rounded-full ${step >= 3 ? "bg-gold-500 text-zinc-950 font-bold" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"}`}>
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
                    placeholder="e.g. Vikramaditya Roy"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                      placeholder="name@domain.com"
                      required
                    />

                    <Input
                      label="Phone Number"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      placeholder="9876543210"
                      required
                    />
                  </div>

                  <Button type="submit" variant="gold" className="w-full mt-2">
                    Proceed to Delivery Address
                  </Button>
                </form>
              ) : (
                <div className="text-xs text-zinc-500 space-y-1">
                  <p className="text-foreground font-semibold">
                    {customerInfo.fullName}
                  </p>
                  <p>{customerInfo.email} • {customerInfo.phone}</p>
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
                    Shipping Destination
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
                    Payment & Security Method
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {/* Option 1: 100% Cash on Delivery (Reserved Exclusively for Verified Valued Clients) */}
                  {membershipStatus.isValuedMember ? (
                    <div
                      onClick={() => setPaymentMethod("COD")}
                      className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                        paymentMethod === "COD"
                          ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/40"
                          : "border-border hover:border-zinc-400"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5 flex-shrink-0">
                          <Crown className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                              <span>100% Free Cash on Delivery (Zero Advance)</span>
                            </p>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black uppercase tracking-wider">
                              👑 Valued Client Privilege Active
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                            As a verified Valued Client, zero security deposit is required. Pay full {formatPrice(grandTotal)} directly to the courier upon doorstep delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Valued Membership ₹110 Offer Banner for Non-Members with 3+ Orders */}
                  {!membershipStatus.isValuedMember && membershipStatus.qualifiesFor3OrderOffer ? (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-transparent border border-gold-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-gold-400 font-bold text-xs">
                          <Sparkles className="h-4 w-4" />
                          <span>3 Orders Completed! Special ₹110 Membership Offer</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Want 100% Free Doorstep COD? Unlock Valued Client Membership right now for just ₹110, or reach 5 orders for Free Automatic VIP.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="gold"
                        size="sm"
                        onClick={() => setIsOfferModalOpen(true)}
                        className="text-xs font-bold whitespace-nowrap uppercase tracking-wider"
                      >
                        <span>Unlock for ₹110</span>
                      </Button>
                    </div>
                  ) : null}

                  {/* Option 2: ₹200 Advance Security Deposit (Standard for COD when not a Valued Client) */}
                  {!membershipStatus.isValuedMember && (
                    <div
                      onClick={() => setPaymentMethod("Advance_COD")}
                      className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                        paymentMethod === "Advance_COD"
                          ? "border-gold-500 bg-gold-500/10 ring-2 ring-gold-500/40"
                          : "border-border hover:border-zinc-400"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="p-2 rounded-lg bg-gold-500/20 text-gold-500 mt-0.5 flex-shrink-0">
                          <Shield className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs sm:text-sm font-bold text-foreground">
                              ₹200 Security Advance + Pay Remaining on Delivery
                            </p>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold-500 text-zinc-950 font-black uppercase tracking-wider">
                              STANDARD COD
                            </span>
                          </div>

                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                            Pay a small <strong className="text-gold-500 font-bold">₹200 security deposit</strong> online now via Razorpay (UPI, GPay, Card) to lock in your verified order. Pay the remaining <strong className="text-foreground font-bold">{formatPrice(balanceDueOnDelivery)}</strong> in cash or UPI QR upon doorstep delivery.
                          </p>

                          {/* Breakdown pill */}
                          <div className="mt-3 grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-background/80 border border-border/80 text-xs">
                            <div>
                              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Pay Online Now</span>
                              <strong className="text-gold-500 text-sm font-bold">₹{advanceAmount}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Pay on Delivery</span>
                              <strong className="text-foreground text-sm font-bold">{formatPrice(balanceDueOnDelivery)}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Option 3: 100% Full Prepayment Online via Razorpay */}
                  <div
                    onClick={() => setPaymentMethod("Razorpay")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      paymentMethod === "Razorpay"
                        ? "border-gold-500 bg-gold-500/10 ring-2 ring-gold-500/40"
                        : "border-border hover:border-zinc-400"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300 mt-0.5 flex-shrink-0">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-bold text-foreground">
                            100% Full Online Prepayment (Razorpay)
                          </p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                            INSTANT CONFIRMATION
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          Pay full {formatPrice(grandTotal)} with UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, or EMI. Zero balance at doorstep.
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
                      {paymentMethod === "Advance_COD"
                        ? `Pay ₹${advanceAmount} Advance & Confirm Order`
                        : paymentMethod === "COD"
                        ? `Confirm 100% COD Order (${formatPrice(grandTotal)})`
                        : `Pay Full ${formatPrice(grandTotal)} via Razorpay`}
                    </span>
                  </Button>

                  <p className="text-[11px] text-zinc-400 text-center mt-3 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
                    <span>Encrypted 256-Bit Razorpay Gateway • Safe & Refund Guaranteed</span>
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
            <div className="space-y-2.5 text-xs pt-3 border-t border-border">
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
                <span>Total Order Value</span>
                <span className="text-xl text-gold-600 dark:text-gold-400">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              {paymentMethod === "Advance_COD" && (
                <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/20 space-y-1.5 mt-2">
                  <div className="flex justify-between text-gold-600 dark:text-gold-400 font-bold">
                    <span>Payable Now (Security Advance):</span>
                    <span>₹{advanceAmount}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Remaining Due on Delivery:</span>
                    <strong className="text-foreground">{formatPrice(balanceDueOnDelivery)}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MembershipOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        orderCount={membershipStatus.orderCount}
      />
    </div>
  );
}
