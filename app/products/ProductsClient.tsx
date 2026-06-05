"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Heart, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { shopifyFetch, GET_PRODUCTS, type ShopifyProductsResponse } from "@/lib/shopify";
import { queryKeys } from "@/lib/queryKeys";
import { getProductPrice, getProductImage, type ShopifyProduct } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const CLIP_CLASSES = ["clip-poly-1", "clip-poly-2", "clip-poly-asym", "clip-poly-1", "clip-poly-asym", "clip-poly-2"];

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

export function ProductsClient() {
  const container = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery<ShopifyProductsResponse>({
    queryKey: queryKeys.products.all,
    queryFn: () => shopifyFetch<ShopifyProductsResponse>(GET_PRODUCTS, { first: 50 }),
  });

  useEffect(() => {
    if (isError && error) {
      const msg = axios.isAxiosError(error)
        ? (error.response?.data?.errors?.[0]?.message ?? error.message)
        : (error as Error).message;
      toast.error("Could not load products", { description: msg });
    }
  }, [isError, error]);

  const allProducts = data?.products.edges.map((e) => e.node) ?? [];

  // Collect unique tags as categories
  const allTags = Array.from(new Set(allProducts.flatMap((p) => p.tags)));
  const categories = ["All", ...allTags];

  const filtered = allProducts
    .filter((p) => activeCategory === "All" || p.tags.includes(activeCategory))
    .sort((a, b) => {
      const pa = parseFloat(a.priceRange.minVariantPrice.amount);
      const pb = parseFloat(b.priceRange.minVariantPrice.amount);
      if (sortBy === "price-asc") return pa - pb;
      if (sortBy === "price-desc") return pb - pa;
      return 0;
    });

  // Hero animation — runs once
  useGSAP(() => {
    gsap.from(".page-hero > *", {
      opacity: 0, y: 30, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.2,
      clearProps: "opacity,transform",
    });
  }, { scope: container });

  // Grid animation — reruns on filter/sort change
  useGSAP(() => {
    if (isLoading) return;
    ScrollTrigger.refresh();
    gsap.set(".prod-card", { opacity: 0, y: 30 });
    gsap.to(".prod-card", {
      opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06,
      clearProps: "opacity,transform",
      scrollTrigger: { trigger: ".prod-grid", start: "top 85%", once: true },
    });
  }, { scope: container, dependencies: [filtered.length, activeCategory, sortBy, isLoading] });

  return (
    <div ref={container} className="min-h-screen bg-[#fdf8f8]">
      <Navbar />

      {/* Hero */}
      <div className="page-hero relative overflow-hidden bg-[#1c1b1b] px-5 pt-32 pb-20 md:px-16">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden">
          <span
            className="select-none text-[180px] font-medium leading-none text-white/3 md:text-[280px]"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            SHOP
          </span>
        </div>
        <p className="mb-3 text-[11px] tracking-widest uppercase text-[#e4c285]">Our Collection</p>
        <h1
          className="text-[48px] font-medium leading-tight tracking-tight text-white md:text-[72px]"
          style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
        >
          All Products
        </h1>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/50">
          {isLoading ? "Curated for refined living." : `${filtered.length} pieces curated for refined living.`}
        </p>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 z-40 flex flex-wrap items-center justify-between gap-4 border-b border-[#c4c7c7]/40 bg-[#fdf8f8]/95 px-5 py-4 backdrop-blur-sm md:px-16">
        <div className="cat-scroll flex items-center gap-1 overflow-x-auto pb-2">
          <SlidersHorizontal aria-hidden="true" className="mr-3 h-4 w-4 shrink-0 text-[#444748]" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 cursor-pointer px-4 py-1.5 text-[11px] tracking-widest uppercase transition-all duration-200 ${
                activeCategory === cat ? "bg-[#1c1b1b] text-white" : "text-[#444748] hover:text-[#1c1b1b]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
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
        {isError && !isLoading && (
          <div className="flex justify-center py-20">
            <button
              onClick={() => refetch()}
              className="cursor-pointer border border-[#1c1b1b] px-8 py-3 text-[11px] tracking-widest uppercase hover:bg-[#1c1b1b] hover:text-white transition-all duration-300"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-4 md:gap-x-6">
          {isLoading && Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}

          {filtered.map((product, i) => {
            const inWishlist = wishlist.includes(product.id);
            const image = getProductImage(product) || "";
            const price = getProductPrice(product);

            return (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="prod-card group flex flex-col"
              >
                <div className={`relative overflow-hidden ${CLIP_CLASSES[i % CLIP_CLASSES.length]} aspect-3/4 bg-[#f1edec]`}>
                  <img
                    src={image}
                    alt={product.title}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  {i < 3 && (
                    <div className="absolute left-4 top-4 bg-[#1c1b1b] px-2.5 py-1 text-[10px] tracking-widest uppercase text-white">
                      New
                    </div>
                  )}
                  <button
                    aria-label="Toggle wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      setWishlist((w) =>
                        w.includes(product.id) ? w.filter((id) => id !== product.id) : [...w, product.id]
                      );
                    }}
                    className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center bg-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <Heart
                      aria-hidden="true"
                      className={`h-4 w-4 transition-colors ${inWishlist ? "fill-[#e4c285] text-[#e4c285]" : "text-[#1c1b1b]"}`}
                    />
                  </button>
                </div>
                <div className="mt-4 flex flex-col gap-1 px-1">
                  <p className="text-[10px] tracking-widest uppercase text-[#e4c285]">
                    {product.tags[0] ?? product.priceRange.minVariantPrice.currencyCode}
                  </p>
                  <h3
                    className="line-clamp-1 text-[15px] font-medium text-[#1c1b1b] transition-colors group-hover:text-[#745a27]"
                    style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {product.title}
                  </h3>
                  <span className="text-[15px] font-medium text-[#1c1b1b]">{price}</span>
                </div>
              </Link>
            );
          })}

          {/* Empty state when Shopify has no products */}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="col-span-full py-32 text-center">
              <p className="text-[15px] text-[#444748]">No products found.</p>
              {activeCategory !== "All" && (
                <button
                  onClick={() => setActiveCategory("All")}
                  className="mt-4 cursor-pointer text-[12px] tracking-widest uppercase text-[#1c1b1b] underline underline-offset-4"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
