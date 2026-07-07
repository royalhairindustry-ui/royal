import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("clip-in-weaves", "Clip In Weaves");
}

export default function Page() {
  return <CategoryCollectionPage slug="clip-in-weaves" title="Clip In Weaves" />;
}
