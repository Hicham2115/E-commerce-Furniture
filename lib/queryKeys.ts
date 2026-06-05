export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (limit?: number) => ["products", "list", limit] as const,
    detail: (handle: string) => ["products", "detail", handle] as const,
  },
  cart: {
    get: (cartId: string) => ["cart", cartId] as const,
  },
  newsletter: ["newsletter"] as const,
};
