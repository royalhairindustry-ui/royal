import prisma from "@/lib/prisma";
import PremiumCategoryCirclesClient from "./PremiumCategoryCirclesClient";
import { unstable_noStore as noStore } from "next/cache";

export default async function CategoryCircles() {
  noStore();

  let categories: Array<{
    id: number;
    name: string;
    slug: string;
    circleImage: string;
  }> = [];

  try {
    categories = await prisma.category.findMany({
      where: {
        circleImage: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        circleImage: true,
      },
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
      take: 4,
    }) as Array<{
      id: number;
      name: string;
      slug: string;
      circleImage: string;
    }>;
  } catch (error) {
    console.warn("Failed to fetch category circles:", error);
  }

  if (categories.length === 0) {
    return null;
  }

  return <PremiumCategoryCirclesClient categories={categories} />;
}
