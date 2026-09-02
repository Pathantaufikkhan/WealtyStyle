import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "GLAMSTEP's Pan-India insured express shipping guidelines and timelines.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
            Logistics & Fulfillment
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tight mt-1">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Pan-India Insured Express Network | Partnered with Bluedart & Delhivery
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            1. Complimentary Express Shipping Threshold
          </h2>
          <p>
            We are pleased to offer complimentary insured express courier delivery on all orders valued at <strong>₹2,499 and above</strong> across all serviceable PIN codes in India. For orders below ₹2,499, a flat standard courier fee of ₹199 applies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            2. Transit Timelines
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Tier 1 Metro Hubs:</strong> 24 to 48 hours delivery (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata).</li>
            <li><strong>Tier 2 & 3 Cities:</strong> 2 to 4 business days.</li>
            <li><strong>Remote & Mountainous Regions:</strong> 4 to 6 business days.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            3. Real-Time Tracking & Climate Packaging
          </h2>
          <p>
            As soon as your acquisition departs our atelier, you will receive an automated SMS and email notification containing your Bluedart / Delhivery tracking link. All creations are encased in tamper-evident, impact-resistant climate-controlled packaging.
          </p>
        </section>
      </div>
    </div>
  );
}
