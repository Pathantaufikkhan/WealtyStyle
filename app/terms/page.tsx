import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions of service for GLAMSTEP Maison.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
            Terms of Service
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tight mt-1">
            Terms & Conditions
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Updated: January 2025 | GLAMSTEP Luxury India Private Limited
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or acquiring items from GLAMSTEP (&quot;the Maison&quot;), you acknowledge and agree to be bound by these Terms and Conditions and all applicable laws and regulations of India.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            2. Product Authenticity & Pricing
          </h2>
          <p>
            All products listed on GLAMSTEP are 100% genuine and sourced directly from certified ateliers. Prices displayed are in Indian Rupees (INR) and include applicable Goods and Services Tax (GST). Prices and promotional discounts are validated on the server at checkout.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            3. Intellectual Property
          </h2>
          <p>
            All brand trademarks, high-definition photography, editorial copy, and website interface design are the exclusive intellectual property of GLAMSTEP and its content licensors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            4. Governing Jurisdiction
          </h2>
          <p>
            Any disputes arising out of your purchase or interaction with GLAMSTEP shall be subject to the exclusive jurisdiction of the courts in Gurugram / New Delhi, India.
          </p>
        </section>
      </div>
    </div>
  );
}
