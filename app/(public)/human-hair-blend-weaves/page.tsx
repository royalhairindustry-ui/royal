import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("human-hair-blend-weaves", "Human Hair Blend Weaves");
}

export default function Page() {
  return <CategoryCollectionPage slug="human-hair-blend-weaves" title="Human Hair Blend Weaves" />;
}
