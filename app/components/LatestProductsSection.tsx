import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import AddToCartButton from "./AddToCartButton";

import LatestProductsSectionClient from "./LatestProductsSectionClient";

async function getLatestProducts() {
  noStore();

  try {
    return await prisma.product.findMany({
      where: { status: "Active" },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    });
  } catch (error) {
    console.error("Failed to fetch latest products:", error);
    return [];
  }
}

export default async function LatestProductsSection() {
  const products = await getLatestProducts();

  if (products.length === 0) {
    return null;
  }

  return <LatestProductsSectionClient products={products} />;
}
