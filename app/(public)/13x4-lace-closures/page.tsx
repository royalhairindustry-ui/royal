import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("13x4-lace-closures", "13x4 Lace Closures");
}

export default function Page() {
  return <CategoryCollectionPage slug="13x4-lace-closures" title="13x4 Lace Closures" />;
}
