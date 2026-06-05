import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShopifyProduct } from "./types";

interface WishlistStore {
  items: ShopifyProduct[];
  isOpen: boolean;

  toggle: (product: ShopifyProduct) => void;
  has: (id: string) => boolean;
  open: () => void;
  close: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      toggle: (product) =>
        set((s) => ({
          items: s.items.some((p) => p.id === product.id)
            ? s.items.filter((p) => p.id !== product.id)
            : [...s.items, product],
        })),

      has: (id) => get().items.some((p) => p.id === id),

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: "maison-wishlist" }
  )
);
