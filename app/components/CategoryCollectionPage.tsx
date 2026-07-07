import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import prisma from "@/lib/prisma";
import { buildMetadata, sanitizeDescription } from "@/lib/seo";
import PriceTag from "./PriceTag";
import DiscountBadge from "./DiscountBadge";
import { cdnImage } from "@/lib/cdn-image";

export const dynamic = "force-dynamic";

async function getProductsInCategory(categorySlug: string) {
  try {
    const where: any = { 
      status: "Active",
      category: { slug: categorySlug }
    };
    
    return await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error(`Failed to fetch products for category ${categorySlug}:`, error);
    return [];
  }
}

async function getCategory(slug: string) {
  return await prisma.category.findUnique({
    where: { slug: slug },
  });
}

export default async function CategoryCollectionPage({ 
  slug,
  title: fallbackTitle
}: { 
  slug: string;
  title: string;
}) {
  const products = await getProductsInCategory(slug);
  const category = await getCategory(slug);
  
  const displayTitle = category?.name || fallbackTitle;
  const displayDescription = category?.description || `Browse ${displayTitle.toLowerCase()} products from Royal Braids Uganda.`;

  return (
    <section className="min-h-screen bg-white px-4 py-8 md:px-8 xl:px-12">
      <div className="mx-auto max-w-[1320px]">
        <Link
          href="/products"
          className="mb-6 flex items-center gap-2 text-[14px] font-medium text-black/60 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Products
        </Link>

        <div className="mb-10">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            Collection
          </p>
          <h1 className="text-[34px] font-black uppercase tracking-tight text-black md:text-[42px]">
            {displayTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] text-zinc-600">
            {displayDescription}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-8 py-16 text-center text-zinc-500">
            We currently don't have any products in the {displayTitle} collection. Please check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <article className="overflow-hidden rounded-[2px] border border-zinc-100 bg-white">
                  <div className="relative h-[220px] overflow-hidden bg-zinc-100 sm:h-[420px]">
                    <DiscountBadge
                      priceInCents={product.priceInCents}
                      compareAtPriceInCents={product.compareAtPriceInCents}
                    />
                    {product.image ? (
                      <img
                        src={cdnImage(product.image)}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[80px] font-black uppercase text-zinc-300">
                        {product.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-3 sm:px-5 sm:py-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                        {product.category.name}
                      </span>
                    </div>
                    <h2 className="line-clamp-2 text-[14px] sm:text-[20px] font-bold uppercase tracking-tight text-black">
                      {product.name}
                    </h2>
                    <div className="mt-3 flex items-center gap-1 text-black">
                      <Star className="h-4 w-4 fill-black text-black" />
                      <Star className="h-4 w-4 fill-black text-black" />
                      <Star className="h-4 w-4 fill-black text-black" />
                      <Star className="h-4 w-4 fill-black text-black" />
                      <Star className="h-4 w-4 text-black" />
                    </div>
                    <PriceTag
                      priceInCents={product.priceInCents}
                      compareAtPriceInCents={product.compareAtPriceInCents}
                      className="mt-2 text-[15px] sm:mt-4 sm:text-[20px] font-black text-black"
                    />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export async function generateCategoryMetadata(slug: string, fallbackTitle: string): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return buildMetadata({
      title: `${fallbackTitle} | Royal Braids Uganda`,
      description: `Shop ${fallbackTitle} hair extensions at Royal Braids. Best quality and prices in Kampala.`,
      path: `/${slug}`,
    });
  }

  return buildMetadata({
    title: `${category.name} Collection`,
    description: sanitizeDescription(
      category.description,
      `Browse ${category.name.toLowerCase()} products from Royal Braids Ltd.`
    ),
    path: `/${slug}`,
    image: category.featuredBanner || category.banner,
  });
}
