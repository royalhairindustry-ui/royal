import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("4x4-lace-closures", "4x4 Lace Closures");
}

export default function Page() {
  return <CategoryCollectionPage slug="4x4-lace-closures" title="4x4 Lace Closures" />;
}
