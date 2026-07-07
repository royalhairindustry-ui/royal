import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sections = [
    { type: "HeroCarousel", title: "Hero Banners", order: 0 },
    { type: "CategoryCircles", title: "Shop Categories", order: 1 },
    { type: "MoodProducts", title: "Must-Haves (Mood Products)", order: 2 },
    { type: "FeaturedCategories", title: "Featured Categories Banners", order: 3 },
    { type: "LatestProducts", title: "Latest Products", order: 4 },
  ];

  for (const section of sections) {
    await prisma.homeSection.upsert({
      where: { type: section.type },
      update: {},
      create: section,
    });
  }

  console.log("Home sections seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
