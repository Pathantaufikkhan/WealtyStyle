import { Metadata } from "next";
import { products } from "@/lib/data/products";
import { CategoryCatalogView } from "@/components/products/CategoryCatalogView";

export const metadata: Metadata = {
  title: "New Arrivals 2025 — Haute Couture Collection",
  description:
    "Explore the latest seasonal releases in luxury eyewear, Goodyear footwear, and horological innovations.",
};

export default function NewArrivalsPage() {
  const newArrivals = products.filter((p) => p.isNewArrival);

  return (
    <CategoryCatalogView
      customTitle="New Arrivals 2025"
      customDescription="Fresh from our artisanal partner workshops in Milan, Florence, and Geneva."
      customHeroImage="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
      allProducts={newArrivals.length > 0 ? newArrivals : products}
    />
  );
}
