import prisma from "@/lib/prisma";
import HeroCarousel from "../components/HeroCarousel";
import CategoryCircles from "../components/CategoryCircles";
import FeaturedCategorySections from "../components/FeaturedCategorySections";
import LatestProductsSection from "../components/LatestProductsSection";
import ReelsProductCarousel from "../components/ReelsProductCarousel";
import FeaturedProductsSection from "../components/FeaturedProductsSection";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata({
  title: "Hair Extensions Uganda | Braids, Weaves, Closures & Crochet Hair",
  description:
    "Shop hair extensions in Uganda with premium braids, weaves, closures, crochet hair, and salon-quality hair care from Royal Braids Ltd in Kampala.",
  path: "/",
  image: "/auth-bg.png",
});

const defaultSections = [
  { type: "HeroCarousel", title: "Hero Carousel", order: 0 },
  { type: "CategoryCircles", title: "Category Circles", order: 1 },
  { type: "FeaturedCategories", title: "Featured Categories", order: 2 },
  { type: "FeaturedProducts", title: "Featured Products", order: 3 },
  { type: "LatestProducts", title: "Latest Products", order: 4 },
];

async function getHomeSections() {
  try {
    await Promise.all(
      defaultSections.map((section) =>
        (prisma as any).homeSection.upsert({
          where: { type: section.type },
          update: {},
          create: {
            ...section,
            isVisible: true,
          },
        })
      )
    );

    return await (prisma as any).homeSection.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch home sections:", error);
    // Return default order if DB fails
    return defaultSections;
  }
}

const componentMap: Record<string, React.ComponentType> = {
  HeroCarousel: HeroCarousel,
  CategoryCircles: CategoryCircles,
  FeaturedCategories: FeaturedCategorySections,
  FeaturedProducts: FeaturedProductsSection,
  LatestProducts: LatestProductsSection,
};

import ScrollAnimation from "../components/ScrollAnimation";

export default async function Home() {
  const sections = await getHomeSections();

  return (
    <main className="min-h-screen bg-white text-black overflow-hidden">
      {sections.map((section: { type: string }, idx: number) => {
        const Component = componentMap[section.type];
        if (!Component) return null;
        return (
          <ScrollAnimation key={section.type} delay={idx * 0.1}>
            <Component />
          </ScrollAnimation>
        );
      })}
      <ScrollAnimation>
        <ReelsProductCarousel />
      </ScrollAnimation>
    </main>
  );
}
