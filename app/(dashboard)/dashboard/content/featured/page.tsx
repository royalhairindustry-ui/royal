import React from "react";
import prisma from "@/lib/prisma";
import FeaturedSectionsClient from "@/app/components/FeaturedSectionsClient";
import { MoveUp } from "lucide-react";

export const dynamic = "force-dynamic";

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
        prisma.homeSection.upsert({
          where: { type: section.type },
          update: {},
          create: {
            ...section,
            isVisible: true,
          },
        })
      )
    );

    return await prisma.homeSection.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch home sections:", error);
    return defaultSections.map((section) => ({
      id: section.order + 1,
      ...section,
      isVisible: true,
      updatedAt: new Date(),
    }));
  }
}

export default async function FeaturedContentPage() {
  const sections = await getHomeSections();

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black flex items-center gap-2">
            Home Page Sections
            <span className="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2 text-[11px] font-black uppercase text-emerald-600">
              Live Content
            </span>
          </h1>
          <p className="mt-1 text-[14px] text-zinc-500">
            Design the layout of your landing page by toggling section visibility and reordering components.
          </p>
        </div>
      </div>

      <FeaturedSectionsClient initialSections={sections} />
    </div>
  );
}
