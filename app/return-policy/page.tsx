import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Exchange Policy",
  description: "GLAMSTEP's complimentary 7-day doorstep return and exchange policy.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
            Hassle-Free Returns
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tight mt-1">
            7-Day Return & Exchange Policy
          </h1>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            1. Our 7-Day Privilege Window
          </h2>
          <p>
            We want you to be entirely satisfied with your selection. If the fit, size, or style is not strictly perfect, you may request a doorstep return or size exchange within <strong>7 calendar days</strong> of receiving your delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            2. Return Conditions
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Item must remain unworn, unwashed, and without scratches.</li>
            <li>All original luxury leather cases, dust bags, authenticity NFC tags, and packaging must be present.</li>
            <li>Footwear soles must show zero outdoor scuffs (we recommend trying shoes on carpeted surfaces).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            3. Free Reverse Doorstep Pickup
          </h2>
          <p>
            Once requested, our courier representative will arrive at your registered address with a pre-labeled security bag. No printing or courier drop-offs required.
          </p>
        </section>
      </div>
    </div>
  );
}
