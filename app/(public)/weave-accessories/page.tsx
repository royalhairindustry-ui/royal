import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("weave-accessories", "Weave Accessories");
}

export default function Page() {
  return <CategoryCollectionPage slug="weave-accessories" title="Weave Accessories" />;
}
