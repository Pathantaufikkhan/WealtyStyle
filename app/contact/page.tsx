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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSent(true);
    toast.success("Your message has been received by our VIP Concierge team.");
  };

  const faqs = [
    {
      q: "How can I verify the authenticity of my GLAMSTEP purchase?",
      a: "Every product includes an individually numbered NFC / QR Certificate of Authenticity that links directly to its verified batch record from our partner workshops in Florence, Japan, or Geneva.",
    },
    {
      q: "What is your standard delivery timeline in India?",
      a: "Metro orders (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata) are delivered in 24 to 48 hours via Bluedart Air Courier. Other locations take 2 to 4 business days.",
    },
    {
      q: "How does the 7-day return and exchange policy work?",
      a: "Simply request a return from your Account order history or WhatsApp concierge. Our courier will pick up the package from your doorstep at no additional charge.",
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
            <div className="p-6 rounded-2xl bg-card border border-border space-y-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
                Maison Contact Channels
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gold-500/10 text-gold-500 border border-gold-500/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-foreground block mb-0.5">
                      Client Concierge Email
                    </strong>
                    <p className="text-zinc-500">concierge@glamstep.luxury</p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Avg reply time: &lt; 15 mins
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gold-500/10 text-gold-500 border border-gold-500/20">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-foreground block mb-0.5">
                      VIP Hotline & WhatsApp
                    </strong>
                    <p className="text-zinc-500">+91 (800) GLAM-STEP (4526-7837)</p>
                    <p className="text-zinc-500">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gold-500/10 text-gold-500 border border-gold-500/20">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-foreground block mb-0.5">
                      Maison Headquarters
                    </strong>
                    <p className="text-zinc-500 leading-relaxed">
                      GLAMSTEP Luxury Atelier, Level 14, Horizon Center, Golf Course Road, DLF Phase 5, Gurugram, Haryana 122002, India.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gold-500/10 text-gold-500 border border-gold-500/20">
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
            <h3 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider mb-2">
              Send a Direct Message
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Fill in your inquiry details below and a senior concierge advisor will connect with you.
            </p>

            {isSent ? (
              <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-foreground">
                  Inquiry Dispatched to Concierge
                </h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Thank you, <strong>{name}</strong>. An advisor has been assigned and will reply to <strong>{email}</strong> shortly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSent(false)}
                  className="mt-4"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikramaditya Roy"
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    required
                  />
                </div>

                <Input
                  label="Subject / Topic"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Sizing inquiry on Firenze Leather Oxford"
                />

                <Textarea
                  label="Inquiry Details"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our maison concierge assist your personal styling?"
                  rows={5}
                  required
                />

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full h-12 flex items-center justify-center gap-2 font-bold tracking-widest text-xs"
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
