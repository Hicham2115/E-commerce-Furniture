"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import {
  ArrowLeft, Heart, ShoppingBag, Star, Minus, Plus, Loader2, ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { api } from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import type { Product } from "@/lib/types";

const FURNITURE_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYoGYhzqnK_mOSFfEwA2MEhhTaE0t957CLNkTPiwtIqQJKsxrizxfdH8bDZ1ti3P6J80Uzaz-bIu3L_0AUSbNQd9Ak7WHqKt0vNhH0n0bWfe7FiVj4BbFGgmVxjX9LkMMcpXg7acUFzxx9qsCkraukUwbFcSoh318xG1A-DNHVroerFWCWuSh1XuXTBrHos-IHPPiKT2O4qZitDZP4Hhb9FFHbMyJqZaYjxhs9dlVmCI1zIIKxBxqYvD6E0Vs3xkaxs0L21Z4VhG-u",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCX0NJ5IZw6V8jp-Kl3K3yAAA_Dd02psPio3JHEybxSo370mpbLYrXmCuYl428miwPyyVm81opBCKf_u6eHmE-RcVeBOtBJZyRaZMYeGwjcvgAd7yqTy6hQgFpzlGKB41EiyFanuxytcXjwCrHnlm2AOBxBQWF81cws0jxK4UF2aub4mDMok47cQHX381wcQ9SruO23lhlBlWqwBXnGu_9VWh5dFngfocX0agwznEva-b0SoPJKmLNgRmie6Ayodwjv6QNP61ZCJzbY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC7OPJbVOBPbof7-SSXheApfVFQAMsoQeuNw3y7NygwxaOSJ2zKvVPeera1GuGN_eCwPZUyWRiW-dCm8GuIKkwO15fhtE-T-ewg2IRwjR3YCaWZIeeO6CpYlGAvslJwbO9trdOjQR5z5CxIEwM2CHtBayKOgepNuG_Ye1DKpIWkYQ1qryn4I09V0-BT5iEQ9SIj7sT0NDKZzCmwGtcGOC3QLwglXuRqU5ECvdtYrEP34CLKIJ323RuvJvMsjO3uvviYOivqvHD-8Cah",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCSX7C-bf_Cwiq-xXANuAF6IHmJfev7hZBVIkNW7loosbGm96GIt8D5vuTWo7Y7F2nuezuZ3-jjhR1KkhnKh4dDvuEUm_Ymf6c3WRCM3q2rhuBstTKjpbz3_BDJu_cwkZapKBaadu6rLdJnnnOztnJnozGMPQ5MwathRdJ1l2M-yIezH2tQTDFY5FsuTay_qXxURlahz0LHq2NaLnz08_MQebpEC-jlVB2MbP9RHR5Cw0PJsqHqNSSU8xEyTPQAI55iStXQMtEfMtsh",
];

const GALLERY_CLIPS = ["clip-poly-1", "clip-poly-asym", "clip-poly-2", "clip-poly-1"];

const MATERIALS = ["Solid Oak", "Bouclé Fabric", "Brass Accents", "Foam Core"];

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-12 px-5 py-16 md:grid-cols-12 md:px-16">
      <div className="md:col-span-7 space-y-4">
        <Skeleton className="aspect-3/4 w-full rounded-none bg-[#e5e2e1]" />
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-none bg-[#e5e2e1]" />
          ))}
        </div>
      </div>
      <div className="md:col-span-5 space-y-6 pt-4">
        <Skeleton className="h-4 w-1/3 bg-[#e5e2e1]" />
        <Skeleton className="h-10 w-3/4 bg-[#e5e2e1]" />
        <Skeleton className="h-8 w-1/4 bg-[#e5e2e1]" />
        <Skeleton className="h-24 w-full bg-[#e5e2e1]" />
        <Skeleton className="h-14 w-full bg-[#e5e2e1]" />
      </div>
    </div>
  );
}

export function ProductDetailClient({ id }: { id: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const queryClient = useQueryClient();

  const { data: product, isLoading, isError, error } = useQuery<Product>({
    queryKey: queryKeys.products.detail(Number(id)),
    queryFn: () => api.get(`/products/${id}`).then((r) => r.data),
  });

  const { data: related } = useQuery<Product[]>({
    queryKey: [...queryKeys.products.list(4), "related"],
    queryFn: () => api.get("/products?limit=4").then((r) => r.data),
    enabled: !!product,
  });

  const cartMutation = useMutation({
    mutationFn: (payload: { productId: number; quantity: number }) =>
      api.post("/post", payload).then((r) => r.data),
    onSuccess: () => {
      setAddedToCart(true);
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      setTimeout(() => setAddedToCart(false), 3000);
    },
    onError: (err) => {
      console.error(axios.isAxiosError(err) ? err.response?.data : err);
    },
  });

  useGSAP(
    () => {
      if (!product) return;
      const tl = gsap.timeline();
      tl.from(".pd-image", { opacity: 0, x: -40, duration: 1, ease: "power3.out" })
        .from(".pd-info > *", { opacity: 0, y: 24, duration: 0.7, ease: "power3.out", stagger: 0.08 }, "-=0.6");
    },
    { scope: container, dependencies: [!!product] }
  );

  const imgIndex = Number(id) % FURNITURE_IMAGES.length;

  return (
    <div ref={container} className="min-h-screen bg-[#fdf8f8]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 border-b border-[#c4c7c7]/30 px-5 pt-24 pb-4 md:px-16">
        <Link href="/" className="text-[11px] tracking-wider text-[#444748] hover:text-[#1c1b1b] uppercase transition-colors">
          Home
        </Link>
        <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#c4c7c7]" />
        <Link href="/products" className="text-[11px] tracking-wider text-[#444748] hover:text-[#1c1b1b] uppercase transition-colors">
          Products
        </Link>
        {product && (
          <>
            <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#c4c7c7]" />
            <span className="line-clamp-1 text-[11px] tracking-wider uppercase text-[#1c1b1b]">
              {product.title}
            </span>
          </>
        )}
      </div>

      {/* Back */}
      <div className="px-5 py-6 md:px-16">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#444748] hover:text-[#1c1b1b] transition-colors"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Back to Products
        </Link>
      </div>

      {isLoading && <DetailSkeleton />}

      {isError && (
        <div className="flex flex-col items-center gap-4 py-32 text-center">
          <p className="text-[15px] text-[#444748]">
            {axios.isAxiosError(error)
              ? (error.response?.data?.message ?? error.message)
              : (error as Error).message}
          </p>
          <Link
            href="/products"
            className="border border-[#1c1b1b] px-8 py-3 text-[11px] tracking-widest uppercase hover:bg-[#1c1b1b] hover:text-white transition-colors"
          >
            Back to Products
          </Link>
        </div>
      )}

      {product && (
        <div className="grid grid-cols-1 gap-10 px-5 pb-24 md:grid-cols-12 md:gap-16 md:px-16">
          {/* Left: images */}
          <div className="pd-image md:col-span-7 space-y-4">
            {/* Main image */}
            <div className={`aspect-3/4 overflow-hidden ${GALLERY_CLIPS[activeImg]} bg-[#f1edec]`}>
              <img
                src={FURNITURE_IMAGES[(imgIndex + activeImg) % FURNITURE_IMAGES.length]}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {GALLERY_CLIPS.map((clip, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden transition-all duration-200 ${clip} ${
                    activeImg === i ? "ring-2 ring-[#1c1b1b] ring-offset-2" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={FURNITURE_IMAGES[(imgIndex + i) % FURNITURE_IMAGES.length]}
                    alt={`View ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: info */}
          <div className="pd-info md:col-span-5 flex flex-col gap-7 pt-2">
            {/* Category + badge */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] tracking-widest uppercase text-[#e4c285]">
                {product.category}
              </span>
              <span className="bg-[#1c1b1b] px-2.5 py-1 text-[10px] tracking-widest uppercase text-white">
                In Stock
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-[32px] font-medium leading-tight tracking-tight text-[#1c1b1b] md:text-[40px]"
              style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
            >
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex text-[#e4c285]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className={`h-4 w-4 ${i < Math.round(product.rating.rate) ? "fill-[#e4c285]" : "fill-[#e5e2e1] text-[#e5e2e1]"}`}
                  />
                ))}
              </div>
              <span className="text-[13px] text-[#444748]">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 border-y border-[#c4c7c7]/30 py-6">
              <span
                className="text-[40px] font-medium leading-none tracking-tight text-[#1c1b1b]"
                style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
              >
                DH {(product.price * 10).toFixed(0)}
              </span>
              <span className="mb-1 text-[13px] text-[#744748] line-through opacity-40">
                DH {(product.price * 12.5).toFixed(0)}
              </span>
              <span className="mb-1 rounded-full bg-[#fedb9b] px-2.5 py-0.5 text-[10px] font-medium tracking-wider text-[#745a27]">
                20% OFF
              </span>
            </div>

            {/* Description */}
            <p className="text-[15px] leading-[1.7] text-[#444748]">
              {product.description}
            </p>

            {/* Materials */}
            <div>
              <p className="mb-3 text-[11px] tracking-widest uppercase text-[#444748]">
                Materials
              </p>
              <div className="flex flex-wrap gap-2">
                {MATERIALS.map((m) => (
                  <span
                    key={m}
                    className="border border-[#c4c7c7]/60 px-3 py-1.5 text-[11px] tracking-wider text-[#444748]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Qty selector */}
            <div className="flex items-center gap-6">
              <p className="text-[11px] tracking-widest uppercase text-[#444748]">Qty</p>
              <div className="flex items-center border border-[#c4c7c7]/60">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 items-center justify-center hover:bg-[#f1edec] transition-colors"
                >
                  <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
                <span
                  className="w-10 text-center text-[15px] font-medium"
                  style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 items-center justify-center hover:bg-[#f1edec] transition-colors"
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => cartMutation.mutate({ productId: product.id, quantity: qty })}
                disabled={cartMutation.isPending}
                className="group flex flex-1 items-center justify-center gap-3 bg-[#1c1b1b] py-4 text-[11px] font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#e4c285] hover:text-[#1c1b1b] disabled:opacity-60"
              >
                {cartMutation.isPending ? (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                ) : addedToCart ? (
                  "✦ Added to Bag"
                ) : (
                  <>
                    <ShoppingBag aria-hidden="true" className="h-4 w-4" />
                    Add to Bag
                  </>
                )}
              </button>
              <button
                onClick={() => setInWishlist((w) => !w)}
                aria-label="Toggle wishlist"
                className={`flex h-14 w-14 flex-shrink-0 items-center justify-center border transition-colors ${
                  inWishlist
                    ? "border-[#e4c285] bg-[#fedb9b]/20"
                    : "border-[#c4c7c7]/60 hover:border-[#1c1b1b]"
                }`}
              >
                <Heart
                  aria-hidden="true"
                  className={`h-4 w-4 transition-colors ${inWishlist ? "fill-[#e4c285] text-[#e4c285]" : "text-[#1c1b1b]"}`}
                />
              </button>
            </div>

            {/* Delivery info */}
            <div className="space-y-3 border-t border-[#c4c7c7]/30 pt-6 text-[13px] text-[#444748]">
              {[
                "Free delivery on orders over $500",
                "15-year craftsmanship guarantee",
                "White-glove installation available",
              ].map((item) => (
                <p key={item} className="flex items-center gap-2">
                  <span className="text-[#e4c285]">✦</span> {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related products */}
      {related && related.length > 0 && (
        <div className="border-t border-[#c4c7c7]/30 px-5 py-20 md:px-16">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-[11px] tracking-widest uppercase text-[#e4c285]">Explore More</p>
              <h2
                className="text-[32px] font-medium tracking-tight text-[#1c1b1b]"
                style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
              >
                You May Also Like
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden text-[11px] tracking-widest uppercase text-[#444748] underline underline-offset-4 hover:text-[#1c1b1b] transition-colors md:block"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p, i) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group flex flex-col">
                <div className={`aspect-3/4 overflow-hidden ${GALLERY_CLIPS[i % GALLERY_CLIPS.length]} bg-[#f1edec]`}>
                  <img
                    src={FURNITURE_IMAGES[(i + 1) % FURNITURE_IMAGES.length]}
                    alt={p.title}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 space-y-1 px-1">
                  <p className="text-[10px] tracking-widest uppercase text-[#e4c285]">{p.category}</p>
                  <p
                    className="line-clamp-1 text-[14px] font-medium text-[#1c1b1b] group-hover:text-[#745a27] transition-colors"
                    style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {p.title}
                  </p>
                  <p className="text-[14px] font-medium text-[#1c1b1b]">DH {(p.price * 10).toFixed(0)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
