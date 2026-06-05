"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft, Heart, Minus, Plus, ChevronRight, ShoppingBag,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { shopifyFetch, GET_PRODUCT_BY_HANDLE, GET_PRODUCTS, type ShopifyProductResponse, type ShopifyProductsResponse } from "@/lib/shopify";
import { queryKeys } from "@/lib/queryKeys";
import { getProductPrice, getFirstVariantId, type ShopifyVariant } from "@/lib/types";
import { useAddToCart } from "@/components/CartDrawer";

const GALLERY_CLIPS = ["clip-poly-1", "clip-poly-asym", "clip-poly-2", "clip-poly-1"];
const MATERIALS = ["Solid Oak", "Bouclé Fabric", "Brass Accents", "Foam Core"];

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-12 px-5 py-16 md:grid-cols-12 md:px-16">
      <div className="md:col-span-7 space-y-4">
        <Skeleton className="aspect-3/4 w-full rounded-none bg-[#e5e2e1]" />
        <div className="grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
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

export function ProductDetailClient({ id: handle }: { id: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(null);

  const addToCart = useAddToCart();

  const { data, isLoading, isError, error } = useQuery<ShopifyProductResponse>({
    queryKey: queryKeys.products.detail(handle),
    queryFn: () => shopifyFetch<ShopifyProductResponse>(GET_PRODUCT_BY_HANDLE, { handle }),
  });

  const { data: relatedData } = useQuery<ShopifyProductsResponse>({
    queryKey: [...queryKeys.products.list(4), "related"],
    queryFn: () => shopifyFetch<ShopifyProductsResponse>(GET_PRODUCTS, { first: 4 }),
    enabled: !!data?.product,
  });

  const product = data?.product;
  const related = relatedData?.products.edges.map((e) => e.node).filter((p) => p.handle !== handle) ?? [];

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants.edges[0]?.node ?? null);
    }
  }, [product]);

  useEffect(() => {
    if (isError && error) {
      const msg = axios.isAxiosError(error)
        ? (error.response?.data?.errors?.[0]?.message ?? error.message)
        : (error as Error).message;
      toast.error("Could not load product", { description: msg });
    }
  }, [isError, error]);

  useGSAP(
    () => {
      if (!product) return;
      const tl = gsap.timeline();
      tl.from(".pd-image", { opacity: 0, x: -40, duration: 1, ease: "power3.out", clearProps: "opacity,transform" })
        .from(".pd-info > *", { opacity: 0, y: 24, duration: 0.7, ease: "power3.out", stagger: 0.08, clearProps: "opacity,transform" }, "-=0.6");
    },
    { scope: container, dependencies: [!!product] }
  );

  const images = product?.images.edges.map((e) => e.node.url) ?? [];
  const activeImgUrl = images[activeImg] ?? "";
  const price = product ? getProductPrice(product) : "";
  const comparePrice = product
    ? `${(parseFloat(product.compareAtPriceRange.minVariantPrice.amount) * 10).toFixed(0)} DH`
    : "";
  const variantId = selectedVariant?.id ?? (product ? getFirstVariantId(product) : "");

  return (
    <div ref={container} className="min-h-screen bg-[#fdf8f8]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 border-b border-[#c4c7c7]/30 px-5 pt-24 pb-4 md:px-16">
        <Link href="/" className="text-[11px] tracking-wider text-[#444748] hover:text-[#1c1b1b] uppercase transition-colors">Home</Link>
        <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#c4c7c7]" />
        <Link href="/products" className="text-[11px] tracking-wider text-[#444748] hover:text-[#1c1b1b] uppercase transition-colors">Products</Link>
        {product && (
          <>
            <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#c4c7c7]" />
            <span className="line-clamp-1 text-[11px] tracking-wider uppercase text-[#1c1b1b]">{product.title}</span>
          </>
        )}
      </div>

      <div className="px-5 py-6 md:px-16">
        <Link href="/products" className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#444748] hover:text-[#1c1b1b] transition-colors">
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Back to Products
        </Link>
      </div>

      {isLoading && <DetailSkeleton />}

      {isError && !isLoading && (
        <div className="flex flex-col items-center gap-4 py-32 text-center">
          <p className="text-[15px] text-[#444748]">Product not found.</p>
          <Link href="/products" className="border border-[#1c1b1b] px-8 py-3 text-[11px] tracking-widest uppercase hover:bg-[#1c1b1b] hover:text-white transition-colors">
            Back to Products
          </Link>
        </div>
      )}

      {product && (
        <div className="grid grid-cols-1 gap-10 px-5 pb-24 md:grid-cols-12 md:gap-16 md:px-16">
          {/* Images */}
          <div className="pd-image md:col-span-7 space-y-4">
            <div className={`aspect-3/4 overflow-hidden ${GALLERY_CLIPS[activeImg % GALLERY_CLIPS.length]} bg-[#f1edec]`}>
              <img
                src={activeImgUrl}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square cursor-pointer overflow-hidden transition-all duration-200 ${GALLERY_CLIPS[i % GALLERY_CLIPS.length]} ${
                      activeImg === i ? "ring-2 ring-[#1c1b1b] ring-offset-2" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`View ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info md:col-span-5 flex flex-col gap-7 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-[11px] tracking-widest uppercase text-[#e4c285]">
                {product.tags[0] ?? "MAISON"}
              </span>
              {product.variants.edges[0]?.node.availableForSale && (
                <span className="bg-[#1c1b1b] px-2.5 py-1 text-[10px] tracking-widest uppercase text-white">
                  In Stock
                </span>
              )}
            </div>

            <h1
              className="text-[32px] font-medium leading-tight tracking-tight text-[#1c1b1b] md:text-[40px]"
              style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
            >
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-4 border-y border-[#c4c7c7]/30 py-6">
              <span
                className="text-[40px] font-medium leading-none tracking-tight text-[#1c1b1b]"
                style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
              >
                {selectedVariant
                  ? `${(parseFloat(selectedVariant.price.amount) * 10).toFixed(0)} DH`
                  : price}
              </span>
              {parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > 0 && (
                <span className="mb-1 text-[13px] text-[#444748] line-through opacity-40">{comparePrice}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-[15px] leading-[1.7] text-[#444748]">{product.description}</p>

            {/* Variant selector */}
            {product.options && product.options.some((o) => o.values.length > 1) && (
              <div className="space-y-3">
                {product.options.map((option) => (
                  <div key={option.name}>
                    <p className="mb-2 text-[11px] tracking-widest uppercase text-[#444748]">{option.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((val) => (
                        <button
                          key={val}
                          onClick={() => {
                            const match = product.variants.edges.find((e) =>
                              e.node.selectedOptions.some((o) => o.name === option.name && o.value === val)
                            );
                            if (match) setSelectedVariant(match.node);
                          }}
                          className={`cursor-pointer border px-3 py-1.5 text-[11px] tracking-wider transition-all duration-200 ${
                            selectedVariant?.selectedOptions.some((o) => o.name === option.name && o.value === val)
                              ? "border-[#1c1b1b] bg-[#1c1b1b] text-white"
                              : "border-[#c4c7c7]/60 text-[#444748] hover:border-[#1c1b1b]"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Materials */}
            <div>
              <p className="mb-3 text-[11px] tracking-widest uppercase text-[#444748]">Materials</p>
              <div className="flex flex-wrap gap-2">
                {MATERIALS.map((m) => (
                  <span key={m} className="border border-[#c4c7c7]/60 px-3 py-1.5 text-[11px] tracking-wider text-[#444748]">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-6">
              <p className="text-[11px] tracking-widest uppercase text-[#444748]">Qty</p>
              <div className="flex items-center border border-[#c4c7c7]/60">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="flex h-10 w-10 cursor-pointer items-center justify-center hover:bg-[#f1edec] transition-colors">
                  <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-[15px] font-medium" style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}>
                  {qty}
                </span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="flex h-10 w-10 cursor-pointer items-center justify-center hover:bg-[#f1edec] transition-colors">
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={() => variantId && addToCart.mutate({ variantId, quantity: qty })}
                disabled={addToCart.isPending || !variantId}
                className="group flex flex-1 cursor-pointer items-center justify-center gap-3 bg-[#1c1b1b] py-4 text-[11px] font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#e4c285] hover:text-[#1c1b1b] disabled:opacity-60"
              >
                <ShoppingBag aria-hidden="true" className="h-4 w-4" />
                {addToCart.isPending ? "Adding…" : "Add to Bag"}
              </button>
              <button
                onClick={() => setInWishlist((w) => !w)}
                aria-label="Toggle wishlist"
                className={`flex h-14 w-14 cursor-pointer shrink-0 items-center justify-center border transition-colors ${
                  inWishlist ? "border-[#e4c285] bg-[#fedb9b]/20" : "border-[#c4c7c7]/60 hover:border-[#1c1b1b]"
                }`}
              >
                <Heart aria-hidden="true" className={`h-4 w-4 transition-colors ${inWishlist ? "fill-[#e4c285] text-[#e4c285]" : "text-[#1c1b1b]"}`} />
              </button>
            </div>

            {/* Perks */}
            <div className="space-y-3 border-t border-[#c4c7c7]/30 pt-6 text-[13px] text-[#444748]">
              {["Free delivery on orders over 5,000 DH", "15-year craftsmanship guarantee", "White-glove installation available"].map((item) => (
                <p key={item} className="flex items-center gap-2">
                  <span className="text-[#e4c285]">✦</span> {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-[#c4c7c7]/30 px-5 py-20 md:px-16">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-[11px] tracking-widest uppercase text-[#e4c285]">Explore More</p>
              <h2 className="text-[32px] font-medium tracking-tight text-[#1c1b1b]" style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}>
                You May Also Like
              </h2>
            </div>
            <Link href="/products" className="hidden text-[11px] tracking-widest uppercase text-[#444748] underline underline-offset-4 hover:text-[#1c1b1b] transition-colors md:block">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p, i) => (
              <Link key={p.id} href={`/products/${p.handle}`} className="group flex flex-col">
                <div className={`aspect-3/4 overflow-hidden ${GALLERY_CLIPS[i % GALLERY_CLIPS.length]} bg-[#f1edec]`}>
                  <img
                    src={p.images.edges[0]?.node.url ?? ""}
                    alt={p.title}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 space-y-1 px-1">
                  <p className="text-[10px] tracking-widest uppercase text-[#e4c285]">{p.tags[0] ?? "MAISON"}</p>
                  <p className="line-clamp-1 text-[14px] font-medium text-[#1c1b1b] group-hover:text-[#745a27] transition-colors" style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}>
                    {p.title}
                  </p>
                  <p className="text-[14px] font-medium text-[#1c1b1b]">{getProductPrice(p)}</p>
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
