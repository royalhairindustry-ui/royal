import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "Active" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const now = new Date();

  return [
    {
      url: getSiteUrl(),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/products"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/help"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...categories.map((category) => {
      const specialCategories = [
        "crown-closures",
        "lace-part-closures",
        "4x4-lace-closures",
        "5x5-lace-closures",
        "2x6-lace-closures",
        "13x4-lace-closures",
        "360-lace-closures",
        "human-hair-weaves",
        "human-hair-blend-weaves",
        "unprocessed-hair-weave-bundles",
        "remy-hair-weaves",
        "weave-care-products",
        "weave-accessories",
        "synthetic-hair-weaves",
        "organique-weaves",
        "clip-in-weaves"
      ];
      
      const isSpecial = specialCategories.includes(category.slug);
      const url = isSpecial 
        ? absoluteUrl(`/${category.slug}`)
        : absoluteUrl(`/products?category=${encodeURIComponent(category.slug)}`);

      return {
        url,
        lastModified: category.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    }),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
