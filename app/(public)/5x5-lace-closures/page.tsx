import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("5x5-lace-closures", "5x5 Lace Closures");
}

export default function Page() {
  return <CategoryCollectionPage slug="5x5-lace-closures" title="5x5 Lace Closures" />;
}
