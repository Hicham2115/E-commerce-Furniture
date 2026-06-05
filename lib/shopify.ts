import axios from "axios";

const SHOPIFY_ENDPOINT = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await axios.post(
    SHOPIFY_ENDPOINT,
    { query, variables },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      timeout: 10_000,
    }
  );
  if (res.data.errors) {
    throw new Error(res.data.errors[0]?.message ?? "Shopify API error");
  }
  return res.data.data as T;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_PRODUCTS = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          tags
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount }
          }
          images(first: 4) {
            edges { node { url altText } }
          }
          variants(first: 1) {
            edges { node { id price { amount } availableForSale } }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      tags
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        minVariantPrice { amount }
      }
      images(first: 8) {
        edges { node { url altText } }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
            compareAtPrice { amount }
            availableForSale
            selectedOptions { name value }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export const CREATE_CART = `
  mutation CreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount { amount currencyCode }
        }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product { title handle images(first:1){ edges{ node{ url } } } }
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

export const ADD_CART_LINES = `
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost { totalAmount { amount currencyCode } }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id title
                  price { amount currencyCode }
                  product { title handle images(first:1){ edges{ node{ url } } } }
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost { totalAmount { amount currencyCode } }
      lines(first: 20) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id title
                price { amount currencyCode }
                product { title handle images(first:1){ edges{ node{ url } } } }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Response types ────────────────────────────────────────────────────────────

export interface ShopifyProductsResponse {
  products: { edges: { node: import("./types").ShopifyProduct }[] };
}

export interface ShopifyProductResponse {
  product: import("./types").ShopifyProduct | null;
}

export interface ShopifyCreateCartResponse {
  cartCreate: { cart: import("./types").ShopifyCart; userErrors: { field: string; message: string }[] };
}

export interface ShopifyAddCartLinesResponse {
  cartLinesAdd: { cart: import("./types").ShopifyCart; userErrors: { field: string; message: string }[] };
}

export interface ShopifyGetCartResponse {
  cart: import("./types").ShopifyCart | null;
}
