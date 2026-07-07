import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("human-hair-weaves", "Human Hair Weaves");
}

export default function Page() {
  return <CategoryCollectionPage slug="human-hair-weaves" title="Human Hair Weaves" />;
}
