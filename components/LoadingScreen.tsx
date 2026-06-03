"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".ls-logo", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" })
      .from(".ls-line", { scaleX: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.3")
      .from(".ls-tag", { opacity: 0, y: 10, duration: 0.5, ease: "power2.out" }, "-=0.1")
      .to(el.current, {
        opacity: 0,
        duration: 0.7,
        delay: 0.6,
        ease: "power2.inOut",
        onComplete,
      });
  }, []);

  return (
    <div
      ref={el}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#0d0d0b]"
    >
      <h1 className="ls-logo font-serif text-5xl tracking-[0.35em] text-white uppercase">
        MAISON
      </h1>
      <div className="ls-line mt-5 h-px w-20 bg-[#c9a96e] origin-left" />
      <p className="ls-tag mt-4 text-[10px] tracking-[0.45em] text-[#c9a96e] uppercase">
        Luxury Home Goods
      </p>
    </div>
  );
}
