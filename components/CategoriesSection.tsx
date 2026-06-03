"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { num: "[01]", name: "LIVING ROOM", count: "(174)", active: false },
  { num: "[02]", name: "BEDROOM", count: "(361)", active: true },
  { num: "[03]", name: "KITCHEN", count: "(117)", active: false },
  { num: "[04]", name: "OFFICE", count: "(92)", active: false },
];

export function CategoriesSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.set(".cat-img", { clipPath: "inset(100% 0 0 0)" });
      gsap.to(".cat-img", {
        clipPath: "inset(0% 0 0 0)",
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cat-img", start: "top 80%" },
      });
      gsap.from(".cat-text-block > *", {
        opacity: 0, y: 30, duration: 0.8, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: ".cat-text-block", start: "top 80%" },
      });

      // Category hover micro-interactions
      document.querySelectorAll(".cat-row").forEach((row) => {
        row.addEventListener("mouseenter", () => {
          gsap.to((row as HTMLElement).querySelector("h3"), { scale: 1.05, duration: 0.3 });
        });
        row.addEventListener("mouseleave", () => {
          gsap.to((row as HTMLElement).querySelector("h3"), { scale: 1, duration: 0.3 });
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-40 px-5 md:px-16 bg-[#fdf8f8]">
      <div className="grid grid-cols-12 gap-6 items-center">
        {/* Left: image */}
        <div className="col-span-12 md:col-span-5 cat-img">
          <div className="relative aspect-square overflow-hidden clip-poly-1 group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZuRuO51jgalOAuC-LFEUJ6QeGlM0D720a3K-MVRQQGnCtEStcCNpVxFXqR2eo63wsI8WYa-M8jLKxJ7N3_sw-gtkEmu2Fj6UMMC572wbXvskGHHBAZLG8PGfyNbdmR1kWQAfGeRtpENir-Qsy33vONwp7pFPDXgOfoPkdALlO6VCJqlBL6aN_96hs9D7KIKoSu6Okew1HQICFNVwhPBfVXAuCBqqcutlf7o76wQ-AHIiyom7GjkimSChSxbWrVQ3SkkQOlIcaP1iG"
              alt="Interior detail"
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right: text + categories */}
        <div className="cat-text-block col-span-12 md:col-start-7 md:col-span-6 space-y-12">
          {/* Description + CTA */}
          <div className="space-y-4 max-w-md">
            <p className="text-[18px] leading-[1.6] text-[#444748]"
              style={{ fontFamily: "var(--font-dm), 'DM Sans', sans-serif" }}>
              Every piece carries rhythm beyond function—it's motion and meaning
              where residential energy meets architectural purity.
            </p>
            <button className="border border-[#1c1b1b] px-8 py-3 flex items-center gap-4 rounded-full text-[12px] tracking-widest uppercase hover:bg-[#1c1b1b] hover:text-white transition-colors">
              SEE PRODUCT
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Category list */}
          <div className="divide-y divide-[#c4c7c7]/30">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="cat-row group flex items-end justify-between py-6 cursor-pointer hover:pl-4 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-[11px] tracking-wider opacity-50 mt-2"
                    style={{ fontFamily: "var(--font-dm), 'DM Sans', sans-serif" }}>
                    {cat.num}
                  </span>
                  <h3
                    className={`text-[48px] md:text-[64px] leading-none font-medium tracking-tight transition-all duration-300 group-hover:font-extrabold group-hover:text-[#1c1b1b] ${
                      cat.active ? "text-[#1c1b1b]" : "text-[#c4c7c7]"
                    }`}
                    style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {cat.name}
                  </h3>
                </div>
                <span className={`text-[18px] leading-relaxed ${cat.active ? "text-[#1c1b1b]" : "text-[#c4c7c7]"}`}>
                  {cat.count}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pr-4 italic text-[11px] tracking-wider opacity-50"
            style={{ fontFamily: "var(--font-dm), 'DM Sans', sans-serif" }}>
            [CATEGORIES] ................
          </div>
        </div>
      </div>
    </section>
  );
}
