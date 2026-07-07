import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("unprocessed-hair-weave-bundles", "Unprocessed Hair Weave Bundles");
}

export default function Page() {
  return <CategoryCollectionPage slug="unprocessed-hair-weave-bundles" title="Unprocessed Hair Weave Bundles" />;
}
