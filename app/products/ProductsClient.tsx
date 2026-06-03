"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Heart, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import type { Product } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ["All", "electronics", "jewelery", "men's clothing", "women's clothing"];

const CLIP_CLASSES = ["clip-poly-1", "clip-poly-2", "clip-poly-asym", "clip-poly-1", "clip-poly-asym", "clip-poly-2"];

const FURNITURE_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYoGYhzqnK_mOSFfEwA2MEhhTaE0t957CLNkTPiwtIqQJKsxrizxfdH8bDZ1ti3P6J80Uzaz-bIu3L_0AUSbNQd9Ak7WHqKt0vNhH0n0bWfe7FiVj4BbFGgmVxjX9LkMMcpXg7acUFzxx9qsCkraukUwbFcSoh318xG1A-DNHVroerFWCWuSh1XuXTBrHos-IHPPiKT2O4qZitDZP4Hhb9FFHbMyJqZaYjxhs9dlVmCI1zIIKxBxqYvD6E0Vs3xkaxs0L21Z4VhG-u",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCX0NJ5IZw6V8jp-Kl3K3yAAA_Dd02psPio3JHEybxSo370mpbLYrXmCuYl428miwPyyVm81opBCKf_u6eHmE-RcVeBOtBJZyRaZMYeGwjcvgAd7yqTy6hQgFpzlGKB41EiyFanuxytcXjwCrHnlm2AOBxBQWF81cws0jxK4UF2aub4mDMok47cQHX381wcQ9SruO23lhlBlWqwBXnGu_9VWh5dFngfocX0agwznEva-b0SoPJKmLNgRmie6Ayodwjv6QNP61ZCJzbY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC7OPJbVOBPbof7-SSXheApfVFQAMsoQeuNw3y7NygwxaOSJ2zKvVPeera1GuGN_eCwPZUyWRiW-dCm8GuIKkwO15fhtE-T-ewg2IRwjR3YCaWZIeeO6CpYlGAvslJwbO9trdOjQR5z5CxIEwM2CHtBayKOgepNuG_Ye1DKpIWkYQ1qryn4I09V0-BT5iEQ9SIj7sT0NDKZzCmwGtcGOC3QLwglXuRqU5ECvdtYrEP34CLKIJ323RuvJvMsjO3uvviYOivqvHD-8Cah",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCSX7C-bf_Cwiq-xXANuAF6IHmJfev7hZBVIkNW7loosbGm96GIt8D5vuTWo7Y7F2nuezuZ3-jjhR1KkhnKh4dDvuEUm_Ymf6c3WRCM3q2rhuBstTKjpbz3_BDJu_cwkZapKBaadu6rLdJnnnOztnJnozGMPQ5MwathRdJ1l2M-yIezH2tQTDFY5FsuTay_qXxURlahz0LHq2NaLnz08_MQebpEC-jlVB2MbP9RHR5Cw0PJsqHqNSSU8xEyTPQAI55iStXQMtEfMtsh",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAawwcXXzz-CkfIUSvD26Gmrr8zQsJIIDBys-Wa9VfhwAt2ZFxg6q3mR2xvdubw6M228rZzHz_DjbKQ7Rna9O-0xFQLwKBL8NNA1in52jek7BDAs7uLUJQlyPeWiCTmF9Fn-ah2tRfukWf1sq4QDtH8_jOzlzGM63TlU-2hpIoxG6nltzRnOXIVLqDwZu7Th-4L6_C4LNozdDAKAUw-pFLQcK_4aye755HFZKXmUeMtd0uypj9ij1aIW69N8AlQV2vZwkGBHuFr8rrg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBGrz2NoytoaKLrm_5JnKxsB01pvD5vZDT5MnPScelB7fBbzh-GUaclfuyD8VAwgIgQNd5VAP_AXDAq15i69kwoAC5VQBTa1zH3Un0KkzTnRf6lEN22UUgehyY8sVpm2Ed9ExgBNpp6bNRwAdI1LWs0HsB8o124YQLp1XlaD44kglCq-Rkw0z2SCLXa4lF9Y1JvSOqqFWUeamCv2kty1pNe0Oz8Yc_smnroGAk0CfVT3nJJClQWlSSm0kF21hl5d7tVFMYenYO6NBhE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBkhNC2NtBjZ_fIm4PVDV_L86LHHkuxjOfclez3-xhaqlmLeefdCptG7WowSuT51_fmx38tbzEZok343ZAWCg08W5u9uvQVsnq86CW2k7dMeKjqpM8hxaRbHJd6L1pw0sftSWr1sM4vbjvVr65AzlZ6aEDo32kzCC1ny81g-cVKLfBsRAeNxK71Z2wSArzJDOw8K3XnqLiFZah-pE4lNdVuN34P_cjXmIwT7jVNfmF9kr4ZvROHjGu_YaVRlJTeYyAEL934sKJw5SG4",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAZuRuO51jgalOAuC-LFEUJ6QeGlM0D720a3K-MVRQQGnCtEStcCNpVxFXqR2eo63wsI8WYa-M8jLKxJ7N3_sw-gtkEmu2Fj6UMMC572wbXvskGHHBAZLG8PGfyNbdmR1kWQAfGeRtpENir-Qsy33vONwp7pFPDXgOfoPkdALlO6VCJqlBL6aN_96hs9D7KIKoSu6Okew1HQICFNVwhPBfVXAuCBqqcutlf7o76wQ-AHIiyom7GjkimSChSxbWrVQ3SkkQOlIcaP1iG",
];

function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-3/4 w-full rounded-none bg-[#e5e2e1]" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-3 w-1/3 bg-[#e5e2e1]" />
        <Skeleton className="h-5 w-3/4 bg-[#e5e2e1]" />
        <Skeleton className="h-3 w-1/4 bg-[#e5e2e1]" />
      </div>
    </div>
  );
}

function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center gap-6 py-32 text-center">
      <p className="text-[15px] text-[#444748]">Could not load products: {message}</p>
      <button
        onClick={retry}
        className="border border-[#1c1b1b] px-8 py-3 text-[11px] tracking-widest uppercase hover:bg-[#1c1b1b] hover:text-white transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

export function ProductsClient() {
  const container = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const { data: products, isLoading, isError, error, refetch } = useQuery<Product[]>({
    queryKey: queryKeys.products.all,
    queryFn: () => api.get("/products").then((r) => r.data),
  });

  const filtered = products
    ?.filter((p) => activeCategory === "All" || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  useGSAP(
    () => {
      gsap.from(".page-hero > *", {
        opacity: 0, y: 30, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.2,
      });
      if (filtered) {
        ScrollTrigger.refresh();
        gsap.set(".prod-card", { opacity: 0, y: 30 });
        gsap.to(".prod-card", {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06,
          scrollTrigger: { trigger: ".prod-grid", start: "top 85%" },
        });
      }
    },
    { scope: container, dependencies: [filtered?.length, activeCategory, sortBy] }
  );

  return (
    <div ref={container} className="min-h-screen bg-[#fdf8f8]">
      <Navbar />

      {/* Page Hero */}
      <div className="page-hero relative overflow-hidden bg-[#1c1b1b] px-5 pt-32 pb-20 md:px-16">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden">
          <span
            className="select-none text-[180px] font-medium leading-none text-white/[0.03] md:text-[280px]"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            SHOP
          </span>
        </div>
        <p className="mb-3 text-[11px] tracking-widest uppercase text-[#e4c285]">
          Our Collection
        </p>
        <h1
          className="text-[48px] font-medium leading-tight tracking-tight text-white md:text-[72px]"
          style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
        >
          All Products
        </h1>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/50">
          {products ? `${filtered?.length ?? 0} pieces curated for refined living.` : "Curated for refined living."}
        </p>
      </div>

      {/* Filter + Sort bar */}
      <div className="sticky top-[65px] z-40 flex flex-wrap items-center justify-between gap-4 border-b border-[#c4c7c7]/40 bg-[#fdf8f8]/95 px-5 py-4 backdrop-blur-sm md:px-16">
        {/* Category tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <SlidersHorizontal aria-hidden="true" className="mr-3 h-4 w-4 flex-shrink-0 text-[#444748]" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 text-[11px] tracking-widest uppercase transition-all ${
                activeCategory === cat
                  ? "bg-[#1c1b1b] text-white"
                  : "text-[#444748] hover:text-[#1c1b1b]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Sort */}
        <div className="flex items-center gap-2 text-[11px] tracking-wider text-[#444748]">
          <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="cursor-pointer bg-transparent uppercase tracking-widest focus:outline-none"
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low–High</option>
            <option value="price-desc">Price: High–Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="prod-grid px-5 py-16 md:px-16">
        <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-4 md:gap-x-6">
          {isLoading && Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}

          {isError && (
            <ErrorState
              message={axios.isAxiosError(error) ? (error.response?.data?.message ?? error.message) : (error as Error).message}
              retry={() => refetch()}
            />
          )}

          {filtered?.map((product, i) => {
            const inWishlist = wishlist.includes(product.id);
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="prod-card group flex flex-col"
              >
                <div className={`relative overflow-hidden ${CLIP_CLASSES[i % CLIP_CLASSES.length]} aspect-3/4 bg-[#f1edec]`}>
                  <img
                    src={FURNITURE_IMAGES[i % FURNITURE_IMAGES.length]}
                    alt={product.title}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  {i < 3 && (
                    <div className="absolute left-4 top-4 bg-[#1c1b1b] px-2.5 py-1 text-[10px] tracking-widest uppercase text-white">
                      New
                    </div>
                  )}
                  {/* Wishlist */}
                  <button
                    aria-label="Toggle wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      setWishlist((w) =>
                        w.includes(product.id) ? w.filter((id) => id !== product.id) : [...w, product.id]
                      );
                    }}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center bg-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <Heart
                      aria-hidden="true"
                      className={`h-4 w-4 transition-colors ${inWishlist ? "fill-[#e4c285] text-[#e4c285]" : "text-[#1c1b1b]"}`}
                    />
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-1 px-1">
                  <p className="text-[10px] tracking-widest uppercase text-[#e4c285]">
                    {product.category}
                  </p>
                  <h3
                    className="line-clamp-1 text-[15px] font-medium text-[#1c1b1b] transition-colors group-hover:text-[#745a27]"
                    style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {product.title}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[15px] font-medium text-[#1c1b1b]">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[#444748]">
                      ★ {product.rating.rate}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
