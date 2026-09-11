"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to dispatch message");
      }

      setIsSent(true);
      toast.success("Your inquiry has been dispatched to glamstepofficial1@gmail.com!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to transmit message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const faqs = [
    {
      q: "How can I verify the authenticity of my WEALTHY STYLE purchase?",
      a: "Every product includes an individually numbered NFC / QR Certificate of Authenticity that links directly to its verified batch record from our partner workshops in Florence, Japan, or Geneva.",
    },
    {
      q: "What is your standard delivery timeline across India?",
      a: "Metro orders (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata) are delivered in 24 to 48 hours via Bluedart Air Express. Other locations take 2 to 4 business days.",
    },
    {
      q: "How does the 7-day return and exchange policy work?",
      a: "Simply request a return from your Account order history or email glamstepofficial1@gmail.com. Our courier will pick up the package from your doorstep at no additional charge.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support Razorpay 256-bit encrypted checkout with UPI (GPay, PhonePe, Paytm), All Major Credit/Debit Cards, Net Banking, and Cash on Delivery (COD).",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-gold-500 text-xs font-bold uppercase tracking-[0.25em]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Maison Concierge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-foreground uppercase tracking-tight">
            Client Concierge & Support
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Our dedicated client advisors are available 24/7 for styling consultations, order inquiries, and bespoke sizing requests.
          </p>
        </div>

        {/* 2-Col: Left Info Cards, Right Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-card border border-border space-y-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
                Direct Contact Channels
              </h3>

              <div className="space-y-4 text-xs">
                {/* Official Concierge Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gold-500/10 text-gold-500 border border-gold-500/20 flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-foreground block mb-0.5">
                      Client Concierge Direct Email
                    </strong>
                    <a
                      href="mailto:glamstepofficial1@gmail.com"
                      className="text-gold-500 font-semibold hover:underline block text-sm"
                    >
                      glamstepofficial1@gmail.com
                    </a>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Avg reply time: &lt; 15 mins
                    </span>
                  </div>
                </div>

                {/* VIP Hotline & WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gold-500/10 text-gold-500 border border-gold-500/20 flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-foreground block mb-0.5">
                      VIP Hotline & WhatsApp
                    </strong>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-gold-500 block"
                    >
                      +91 98765 43210 (WhatsApp Available)
                    </a>
                    <p className="text-zinc-500">+91 (800) WEALTHY-STYLE</p>
                  </div>
                </div>

                {/* Maison HQ */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gold-500/10 text-gold-500 border border-gold-500/20 flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-foreground block mb-0.5">
                      Maison Headquarters
                    </strong>
                    <p className="text-zinc-500 leading-relaxed">
                      WEALTHY STYLE Luxury Atelier, Level 14, Horizon Center, Golf Course Road, DLF Phase 5, Gurugram, Haryana 122002, India.
                    </p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gold-500/10 text-gold-500 border border-gold-500/20 flex-shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-foreground block mb-0.5">
                      Advising Hours
                    </strong>
                    <p className="text-zinc-500">Monday - Sunday: 9:00 AM to 10:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Message Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm">
            <h3 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider mb-1">
              Send a Direct Message
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Your inquiry will be sent directly to our executive concierge inbox at <strong className="text-gold-500">glamstepofficial1@gmail.com</strong>.
            </p>

            {isSent ? (
              <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-foreground">
                  Inquiry Transmitted Successfully
                </h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Thank you, <strong>{name}</strong>. Your message was delivered to <strong>glamstepofficial1@gmail.com</strong>. A client concierge advisor will respond to <strong>{email}</strong> shortly.
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    setIsSent(false);
                    setName("");
                    setEmail("");
                    setPhone("");
                    setSubject("");
                    setMessage("");
                  }}
                  className="mt-4"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikramaditya Roy"
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number (WhatsApp)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                  />
                  <Input
                    label="Inquiry Topic / Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Custom Sizing / Order Consultation"
                  />
                </div>

                <Textarea
                  label="Inquiry Details *"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our maison concierge assist your personal styling or order inquiry?"
                  rows={5}
                  required
                />

                <Button
                  type="submit"
                  variant="gold"
                  isLoading={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-2 font-bold tracking-widest text-xs uppercase"
                >
                  <Send className="h-4 w-4" />
                  <span>Transmit to Concierge</span>
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Store FAQs Section */}
        <div id="faqs" className="pt-12 border-t border-border space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
              Assistance & Guidance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-card border border-border/80 space-y-2 shadow-sm"
              >
                <h4 className="font-serif text-sm font-bold text-foreground">
                  {faq.q}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
