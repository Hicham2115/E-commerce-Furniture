"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 2.3 });
      tl.from([".hero-text-left", ".hero-text-right"], {
        x: (i) => (i % 2 === 0 ? -100 : 100),
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.2,
      })
        .from(".hero-image", { opacity: 0, clipPath: "inset(100% 0 0 0)", duration: 1.5, ease: "expo.out" }, "-=1.2")
        .from(".hero-left-text", { opacity: 0, x: -20, duration: 0.7, ease: "power3.out" }, "-=0.8")
        .from(".hero-stat", { opacity: 0, scale: 0.8, duration: 0.6, ease: "back.out(1.7)" }, "-=0.5")
        .from(".hero-scroll", { opacity: 0, duration: 0.4 }, "-=0.2");
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="relative min-h-svh flex flex-col justify-center items-center pt-24 overflow-hidden px-5 md:px-16"
    >
      {/* Main 12-col grid */}
      <div className="z-10 w-full grid grid-cols-12 gap-6 items-center">
        {/* Col 1–4: text content */}
        <div className="hero-left-text col-span-12 md:col-span-4 self-center space-y-8 order-2 md:order-1">
          <div className="space-y-4">
            <span className="font-mono text-[11px] tracking-wider text-[#444748]">
              //FURNITURE
            </span>
            <p className="text-[18px] leading-[1.6] text-[#444748] max-w-xs"
              style={{ fontFamily: "var(--font-dm), 'DM Sans', sans-serif" }}>
              Explore curated collections of exclusive drops and everyday
              essentials all thoughtfully designed for living.
            </p>
            <span className="block font-mono text-[12px] tracking-wider mt-8 italic text-[#444748]">
              / New Collection 2026
            </span>
          </div>
        </div>

        {/* Col 5–8: hero image */}
        <div className="col-span-12 md:col-span-4 order-1 md:order-2 relative flex justify-center">
          <div className="hero-image w-full max-w-md">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsKI0vQ7Y27LTpPvfJL4Urken8JD__1TBP5S52aTlndjkNr1eCyaDdE5SbVFrunv0B2qF9Ie4k1jSwmwrsKwznxsY-vwgh5aWpahZhQeYPtCnkfpNbqb-fdplr_qeNSkuEWGOyrkjJyoU1z_YpK1yNuTL3aRpW-8p93p70V2dO_hrpN3f4SMI7ePhCPVSesalFxbkXDjD9hxQI7G6hJ-9YpzezmhgbUNFHZNPoSmZRe7W__X9WsZhgMxx237wcXf_Nh2uSDThGsaEv"
              alt="Sculptural luxury armchair"
              className="w-full h-auto object-cover clip-poly-asym scale-110"
            />
          </div>
        </div>

        {/* Col 9–12: stat */}
        <div className="hero-stat col-span-12 md:col-span-4 self-end space-y-12 order-3 text-right">
          <div className="flex flex-col items-end gap-2">
            <div className="flex -space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full border-2 border-[#fdf8f8] bg-[#f1edec]" />
              <div className="w-10 h-10 rounded-full border-2 border-[#fdf8f8] bg-[#f1edec]" />
              <div className="w-10 h-10 rounded-full border-2 border-[#fdf8f8] bg-[#fedb9b] flex items-center justify-center text-[#1c1b1b] text-sm font-bold">
                +
              </div>
            </div>
            <h3
              className="text-[48px] leading-none font-medium tracking-tight text-[#1c1b1b]"
              style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
            >
              280K
            </h3>
            <span className="text-[12px] tracking-wider uppercase text-[#444748]">
              People We Inspire
            </span>
          </div>
        </div>
      </div>

      {/* Ghost background text */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none -z-10 px-5 md:px-16">
        <div className="flex justify-between items-baseline opacity-[0.07]">
          <h2
            className="hero-text-left text-[120px] md:text-[220px] uppercase leading-none font-medium tracking-tight"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            where
          </h2>
          <h2
            className="hero-text-right text-[120px] md:text-[220px] uppercase leading-none font-medium tracking-tight"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            lives
          </h2>
        </div>
        <div className="flex justify-between items-baseline -mt-10 md:-mt-20 opacity-[0.07]">
          <h2
            className="hero-text-left text-[120px] md:text-[220px] uppercase leading-none font-medium tracking-tight"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            — style
          </h2>
          <h2
            className="hero-text-right text-[120px] md:text-[220px] uppercase leading-none font-medium tracking-tight"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            — now
          </h2>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown aria-hidden="true" className="h-6 w-6 text-[#1c1b1b]/50" />
      </div>
    </section>
  );
}
