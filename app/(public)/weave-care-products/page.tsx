import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("weave-care-products", "Weave Care Products");
}

export default function Page() {
  return <CategoryCollectionPage slug="weave-care-products" title="Weave Care Products" />;
}
