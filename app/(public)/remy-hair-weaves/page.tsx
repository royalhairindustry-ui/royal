import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("remy-hair-weaves", "Remy Hair Weaves");
}

export default function Page() {
  return <CategoryCollectionPage slug="remy-hair-weaves" title="Remy Hair Weaves" />;
}
