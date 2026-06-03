import type { Metadata } from "next";
import { ProductsClient } from "./ProductsClient";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our full collection of luxury furniture and home goods.",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
