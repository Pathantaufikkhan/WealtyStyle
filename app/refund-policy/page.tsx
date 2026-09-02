import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "GLAMSTEP's seamless refund processing guidelines.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-500">
            Client Protection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tight mt-1">
            Refund & Cancellation Policy
          </h1>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            1. Refund Processing Window
          </h2>
          <p>
            Once a returned item is received at our fulfillment center and passes inspection (unworn with original tags, certificates, and presentation case intact), your refund will be triggered immediately.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>UPI & Net Banking:</strong> 24 to 48 business hours.</li>
            <li><strong>Credit & Debit Cards:</strong> 3 to 5 business days depending on your issuing bank.</li>
            <li><strong>Cash on Delivery (COD):</strong> Instant bank transfer / UPI disbursement upon verification.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-foreground uppercase tracking-wider">
            2. Cancellation Before Dispatch
          </h2>
          <p>
            Orders can be cancelled at zero penalty prior to dispatch through your Account Orders tab or by notifying the WhatsApp concierge.
          </p>
        </section>
      </div>
    </div>
  );
}
