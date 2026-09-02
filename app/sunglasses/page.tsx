import { Metadata } from "next";
import { products } from "@/lib/data/products";
import { CategoryCatalogView } from "@/components/products/CategoryCatalogView";

export const metadata: Metadata = {
  title: "Handcrafted Luxury Sunglasses & Polarized Eyewear",
  description:
    "Explore GLAMSTEP's designer collection of Japanese titanium aviators, Italian acetate wayfarers, and UV400 polarized shades.",
};

export default function SunglassesPage() {
  return (
    <CategoryCatalogView
      categorySlug="sunglasses"
      allProducts={products}
    />
  );
}
