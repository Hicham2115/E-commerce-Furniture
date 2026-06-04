"use client";
import { useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MarqueeBar } from "@/components/MarqueeBar";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CategoriesSection } from "@/components/CategoriesSection";
import { CarouselSection } from "@/components/CarouselSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { ContactSection } from "@/components/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div className={loading ? "invisible" : "visible"}>
        <Navbar />
        <main>
          <HeroSection />
          <MarqueeBar />
          <FeaturedProducts />
          <CategoriesSection />
          <CarouselSection />
          <TestimonialSection />
          {/* <ContactSection /> */}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

