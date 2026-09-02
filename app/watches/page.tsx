import { Metadata } from "next";
import { products } from "@/lib/data/products";
import { CategoryCatalogView } from "@/components/products/CategoryCatalogView";

export const metadata: Metadata = {
  title: "Haute Horlogerie — Automatic Skeleton & Chronograph Watches",
  description:
    "Immerse yourself in Swiss and Japanese mechanical engineering, tourbillon automatic skeletons, 300m ceramic divers, and ultra-thin dress watches.",
};

export default function WatchesPage() {
  return (
    <CategoryCatalogView
      categorySlug="watches"
      allProducts={products}
    />
  );
}
