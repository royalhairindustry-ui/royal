import { getFeaturedProducts } from "@/lib/actions";
import FeaturedProductsSectionClient from "./FeaturedProductsSectionClient";

export default async function FeaturedProductsSection() {
  const products = await getFeaturedProducts(12);

  if (products.length === 0) return null;

  return <FeaturedProductsSectionClient products={products as any} />;
}
