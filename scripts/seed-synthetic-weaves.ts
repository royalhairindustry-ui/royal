import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const items = [
  { name: 'Synthetic Hair Weaves', slug: 'synthetic-hair-weaves' },
  { name: 'Organique Weaves', slug: 'organique-weaves' },
  { name: 'Clip In Weaves', slug: 'clip-in-weaves' },
];

async function main() {
  console.log('Seeding synthetic and clip-in weave categories...');
  
  for (const item of items) {
    const existing = await prisma.category.findUnique({
      where: { slug: item.slug },
    });
    
    if (!existing) {
      await prisma.category.create({
        data: {
          name: item.name,
          slug: item.slug,
          description: `Shop premium ${item.name} at Royal Braids Uganda. High-quality hair for various styles.`,
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
