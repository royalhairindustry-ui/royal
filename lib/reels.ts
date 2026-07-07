import prisma from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db";

export type ProductReel = {
  id: number;
  video: string;
  poster: string | null;
  productImage: string | null;
  title: string;
  price: string;
  link: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function isMissingReelTableError(error: unknown) {
  const err = error as {
    code?: string;
    meta?: { table?: string; modelName?: string };
    message?: string;
  };
  const message = err?.message ?? "";

  return (
    err?.code === "P2021" ||
    err?.meta?.table === "Reel" ||
    err?.meta?.modelName === "Reel" ||
    message.includes('relation "Reel" does not exist') ||
    message.includes('table "Reel" does not exist')
  );
}

export async function getProductReels(): Promise<ProductReel[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.$queryRawUnsafe<ProductReel[]>(`
      SELECT id, video, poster, "productImage", title, price, link, "createdAt", "updatedAt"
      FROM "Reel"
      ORDER BY "createdAt" DESC
    `);
  } catch (error) {
    if (isMissingReelTableError(error)) {
      return [];
    }

    console.error("Failed to fetch reels from database:", error);
    return [];
  }
}
