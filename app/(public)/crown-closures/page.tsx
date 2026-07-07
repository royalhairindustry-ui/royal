import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("crown-closures", "Crown Closures");
}

export default function Page() {
  return <CategoryCollectionPage slug="crown-closures" title="Crown Closures" />;
}
