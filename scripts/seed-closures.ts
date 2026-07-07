import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const closures = [
  { name: 'Crown Closures', slug: 'crown-closures' },
  { name: 'Lace Part Closures', slug: 'lace-part-closures' },
  { name: '4x4 Lace Closures', slug: '4x4-lace-closures' },
  { name: '5x5 Lace Closures', slug: '5x5-lace-closures' },
  { name: '2x6 Lace Closures', slug: '2x6-lace-closures' },
  { name: '13x4 Lace Closures', slug: '13x4-lace-closures' },
  { name: '360 Lace Closures', slug: '360-lace-closures' },
];

async function main() {
  console.log('Seeding closures...');
  
  for (const closure of closures) {
    const existing = await prisma.category.findUnique({
      where: { slug: closure.slug },
    });
    
    if (!existing) {
      await prisma.category.create({
        data: {
          name: closure.name,
          slug: closure.slug,
          description: `Shop premium ${closure.name} at Royal Braids Uganda. High-quality hair closures for a natural look.`,
        },
      });
      console.log(`Created: ${closure.name}`);
    } else {
      console.log(`Exists: ${closure.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
