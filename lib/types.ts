// ─── Shopify Storefront types ──────────────────────────────────────────────────

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string } | null;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string } };
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyVariant }[] };
  options?: { name: string; values: string[] }[];
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: {
      title: string;
      handle: string;
      images: { edges: { node: { url: string } }[] };
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  lines: { edges: { node: ShopifyCartLine }[] };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function getProductPrice(product: ShopifyProduct): string {
  const amount = parseFloat(product.priceRange.minVariantPrice.amount);
  return `${(amount * 10).toFixed(0)} DH`;
}

export function getProductImage(product: ShopifyProduct, index = 0): string {
  return product.images.edges[index]?.node.url ?? "";
}

export function getFirstVariantId(product: ShopifyProduct): string {
  return product.variants.edges[0]?.node.id ?? "";
}

// ─── Legacy types (kept for compatibility) ─────────────────────────────────────

export interface NewsletterPayload {
  email: string;
}
