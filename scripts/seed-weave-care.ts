import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const items = [
  { name: 'Weave Care Products', slug: 'weave-care-products' },
  { name: 'Weave Accessories', slug: 'weave-accessories' },
];

async function main() {
  console.log('Seeding weave care and accessories categories...');
  
  for (const item of items) {
    const existing = await prisma.category.findUnique({
      where: { slug: item.slug },
    });
    
    if (!existing) {
      await prisma.category.create({
        data: {
          name: item.name,
          slug: item.slug,
          description: `Shop premium ${item.name} at Royal Braids Uganda. Essential items for maintaining your weaves.`,
        },
      });
      console.log(`Created: ${item.name}`);
    } else {
      console.log(`Exists: ${item.name}`);
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
