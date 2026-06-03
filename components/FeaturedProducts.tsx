"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import type { Product } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const productOverrides = [
  {
    name: "Velour Sofa Case",
    tag: "©International - going distance 2026",
    price: "$120",
    badge: "[New Arrival]",
    clipClass: "clip-poly-1",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYoGYhzqnK_mOSFfEwA2MEhhTaE0t957CLNkTPiwtIqQJKsxrizxfdH8bDZ1ti3P6J80Uzaz-bIu3L_0AUSbNQd9Ak7WHqKt0vNhH0n0bWfe7FiVj4BbFGgmVxjX9LkMMcpXg7acUFzxx9qsCkraukUwbFcSoh318xG1A-DNHVroerFWCWuSh1XuXTBrHos-IHPPiKT2O4qZitDZP4Hhb9FFHbMyJqZaYjxhs9dlVmCI1zIIKxBxqYvD6E0Vs3xkaxs0L21Z4VhG-u",
    offset: false,
  },
  {
    name: "Lounge Armchair",
    tag: "©International - just do it 2026",
    price: "(45%)",
    badge: null,
    clipClass: "clip-poly-2",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCX0NJ5IZw6V8jp-Kl3K3yAAA_Dd02psPio3JHEybxSo370mpbLYrXmCuYl428miwPyyVm81opBCKf_u6eHmE-RcVeBOtBJZyRaZMYeGwjcvgAd7yqTy6hQgFpzlGKB41EiyFanuxytcXjwCrHnlm2AOBxBQWF81cws0jxK4UF2aub4mDMok47cQHX381wcQ9SruO23lhlBlWqwBXnGu_9VWh5dFngfocX0agwznEva-b0SoPJKmLNgRmie6Ayodwjv6QNP61ZCJzbY",
    offset: true,
  },
  {
    name: "Marble Center Table",
    tag: "©Maison - signature series 2026",
    price: "$840",
    badge: null,
    clipClass: "clip-poly-asym",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7OPJbVOBPbof7-SSXheApfVFQAMsoQeuNw3y7NygwxaOSJ2zKvVPeera1GuGN_eCwPZUyWRiW-dCm8GuIKkwO15fhtE-T-ewg2IRwjR3YCaWZIeeO6CpYlGAvslJwbO9trdOjQR5z5CxIEwM2CHtBayKOgepNuG_Ye1DKpIWkYQ1qryn4I09V0-BT5iEQ9SIj7sT0NDKZzCmwGtcGOC3QLwglXuRqU5ECvdtYrEP34CLKIJ323RuvJvMsjO3uvviYOivqvHD-8Cah",
    offset: false,
  },
];

function ProductSkeleton({ offset }: { offset: boolean }) {
  return (
    <div className={`space-y-6 ${offset ? "md:translate-y-12" : ""}`}>
      <Skeleton className="aspect-3/4 w-full rounded-none bg-[#e5e2e1]" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-3/4 bg-[#e5e2e1]" />
        <Skeleton className="h-6 w-2/3 bg-[#e5e2e1]" />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="col-span-3 py-20 text-center text-sm text-[#444748]">
      Could not load products: {message}
    </div>
  );
}

export function FeaturedProducts() {
  const container = useRef<HTMLElement>(null);

  const { data: products, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: queryKeys.products.list(3),
    queryFn: () => api.get("/products?limit=3").then((r) => r.data),
  });

  useGSAP(
    () => {
      gsap.from(".fp-header > *", {
        opacity: 0, y: 30, duration: 0.8, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: ".fp-header", start: "top 85%" },
      });

      if (products) {
        ScrollTrigger.refresh();
        gsap.set(".fp-card", { clipPath: "inset(100% 0 0 0)" });
        gsap.to(".fp-card", {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.5,
          ease: "expo.out",
          stagger: 0.3,
          scrollTrigger: { trigger: ".fp-grid", start: "top 80%" },
        });
      }
    },
    { scope: container, dependencies: [!!products] }
  );

  return (
    <section ref={container} className="py-40 px-5 md:px-16">
      {/* Header */}
      <div className="fp-header grid grid-cols-12 gap-6 mb-20">
        <div className="col-span-12 md:col-span-6">
          <h2
            className="text-[36px] md:text-[48px] font-medium leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            All — about<br />moments ©26
          </h2>
        </div>
        <div className="col-span-12 md:col-span-6 flex flex-col justify-end items-start md:items-end">
          <button className="border border-[#1c1b1b] px-8 py-4 flex items-center gap-4 group hover:bg-[#1c1b1b] hover:text-white transition-all duration-300 text-[12px] tracking-widest uppercase">
            Learn More
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="fp-grid grid grid-cols-1 md:grid-cols-3 gap-12">
        {isLoading &&
          productOverrides.map((p, i) => <ProductSkeleton key={i} offset={p.offset} />)}

        {isError && (
          <ErrorState
            message={
              axios.isAxiosError(error)
                ? (error.response?.data?.message ?? error.message)
                : (error as Error).message
            }
          />
        )}

        {products?.map((_, i) => {
          const override = productOverrides[i];
          return (
            <div
              key={i}
              className={`space-y-6 group fp-card ${override.offset ? "md:translate-y-12" : ""}`}
            >
              <div className={`relative aspect-3/4 overflow-hidden ${override.clipClass} bg-[#f1edec]`}>
                <img
                  src={override.image}
                  alt={override.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                {override.badge && (
                  <div className="absolute top-4 right-4 bg-[#1c1b1b] text-white px-3 py-1 text-[11px] tracking-wider">
                    {override.badge}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] tracking-wider text-[#444748] italic">
                    {override.tag}
                  </p>
                  <h4
                    className="text-[28px] md:text-[32px] font-medium mt-2 leading-tight"
                    style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {override.name}
                  </h4>
                </div>
                <span className="text-[18px] leading-relaxed text-[#1c1b1b] whitespace-nowrap ml-4 mt-1">
                  ({override.price})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
