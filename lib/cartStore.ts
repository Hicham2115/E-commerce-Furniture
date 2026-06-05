import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShopifyCart } from "./types";

interface CartStore {
  cartId: string | null;
  cart: ShopifyCart | null;
  isOpen: boolean;

  setCart: (cart: ShopifyCart) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartId: null,
      cart: null,
      isOpen: false,

      setCart: (cart) => set({ cart, cartId: cart.id }),
      clearCart: () => set({ cart: null, cartId: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: "maison-cart",
      // Only persist cartId so we can re-fetch the cart on next visit
      partialize: (s) => ({ cartId: s.cartId }),
    }
  )
);
