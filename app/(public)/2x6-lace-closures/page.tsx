import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("2x6-lace-closures", "2x6 Lace Closures");
}

export default function Page() {
  return <CategoryCollectionPage slug="2x6-lace-closures" title="2x6 Lace Closures" />;
}
