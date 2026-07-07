import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env / .env.local and restart the dev server.",
    );
  }

  return new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
