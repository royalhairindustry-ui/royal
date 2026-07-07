import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding navigation links...');
  
  const aboutLink = { name: 'About Us', href: '/about', order: 5, isVisible: true };
  
  // Find current items to determine order if needed or just upsert
  const existing = await (prisma as any).headerNavItem.findFirst({
    where: { name: 'About Us' },
  });
  
  if (!existing) {
    await (prisma as any).headerNavItem.create({
      data: aboutLink,
    });
    console.log('Created About Us nav item');
  } else {
    console.log('About Us nav item already exists');
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
