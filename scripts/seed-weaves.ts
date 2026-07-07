import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const weaves = [
  { name: 'Human Hair Weaves', slug: 'human-hair-weaves' },
  { name: 'Human Hair Blend Weaves', slug: 'human-hair-blend-weaves' },
  { name: 'Unprocessed Hair Weave Bundles', slug: 'unprocessed-hair-weave-bundles' },
  { name: 'Remy Hair Weaves', slug: 'remy-hair-weaves' },
];

async function main() {
  console.log('Seeding weaves categories...');
  
  for (const weave of weaves) {
    const existing = await prisma.category.findUnique({
      where: { slug: weave.slug },
    });
    
    if (!existing) {
      await prisma.category.create({
        data: {
          name: weave.name,
          slug: weave.slug,
          description: `Shop premium ${weave.name} at Royal Braids Uganda. High-quality hair weaves for a stunning look.`,
        },
      });
      console.log(`Created: ${weave.name}`);
    } else {
      console.log(`Exists: ${weave.name}`);
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
