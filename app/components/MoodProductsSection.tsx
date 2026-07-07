import prisma from "@/lib/prisma";
import MoodProductsSectionClient from "./MoodProductsSectionClient";
import { cloudinaryImages } from "@/lib/cloudinary";
import { unstable_noStore as noStore } from "next/cache";

async function getMoodProducts() {
  noStore();
  try {
    const featuredProducts = await prisma.product.findMany({
      where: { status: "Active", isFeatured: true } as any,
      include: { category: true },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });

    if (featuredProducts.length > 0) {
      return featuredProducts;
    }

    return await prisma.product.findMany({
      where: { status: "Active" },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  } catch (error) {
    console.error("Failed to fetch mood products:", error);
    return [];
  }
}

export default async function MoodProductsSection() {
  const products = await getMoodProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <MoodProductsSectionClient 
      products={products} 
      bannerImage={cloudinaryImages.heroSlideOne} 
    />
  );
}
