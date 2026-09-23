import type { ShopifyProduct } from "./types";

type MockProductInput = {
  handle: string;
  title: string;
  description: string;
  tag: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  optionName: string;
  optionValues: string[];
};

const productImages = {
  sofa: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYoGYhzqnK_mOSFfEwA2MEhhTaE0t957CLNkTPiwtIqQJKsxrizxfdH8bDZ1ti3P6J80Uzaz-bIu3L_0AUSbNQd9Ak7WHqKt0vNhH0n0bWfe7FiVj4BbFGgmVxjX9LkMMcpXg7acUFzxx9qsCkraukUwbFcSoh318xG1A-DNHVroerFWCWuSh1XuXTBrHos-IHPPiKT2O4qZitDZP4Hhb9FFHbMyJqZaYjxhs9dlVmCI1zIIKxBxqYvD6E0Vs3xkaxs0L21Z4VhG-u",
  armchair: "https://lh3.googleusercontent.com/aida-public/AB6AXuCX0NJ5IZw6V8jp-Kl3K3yAAA_Dd02psPio3JHEybxSo370mpbLYrXmCuYl428miwPyyVm81opBCKf_u6eHmE-RcVeBOtBJZyRaZMYeGwjcvgAd7yqTy6hQgFpzlGKB41EiyFanuxytcXjwCrHnlm2AOBxBQWF81cws0jxK4UF2aub4mDMok47cQHX381wcQ9SruO23lhlBlWqwBXnGu_9VWh5dFngfocX0agwznEva-b0SoPJKmLNgRmie6Ayodwjv6QNP61ZCJzbY",
  marble: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7OPJbVOBPbof7-SSXheApfVFQAMsoQeuNw3y7NygwxaOSJ2zKvVPeera1GuGN_eCwPZUyWRiW-dCm8GuIKkwO15fhtE-T-ewg2IRwjR3YCaWZIeeO6CpYlGAvslJwbO9trdOjQR5z5CxIEwM2CHtBayKOgepNuG_Ye1DKpIWkYQ1qryn4I09V0-BT5iEQ9SIj7sT0NDKZzCmwGtcGOC3QLwglXuRqU5ECvdtYrEP34CLKIJ323RuvJvMsjO3uvviYOivqvHD-8Cah",
  bed: "https://lh3.googleusercontent.com/aida-public/AB6AXuAawwcXXzz-CkfIUSvD26Gmrr8zQsJIIDBys-Wa9VfhwAt2ZFxg6q3mR2xvdubw6M228rZzHz_DjbKQ7Rna9O-0xFQLwKBL8NNA1in52jek7BDAs7uLUJQlyPeWiCTmF9Fn-ah2tRfukWf1sq4QDtH8_jOzlzGM63TlU-2hpIoxG6nltzRnOXIVLqDwZu7Th-4L6_C4LNozdDAKAUw-pFLQcK_4aye755HFZKXmUeMtd0uypj9ij1aIW69N8AlQV2vZwkGBHuFr8rrg",
};

function createMockProduct(input: MockProductInput): ShopifyProduct {
  const amount = String(input.price / 10);
  const compareAtAmount = String((input.compareAtPrice ?? 0) / 10);

  return {
    id: `mock-${input.handle}`,
    handle: input.handle,
    title: input.title,
    description: input.description,
    descriptionHtml: `<p>${input.description}</p>`,
    tags: [input.tag],
    priceRange: { minVariantPrice: { amount, currencyCode: "MAD" } },
    compareAtPriceRange: { minVariantPrice: { amount: compareAtAmount } },
    images: { edges: [{ node: { url: input.image, altText: input.title } }] },
    variants: {
      edges: input.optionValues.map((value, index) => ({
        node: {
          id: `mock-${input.handle}-${index + 1}`,
          title: value,
          price: { amount, currencyCode: "MAD" },
          compareAtPrice: input.compareAtPrice ? { amount: compareAtAmount } : null,
          availableForSale: true,
          selectedOptions: [{ name: input.optionName, value }],
        },
      })),
    },
    options: [{ name: input.optionName, values: input.optionValues }],
  };
}

// Local showroom data keeps the site presentable before the Shopify catalog is connected.
export const mockProducts = [
  createMockProduct({
    handle: "velour-sofa-case",
    title: "Velour Sofa Case",
    description: "A masterfully upholstered sofa in premium velour fabric, with clean lines and deep cushioning.",
    tag: "Sofa",
    price: 1200,
    compareAtPrice: 1500,
    image: productImages.sofa,
    optionName: "Color",
    optionValues: ["Ivory", "Charcoal", "Sand"],
  }),
  createMockProduct({
    handle: "lounge-armchair",
    title: "Lounge Armchair",
    description: "A sculptural lounge chair with a solid oak frame and premium full-grain leather upholstery.",
    tag: "Armchair",
    price: 3600,
    compareAtPrice: 4200,
    image: productImages.armchair,
    optionName: "Color",
    optionValues: ["Cognac", "Midnight Black"],
  }),
  createMockProduct({
    handle: "marble-center-table",
    title: "Marble Center Table",
    description: "Carved from premium marble with hand-polished brass legs, designed to anchor a living room.",
    tag: "Coffee Table",
    price: 8400,
    compareAtPrice: 9800,
    image: productImages.marble,
    optionName: "Marble",
    optionValues: ["Black Marquina", "Calacatta White"],
  }),
  createMockProduct({
    handle: "bedroom-platform-bed",
    title: "Bedroom Platform Bed",
    description: "A low-profile platform bed with a generous bouclé headboard and a solid walnut base.",
    tag: "Bed",
    price: 6800,
    compareAtPrice: 7500,
    image: productImages.bed,
    optionName: "Size",
    optionValues: ["Queen", "King"],
  }),
  createMockProduct({
    handle: "dining-stone-table",
    title: "Dining Stone Table",
    description: "A raw-edge quartzite dining table with a minimal matte-black steel base. Seats six.",
    tag: "Dining Table",
    price: 12500,
    compareAtPrice: 14000,
    image: productImages.marble,
    optionName: "Finish",
    optionValues: ["Natural Stone"],
  }),
  createMockProduct({
    handle: "wishbone-oak-chair",
    title: "Wishbone Oak Chair",
    description: "A classic wishbone silhouette in smoked oak with a hand-woven paper-cord seat.",
    tag: "Dining Chair",
    price: 1800,
    compareAtPrice: 2200,
    image: productImages.armchair,
    optionName: "Quantity",
    optionValues: ["Single", "Set of 4"],
  }),
  createMockProduct({
    handle: "arc-floor-lamp",
    title: "Arc Floor Lamp",
    description: "A dramatic brushed-brass arc lamp with a hand-spun ceramic shade and marble base.",
    tag: "Floor Lamp",
    price: 4200,
    compareAtPrice: 5000,
    image: productImages.sofa,
    optionName: "Shade",
    optionValues: ["Ivory Ceramic", "Charcoal Ceramic"],
  }),
  createMockProduct({
    handle: "linen-curtain-set",
    title: "Linen Curtain Set",
    description: "Pre-washed Belgian linen curtains, 300 cm by 140 cm per panel, sold as a pair.",
    tag: "Curtains",
    price: 950,
    compareAtPrice: 1200,
    image: productImages.bed,
    optionName: "Color",
    optionValues: ["Natural Linen", "Warm White", "Slate Grey"],
  }),
];

export function getMockProduct(handle: string) {
  return mockProducts.find((product) => product.handle === handle);
}
