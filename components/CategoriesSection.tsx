"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    num: "[01]", name: "LIVING ROOM", count: "(174)", active: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZuRuO51jgalOAuC-LFEUJ6QeGlM0D720a3K-MVRQQGnCtEStcCNpVxFXqR2eo63wsI8WYa-M8jLKxJ7N3_sw-gtkEmu2Fj6UMMC572wbXvskGHHBAZLG8PGfyNbdmR1kWQAfGeRtpENir-Qsy33vONwp7pFPDXgOfoPkdALlO6VCJqlBL6aN_96hs9D7KIKoSu6Okew1HQICFNVwhPBfVXAuCBqqcutlf7o76wQ-AHIiyom7GjkimSChSxbWrVQ3SkkQOlIcaP1iG",
  },
  {
    num: "[02]", name: "BEDROOM", count: "(361)", active: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAawwcXXzz-CkfIUSvD26Gmrr8zQsJIIDBys-Wa9VfhwAt2ZFxg6q3mR2xvdubw6M228rZzHz_DjbKQ7Rna9O-0xFQLwKBL8NNA1in52jek7BDAs7uLUJQlyPeWiCTmF9Fn-ah2tRfukWf1sq4QDtH8_jOzlzGM63TlU-2hpIoxG6nltzRnOXIVLqDwZu7Th-4L6_C4LNozdDAKAUw-pFLQcK_4aye755HFZKXmUeMtd0uypj9ij1aIW69N8AlQV2vZwkGBHuFr8rrg",
  },
  {
    num: "[03]", name: "KITCHEN", count: "(117)", active: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGrz2NoytoaKLrm_5JnKxsB01pvD5vZDT5MnPScelB7fBbzh-GUaclfuyD8VAwgIgQNd5VAP_AXDAq15i69kwoAC5VQBTa1zH3Un0KkzTnRf6lEN22UUgehyY8sVpm2Ed9ExgBNpp6bNRwAdI1LWs0HsB8o124YQLp1XlaD44kglCq-Rkw0z2SCLXa4lF9Y1JvSOqqFWUeamCv2kty1pNe0Oz8Yc_smnroGAk0CfVT3nJJClQWlSSm0kF21hl5d7tVFMYenYO6NBhE",
  },
  {
    num: "[04]", name: "OFFICE", count: "(92)", active: false,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkhNC2NtBjZ_fIm4PVDV_L86LHHkuxjOfclez3-xhaqlmLeefdCptG7WowSuT51_fmx38tbzEZok343ZAWCg08W5u9uvQVsnq86CW2k7dMeKjqpM8hxaRbHJd6L1pw0sftSWr1sM4vbjvVr65AzlZ6aEDo32kzCC1ny81g-cVKLfBsRAeNxK71Z2wSArzJDOw8K3XnqLiFZah-pE4lNdVuN34P_cjXmIwT7jVNfmF9kr4ZvROHjGu_YaVRlJTeYyAEL934sKJw5SG4",
  },
];

export function CategoriesSection() {
  const container = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [prevIndex, setPrevIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

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
    },
    { scope: container }
  );

  function handleCategoryEnter(index: number) {
    if (index === activeIndex || transitioning) return;
    setPrevIndex(activeIndex);
    setActiveIndex(index);
    setTransitioning(true);
    setTimeout(() => setTransitioning(false), 600);
  }

  return (
    <section ref={container} className="py-40 px-5 md:px-16 bg-[#fdf8f8]">
      <div className="grid grid-cols-12 gap-6 items-center">
        {/* Left: image with crossfade */}
        <div className="col-span-12 md:col-span-5 cat-img">
          <div className="relative aspect-square overflow-hidden clip-poly-1">
            {/* Previous image fades out */}
            <img
              key={`prev-${prevIndex}`}
              src={categories[prevIndex].image}
              alt={categories[prevIndex].name}
              className={`absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-500 ${
                transitioning ? "opacity-0" : "opacity-0"
              }`}
            />
            {/* Active image fades in */}
            <img
              key={`active-${activeIndex}`}
              src={categories[activeIndex].image}
              alt={categories[activeIndex].name}
              className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 ease-in-out hover:grayscale-0 hover:scale-105"
              style={{ animation: "fadeIn 0.6s ease-in-out" }}
            />
          </div>
        </div>

        {/* Right: text + categories */}
        <div className="cat-text-block col-span-12 md:col-start-7 md:col-span-6 space-y-12">
          <div className="space-y-4 max-w-md">
            <p className="text-[18px] leading-[1.6] text-[#444748]">
              Every piece carries rhythm beyond function—it's motion and meaning
              where residential energy meets architectural purity.
            </p>
            <button className="cursor-pointer border border-[#1c1b1b] px-8 py-3 flex items-center gap-4 rounded-full text-[12px] tracking-widest uppercase transition-all duration-300 hover:bg-[#1c1b1b] hover:text-white">
              SEE PRODUCT
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Category list */}
          <div className="divide-y divide-[#c4c7c7]/30">
            {categories.map((cat, i) => {
              const isActive = activeIndex === i;
              return (
                <div
                  key={cat.name}
                  onMouseEnter={() => handleCategoryEnter(i)}
                  className="cat-row group flex items-end justify-between py-6 cursor-pointer hover:pl-4 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[11px] tracking-wider opacity-50 mt-2">
                      {cat.num}
                    </span>
                    <h3
                      className={`text-[48px] md:text-[64px] leading-none tracking-tight transition-all duration-300 ${
                        isActive
                          ? "font-extrabold text-[#1c1b1b]"
                          : "font-medium text-[#c4c7c7] group-hover:font-extrabold group-hover:text-[#1c1b1b]"
                      }`}
                      style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                    >
                      {cat.name}
                    </h3>
                  </div>
                  <span className={`text-[18px] leading-relaxed transition-colors duration-300 ${isActive ? "text-[#1c1b1b]" : "text-[#c4c7c7]"}`}>
                    {cat.count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pr-4 italic text-[11px] tracking-wider opacity-50">
            [CATEGORIES] ................
          </div>
        </div>
      </div>
    </section>
  );
}
