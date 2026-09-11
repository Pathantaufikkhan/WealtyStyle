import { HeroSection } from "@/components/home/HeroSection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { CinematicFilmShowcase } from "@/components/home/CinematicFilmShowcase";
import { TrendingSection } from "@/components/home/TrendingSection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { WhyGlamstep } from "@/components/home/WhyGlamstep";
import { LookbookGallery } from "@/components/home/LookbookGallery";
import { DeferredHomeSection } from "@/components/home/DeferredHomeSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Cinematic Luxury Hero */}
      <HeroSection />

      {/* 2. Three Large Category Showcase Cards */}
      <CategoryShowcase />

      {/* 3. 4K Macro Craftsmanship CinemaScope Explorer */}
      <DeferredHomeSection minHeight="720px">
        <CinematicFilmShowcase />
      </DeferredHomeSection>

      {/* 4. Trending Now 8-Product Grid */}
      <DeferredHomeSection minHeight="620px">
        <TrendingSection />
      </DeferredHomeSection>

      {/* 5. Best Sellers Spotlight */}
      <DeferredHomeSection minHeight="620px">
        <BestSellersSection />
      </DeferredHomeSection>

      {/* 6. Why WEALTHY STYLE Standards of Excellence */}
      <DeferredHomeSection minHeight="480px">
        <WhyGlamstep />
      </DeferredHomeSection>

      {/* 7. 35mm Cinematic Atelier Reel */}
      <DeferredHomeSection minHeight="900px">
        <LookbookGallery />
      </DeferredHomeSection>
    </div>
  );
}
