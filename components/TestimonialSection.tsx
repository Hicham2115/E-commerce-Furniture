"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    num: "01",
    name: "Emma Williams",
    role: "Interior Architect",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80",
    quote:
      '"Everything is absolutely perfect! From the material quality to the flawless fit every piece feels premium. This brand has completely transformed my client\'s penthouse experience."',
    rating: 5,
    reviews: "49 Reviews",
  },
  {
    num: "02",
    name: "James Thornton",
    role: "Property Developer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    quote:
      '"MAISON pieces have become the signature of every project I develop. The craftsmanship is extraordinary — clients immediately notice the difference in quality and presence."',
    rating: 5,
    reviews: "31 Reviews",
  },
  {
    num: "03",
    name: "Sofia Marchetti",
    role: "Luxury Home Stylist",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
    quote:
      '"I\'ve sourced furniture from across Europe and nothing compares. The attention to detail, the materials, the packaging — every touchpoint feels intentional and refined."',
    rating: 5,
    reviews: "62 Reviews",
  },
  {
    num: "04",
    name: "Karim El Fassi",
    role: "Boutique Hotel Owner",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    quote:
      '"We furnished our entire hotel with MAISON pieces. Guests constantly ask about the furniture — it\'s become part of our brand identity. An investment that pays for itself."',
    rating: 5,
    reviews: "18 Reviews",
  },
];

export function TestimonialSection() {
  const container = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const current = testimonials[index % testimonials.length];

  useGSAP(
    () => {
      gsap.from(".testi-left > *", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".testi-left", start: "top 80%" },
      });
      gsap.from(".testi-quote", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: ".testi-quote", start: "top 80%" },
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} className="py-40 px-5 md:px-16 bg-[#f5f2f0]">
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left col */}
        <div className="testi-left col-span-12 md:col-span-4 space-y-12">
          <div className="flex items-baseline gap-2">
            <span
              className="text-[48px] font-medium"
              style={{
                fontFamily:
                  "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
              }}
            >
              {current.num}
            </span>
            <span className="text-[18px] text-[#c4c7c7]">
              / {testimonials.length}
            </span>
          </div>

          <div className="space-y-2">
            <h5
              className="text-[32px] font-medium"
              style={{
                fontFamily:
                  "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
              }}
            >
              [{current.name}]
            </h5>
            <p className="text-[11px] tracking-widest uppercase text-[#444748]">
              {current.role}
            </p>
          </div>

          <div className="w-full aspect-square overflow-hidden clip-poly-asym bg-[#fdf8f8]">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover grayscale"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIndex((i) => i - 1)}
              disabled={index === 0}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-[#c4c7c7] flex items-center justify-center hover:bg-[#1c1b1b] hover:text-white hover:border-[#1c1b1b] transition-colors disabled:opacity-30"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIndex((i) => i + 1)}
              disabled={index >= testimonials.length - 1}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-[#c4c7c7] flex items-center justify-center hover:bg-[#1c1b1b] hover:text-white hover:border-[#1c1b1b] transition-colors disabled:opacity-30"
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right col — quote */}
        <div className="testi-quote col-span-12 md:col-start-6 md:col-span-7 flex flex-col justify-center min-h-[600px] relative">
          <span className="text-[80px] leading-none absolute -top-10 -left-10 opacity-10 select-none">
            "
          </span>

          <div className="space-y-8">
            <h2
              className="text-[32px] md:text-[48px] leading-[1.1] font-medium text-[#1c1b1b]"
              style={{
                fontFamily:
                  "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
              }}
            >
              {current.quote}
            </h2>

            <div className="flex items-center gap-6">
              <div className="flex text-[#e4c285]">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className="h-5 w-5 fill-[#e4c285]"
                  />
                ))}
              </div>
              <span className="text-[12px] tracking-wider">
                5.0 ({current.reviews})
              </span>
            </div>
          </div>

          <div className="mt-12 flex justify-between items-center border-t border-[#c4c7c7]/30 pt-8">
            <span className="text-[11px] tracking-wider text-[#444748]">
              See What Our Customers Are Saying
            </span>
            <span className="text-[40px] leading-none opacity-20 select-none">
              "
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
