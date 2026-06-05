"use client";
import Link from "next/link";
import { X, Heart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useAddToCart } from "@/components/CartDrawer";
import { getProductPrice, getProductImage, getFirstVariantId } from "@/lib/types";

export function WishlistDrawer() {
  const { items, isOpen, close, toggle } = useWishlistStore();
  const addToCart = useAddToCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#fdf8f8] shadow-2xl transition-transform duration-400 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#c4c7c7]/30 px-6 py-5">
          <div className="flex items-center gap-3">
            <Heart aria-hidden="true" className="h-5 w-5 text-[#1c1b1b]" />
            <h2
              className="text-[18px] font-medium text-[#1c1b1b]"
              style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
            >
              Wishlist
              {items.length > 0 && (
                <span className="ml-2 text-[13px] text-[#444748]">({items.length})</span>
              )}
            </h2>
          </div>
          <button
            onClick={close}
            aria-label="Close wishlist"
            className="p-2 hover:opacity-60 transition-opacity"
          >
            <X aria-hidden="true" className="h-5 w-5 text-[#1c1b1b]" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20 text-center">
              <Heart aria-hidden="true" className="h-12 w-12 text-[#c4c7c7]" />
              <p className="text-[14px] tracking-wider text-[#444748]">Your wishlist is empty</p>
              <button
                onClick={close}
                className="mt-2 border border-[#1c1b1b] px-6 py-3 text-[11px] tracking-widest uppercase hover:bg-[#1c1b1b] hover:text-white transition-all duration-300"
              >
                Explore Products
              </button>
            </div>
          ) : (
            items.map((product) => {
              const image = getProductImage(product);
              const price = getProductPrice(product);
              const variantId = getFirstVariantId(product);

              return (
                <div key={product.id} className="flex gap-4 border-b border-[#c4c7c7]/20 pb-6">
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${product.handle}`}
                    onClick={close}
                    className="clip-poly-1 h-24 w-20 flex-shrink-0 overflow-hidden bg-[#f1edec] hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-[#e4c285] mb-1">
                        {product.tags[0] ?? "MAISON"}
                      </p>
                      <Link
                        href={`/products/${product.handle}`}
                        onClick={close}
                        className="text-[15px] font-medium text-[#1c1b1b] hover:text-[#745a27] transition-colors line-clamp-1"
                        style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                      >
                        {product.title}
                      </Link>
                      <p className="mt-1 text-[14px] font-medium text-[#1c1b1b]">{price}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => {
                          if (!variantId) return;
                          addToCart.mutate({ variantId, quantity: 1 });
                          close();
                        }}
                        disabled={addToCart.isPending || !variantId}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 bg-[#1c1b1b] py-2 text-[10px] tracking-widest uppercase text-white transition-colors hover:bg-[#e4c285] hover:text-[#1c1b1b] disabled:opacity-50"
                      >
                        Add to Bag
                        <ArrowRight aria-hidden="true" className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => {
                          toggle(product);
                          toast.success("Removed from wishlist");
                        }}
                        aria-label="Remove from wishlist"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center border border-[#c4c7c7]/60 hover:border-red-300 hover:text-red-400 transition-colors"
                      >
                        <X aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#c4c7c7]/30 px-6 py-5">
            <Link
              href="/products"
              onClick={close}
              className="flex w-full items-center justify-center gap-2 border border-[#1c1b1b] py-3 text-[11px] tracking-widest uppercase text-[#1c1b1b] hover:bg-[#1c1b1b] hover:text-white transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
