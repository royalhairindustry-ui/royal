import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("synthetic-hair-weaves", "Synthetic Hair Weaves");
}

export default function Page() {
  return <CategoryCollectionPage slug="synthetic-hair-weaves" title="Synthetic Hair Weaves" />;
}
