"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSX7C-bf_Cwiq-xXANuAF6IHmJfev7hZBVIkNW7loosbGm96GIt8D5vuTWo7Y7F2nuezuZ3-jjhR1KkhnKh4dDvuEUm_Ymf6c3WRCM3q2rhuBstTKjpbz3_BDJu_cwkZapKBaadu6rLdJnnnOztnJnozGMPQ5MwathRdJ1l2M-yIezH2tQTDFY5FsuTay_qXxURlahz0LHq2NaLnz08_MQebpEC-jlVB2MbP9RHR5Cw0PJsqHqNSSU8xEyTPQAI55iStXQMtEfMtsh",
    label: "[Crafting the Moment]",
    clipClass: "clip-poly-1",
    offsetClass: "",
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAawwcXXzz-CkfIUSvD26Gmrr8zQsJIIDBys-Wa9VfhwAt2ZFxg6q3mR2xvdubw6M228rZzHz_DjbKQ7Rna9O-0xFQLwKBL8NNA1in52jek7BDAs7uLUJQlyPeWiCTmF9Fn-ah2tRfukWf1sq4QDtH8_jOzlzGM63TlU-2hpIoxG6nltzRnOXIVLqDwZu7Th-4L6_C4LNozdDAKAUw-pFLQcK_4aye755HFZKXmUeMtd0uypj9ij1aIW69N8AlQV2vZwkGBHuFr8rrg",
    label: "[Timeless Rest]",
    clipClass: "clip-poly-asym",
    offsetClass: "pt-12",
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGrz2NoytoaKLrm_5JnKxsB01pvD5vZDT5MnPScelB7fBbzh-GUaclfuyD8VAwgIgQNd5VAP_AXDAq15i69kwoAC5VQBTa1zH3Un0KkzTnRf6lEN22UUgehyY8sVpm2Ed9ExgBNpp6bNRwAdI1LWs0HsB8o124YQLp1XlaD44kglCq-Rkw0z2SCLXa4lF9Y1JvSOqqFWUeamCv2kty1pNe0Oz8Yc_smnroGAk0CfVT3nJJClQWlSSm0kF21hl5d7tVFMYenYO6NBhE",
    label: "[Social Artistry]",
    clipClass: "clip-poly-2",
    offsetClass: "",
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkhNC2NtBjZ_fIm4PVDV_L86LHHkuxjOfclez3-xhaqlmLeefdCptG7WowSuT51_fmx38tbzEZok343ZAWCg08W5u9uvQVsnq86CW2k7dMeKjqpM8hxaRbHJd6L1pw0sftSWr1sM4vbjvVr65AzlZ6aEDo32kzCC1ny81g-cVKLfBsRAeNxK71Z2wSArzJDOw8K3XnqLiFZah-pE4lNdVuN34P_cjXmIwT7jVNfmF9kr4ZvROHjGu_YaVRlJTeYyAEL934sKJw5SG4",
    label: "[The Ritual]",
    clipClass: "clip-poly-1",
    offsetClass: "pt-24",
  },
];

export function CarouselSection() {
  const container = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      gsap.from(".carousel-header > *", {
        opacity: 0, y: 30, duration: 0.8, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: ".carousel-header", start: "top 85%" },
      });
    },
    { scope: container }
  );

  function scrollTo(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - 20, behavior: "smooth" });
    setActiveIndex(index);
  }

  function prev() {
    const next = Math.max(0, activeIndex - 1);
    scrollTo(next);
  }

  function next() {
    const nextIdx = Math.min(slides.length - 1, activeIndex + 1);
    scrollTo(nextIdx);
  }

  return (
    <section ref={container} className="py-40">
      {/* Header */}
      <div className="carousel-header px-5 md:px-16 flex justify-between items-end mb-16">
        <div>
          <h2
            className="text-[36px] md:text-[48px] font-medium leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            ©maison —<br />signature collection
          </h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={prev}
            aria-label="Previous"
            className="w-12 h-12 rounded-full border border-[#c4c7c7] flex items-center justify-center hover:bg-[#1c1b1b] hover:text-white hover:border-[#1c1b1b] transition-colors"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="w-12 h-12 rounded-full border border-[#c4c7c7] flex items-center justify-center hover:bg-[#1c1b1b] hover:text-white hover:border-[#1c1b1b] transition-colors"
          >
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scroll track */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar gap-6 px-5 md:px-16 pb-12 snap-x snap-mandatory"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`min-w-[320px] md:min-w-[450px] snap-start space-y-6 flex-shrink-0 ${slide.offsetClass}`}
          >
            <div className={`aspect-3/4 overflow-hidden ${slide.clipClass} bg-[#f1edec]`}>
              <img
                src={slide.image}
                alt={slide.label}
                className="w-full h-full object-cover"
              />
            </div>
            <p
              className="text-[11px] tracking-wider text-center opacity-70"
              style={{ fontFamily: "var(--font-dm), 'DM Sans', sans-serif" }}
            >
              {slide.label}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="mt-8 px-5 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1 transition-all duration-300 ${
              activeIndex === i ? "w-12 bg-[#1c1b1b]" : "w-12 bg-[#c4c7c7]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
