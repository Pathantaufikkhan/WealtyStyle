import { HeroSection } from "@/components/home/HeroSection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { CinematicFilmShowcase } from "@/components/home/CinematicFilmShowcase";
import { TrendingSection } from "@/components/home/TrendingSection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { WhyGlamstep } from "@/components/home/WhyGlamstep";
import { LookbookGallery } from "@/components/home/LookbookGallery";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Cinematic Luxury Hero */}
      <HeroSection />

      {/* 2. Three Large Category Showcase Cards */}
      <CategoryShowcase />

      {/* 3. 4K Macro Craftsmanship CinemaScope Explorer */}
      <CinematicFilmShowcase />

      {/* 4. Trending Now 8-Product Grid */}
      <TrendingSection />

      {/* 5. Best Sellers Spotlight */}
      <BestSellersSection />

      {/* 6. Why WEALTHY STYLE Standards of Excellence */}
      <WhyGlamstep />

      {/* 7. 35mm Cinematic Atelier Reel */}
      <LookbookGallery />
    </div>
  );
}
