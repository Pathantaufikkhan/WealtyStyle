import { Metadata } from "next";
import { products } from "@/lib/data/products";
import { CategoryCatalogView } from "@/components/products/CategoryCatalogView";

export const metadata: Metadata = {
  title: "Artisanal Italian Leather Shoes & Footwear",
  description:
    "Discover handcrafted Florentine calfskin oxfords, Goodyear welted dress shoes, suede loafers, and luxury minimalist sneakers.",
};

export default function ShoesPage() {
  return (
    <CategoryCatalogView
      categorySlug="shoes"
      allProducts={products}
    />
  );
}
