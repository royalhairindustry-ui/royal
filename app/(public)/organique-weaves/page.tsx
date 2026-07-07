import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("organique-weaves", "Organique Weaves");
}

export default function Page() {
  return <CategoryCollectionPage slug="organique-weaves" title="Organique Weaves" />;
}
