import CategoryCollectionPage, { generateCategoryMetadata } from "@/app/components/CategoryCollectionPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateCategoryMetadata("360-lace-closures", "360 Lace Closures");
}

export default function Page() {
  return <CategoryCollectionPage slug="360-lace-closures" title="360 Lace Closures" />;
}
