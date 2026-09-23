import type { Metadata } from "next";
import { getMockProduct } from "@/lib/mockProducts";
import { ProductDetailClient } from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getMockProduct(id);
  return product
    ? { title: product.title, description: product.description }
    : { title: "Product" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
