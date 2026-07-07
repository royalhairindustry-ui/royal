import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("lace-part-closures", "Lace Part Closures");
}

export default function Page() {
  return <CategoryCollectionPage slug="lace-part-closures" title="Lace Part Closures" />;
}
