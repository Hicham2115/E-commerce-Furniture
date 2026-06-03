export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (limit?: number) => ["products", "list", limit] as const,
    detail: (id: number) => ["products", "detail", id] as const,
  },
  newsletter: ["newsletter"] as const,
};
