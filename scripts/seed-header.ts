import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Topbar Messages
  const topbar = [
    { text: "Free delivery in Kampala on qualifying orders", order: 0 },
    { text: "New premium braid textures now available", order: 1 },
    { text: "Book bulk orders for salons and resellers", order: 2 },
  ];

  for (const msg of topbar) {
    await prisma.topbarMessage.create({
      data: msg,
    });
  }

  // Header Nav Items
  const nav = [
    { name: "Closure", href: "/inventory?category=closure", order: 0 },
    { name: "Crochet Braid", href: "/inventory?category=crochet-braid", order: 1 },
    { name: "Weaves", href: "/inventory?category=weaves", order: 2 },
    { name: "Braids", href: "/inventory?category=braids", order: 3 },
    { name: "Blog", href: "/blog", order: 4 },
    { name: "Contact Us", href: "/contact", order: 5 },
    { name: "Help", href: "/help", order: 6 },
  ];

  for (const item of nav) {
    await prisma.headerNavItem.create({
      data: item,
    });
  }

  // Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      contactEmail: "info@royalbraids.ug",
      contactPhone: "+256 793695678",
    },
  });

  console.log("Header settings seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
