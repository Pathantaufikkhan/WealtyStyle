import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "GLAMSTEP's commitment to personal data privacy and encryption standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
            Legal Transparency
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tight mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Effective Date: January 1, 2025 | GLAMSTEP Luxury India Private Limited
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            1. Overview & Data Philosophy
          </h2>
          <p>
            At GLAMSTEP, we treat your personal information with the same uncompromising standard of craftsmanship that defines our accessories. This Privacy Policy explains how we collect, safeguard, and use your data when you visit our website, communicate with our concierge, or acquire items from our collection.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Personal Identity:</strong> Full legal name, billing and delivery addresses, email address, contact telephone number.</li>
            <li><strong>Transaction Records:</strong> Payment gateway transaction IDs, order histories, applied promo vouchers. Note: Full card numbers and UPI PINs are processed directly via PCI-DSS Level 1 compliant Razorpay servers and are never stored on GLAMSTEP databases.</li>
            <li><strong>Device & Analytics Data:</strong> IP address, browser type, regional location, and referral paths to optimize page delivery speed and security.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            3. How We Use Your Data
          </h2>
          <p>
            Your information is used strictly to fulfill orders, transmit real-time delivery SMS/email tracking updates, administer 2-year international warranties, prevent fraudulent transactions, and deliver VIP concierge support.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            4. Security & Encryption Standards
          </h2>
          <p>
            All communications across our site are secured via 256-bit TLS/SSL encryption. Database access is governed by PostgreSQL Row Level Security (RLS) policies ensuring complete isolation of client records.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            5. Contact Our Data Protection Officer
          </h2>
          <p>
            For data inquiries, access requests, or removal, please contact: <strong className="text-foreground">privacy@glamstep.luxury</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
