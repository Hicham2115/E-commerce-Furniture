"use client";
import { useMutation } from "@tanstack/react-query";
import { X, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useCartStore } from "@/lib/cartStore";
import { shopifyFetch, ADD_CART_LINES, CREATE_CART, type ShopifyCreateCartResponse, type ShopifyAddCartLinesResponse } from "@/lib/shopify";
import { getFirstVariantId, type ShopifyProduct } from "@/lib/types";

export function CartDrawer() {
  const { cart, isOpen, closeCart } = useCartStore();

  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  const total = cart?.cost.totalAmount;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={closeCart}
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
            <ShoppingBag aria-hidden="true" className="h-5 w-5 text-[#1c1b1b]" />
            <h2
              className="text-[18px] font-medium text-[#1c1b1b]"
              style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
            >
              Your Bag
              {cart && cart.totalQuantity > 0 && (
                <span className="ml-2 text-[13px] text-[#444748]">({cart.totalQuantity})</span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 hover:opacity-60 transition-opacity"
          >
            <X aria-hidden="true" className="h-5 w-5 text-[#1c1b1b]" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20 text-center">
              <ShoppingBag aria-hidden="true" className="h-12 w-12 text-[#c4c7c7]" />
              <p className="text-[14px] tracking-wider text-[#444748]">Your bag is empty</p>
              <button
                onClick={closeCart}
                className="mt-2 border border-[#1c1b1b] px-6 py-3 text-[11px] tracking-widest uppercase hover:bg-[#1c1b1b] hover:text-white transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            lines.map((line) => (
              <div key={line.id} className="flex gap-4 border-b border-[#c4c7c7]/20 pb-6">
                <div className="clip-poly-1 h-20 w-16 flex-shrink-0 overflow-hidden bg-[#f1edec]">
                  <img
                    src={line.merchandise.product.images.edges[0]?.node.url ?? ""}
                    alt={line.merchandise.product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p
                      className="text-[14px] font-medium text-[#1c1b1b] line-clamp-1"
                      style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                    >
                      {line.merchandise.product.title}
                    </p>
                    {line.merchandise.title !== "Default Title" && (
                      <p className="mt-0.5 text-[11px] text-[#444748]">{line.merchandise.title}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#444748]">Qty: {line.quantity}</span>
                    <span className="text-[14px] font-medium text-[#1c1b1b]">
                      {(parseFloat(line.merchandise.price.amount) * line.quantity * 10).toFixed(0)} DH
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && cart && (
          <div className="border-t border-[#c4c7c7]/30 px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] tracking-wider text-[#444748] uppercase">Total</span>
              <span
                className="text-[22px] font-medium text-[#1c1b1b]"
                style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
              >
                {(parseFloat(total?.amount ?? "0") * 10).toFixed(0)} DH
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              className="group flex w-full items-center justify-center gap-3 bg-[#1c1b1b] py-4 text-[11px] font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#e4c285] hover:text-[#1c1b1b]"
            >
              Checkout
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="text-center text-[11px] tracking-wider text-[#444748]">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// Hook used by product pages to add to cart
export function useAddToCart() {
  const { cartId, setCart, openCart } = useCartStore();

  return useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
      const lines = [{ merchandiseId: variantId, quantity }];

      if (cartId) {
        const res = await shopifyFetch<ShopifyAddCartLinesResponse>(ADD_CART_LINES, {
          cartId,
          lines,
        });
        if (res.cartLinesAdd.userErrors.length > 0) {
          throw new Error(res.cartLinesAdd.userErrors[0].message);
        }
        return res.cartLinesAdd.cart;
      } else {
        const res = await shopifyFetch<ShopifyCreateCartResponse>(CREATE_CART, { lines });
        if (res.cartCreate.userErrors.length > 0) {
          throw new Error(res.cartCreate.userErrors[0].message);
        }
        return res.cartCreate.cart;
      }
    },
    onSuccess: (cart) => {
      setCart(cart);
      openCart();
      toast.success("Added to bag");
    },
    onError: (err) => {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.errors?.[0]?.message ?? err.message)
        : (err as Error).message;
      toast.error("Could not add to bag", { description: msg });
    },
  });
}
