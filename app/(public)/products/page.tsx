import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, Star } from "lucide-react";
import prisma from "@/lib/prisma";
import { buildMetadata, sanitizeDescription } from "@/lib/seo";
import PriceTag from "@/app/components/PriceTag";
import DiscountBadge from "@/app/components/DiscountBadge";
import ProductsFilterSidebar from "@/app/components/ProductsFilterSidebar";
import { cdnImage } from "@/lib/cdn-image";
import { getMockRating } from "@/lib/mock-rating";

export const dynamic = "force-dynamic";

type ProductsSearchParams = {
  category?: string;
  color?: string;
  variation?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  inStock?: string;
  sort?: string;
};

function parseVariationGroups(variationParam?: string) {
  const groups = new Map<string, string[]>();
  if (!variationParam) return groups;
  for (const pair of variationParam.split(",").filter(Boolean)) {
    const [type, value] = pair.split(":");
    if (!type || !value) continue;
    groups.set(type, [...(groups.get(type) ?? []), value]);
  }
  return groups;
}

async function getProducts(params: ProductsSearchParams) {
  try {
    const where: any = { status: "Active" };

    const categorySlugs = params.category?.split(",").filter(Boolean) ?? [];
    if (categorySlugs.length) {
      where.category = { slug: { in: categorySlugs } };
    }

    const colorHexes = params.color?.split(",").filter(Boolean) ?? [];
    if (colorHexes.length) {
      where.colors = { some: { hex: { in: colorHexes } } };
    }

    if (params.inStock === "1") {
      where.stock = { gt: 0 };
    }

    const minPrice = params.minPrice ? Number(params.minPrice) * 100 : undefined;
    const maxPrice = params.maxPrice ? Number(params.maxPrice) * 100 : undefined;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.priceInCents = {};
      if (minPrice !== undefined && !Number.isNaN(minPrice)) where.priceInCents.gte = minPrice;
      if (maxPrice !== undefined && !Number.isNaN(maxPrice)) where.priceInCents.lte = maxPrice;
    }

    const variationGroups = parseVariationGroups(params.variation);
    if (variationGroups.size) {
      where.AND = Array.from(variationGroups.entries()).map(([type, values]) => ({
        variations: { some: { type, value: { in: values } } },
      }));
    }

    let orderBy: any = { createdAt: "desc" };
    if (params.sort === "price_asc") orderBy = { priceInCents: "asc" };
    else if (params.sort === "price_desc") orderBy = { priceInCents: "desc" };

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
    });

    const withRatings = products.map((product) => ({
      ...product,
      ...getMockRating(product.id),
    }));

    const minRating = params.minRating ? Number(params.minRating) : undefined;
    const filtered = minRating
      ? withRatings.filter((product) => product.rating >= minRating)
      : withRatings;

    if (params.sort === "rating_desc") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  } catch (error) {
    console.error("Failed to fetch storefront products:", error);
    return [];
  }
}

async function getFilterOptions() {
  const activeProductFilter = { status: "Active" as const };

  const [categories, colors, variations, priceBounds] = await Promise.all([
    prisma.category.findMany({
      where: { products: { some: activeProductFilter } },
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.color.findMany({
      where: { products: { some: activeProductFilter } },
      select: { hex: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.variation.findMany({
      where: { product: activeProductFilter },
      distinct: ["type", "value"],
      select: { type: true, value: true },
      orderBy: [{ type: "asc" }, { value: "asc" }],
    }),
    prisma.product.aggregate({
      where: activeProductFilter,
      _min: { priceInCents: true },
      _max: { priceInCents: true },
    }),
  ]);

  const variationGroupsMap = new Map<string, string[]>();
  for (const { type, value } of variations) {
    variationGroupsMap.set(type, [...(variationGroupsMap.get(type) ?? []), value]);
  }
  const variationGroups = Array.from(variationGroupsMap.entries()).map(([type, values]) => ({
    type,
    values,
  }));

  return {
    categories,
    colors,
    variationGroups,
    priceBounds: {
      min: Math.floor((priceBounds._min.priceInCents ?? 0) / 100),
      max: Math.ceil((priceBounds._max.priceInCents ?? 0) / 100),
    },
  };
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<ProductsSearchParams>
}) {
  const params = await searchParams;
  const [products, filterOptions] = await Promise.all([
    getProducts(params),
    getFilterOptions(),
  ]);

  return (
    <section className="min-h-screen bg-white px-4 py-8 md:px-8 xl:px-12">
      <div className="mx-auto max-w-[1320px]">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2 text-[14px] font-medium text-black/60 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Link>

        <div className="mb-10">
          <h1 className="text-[34px] font-black uppercase tracking-tight text-black">
            Hair Extensions & Hair Care
          </h1>
          <p className="mt-3 text-[17px] text-zinc-600">
            Browse braiding hair, crochet hair, weaves, closures, and hair care products available in Uganda from the Royal Braids catalog.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <Suspense fallback={null}>
            <ProductsFilterSidebar
              categories={filterOptions.categories}
              colors={filterOptions.colors}
              variationGroups={filterOptions.variationGroups}
              priceBounds={filterOptions.priceBounds}
              resultCount={products.length}
            />
          </Suspense>

          <div>
        {products.length === 0 ? (
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-8 py-16 text-center text-zinc-500">
            No products match these filters.
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
                    <div className="mt-3 flex items-center gap-1.5 text-black">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(product.rating)
                                ? "fill-[#D4AF37] text-[#D4AF37]"
                                : "text-zinc-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[12px] font-medium text-zinc-500">
                        {product.rating.toFixed(1)} ({product.reviewCount})
                      </span>
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
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const primaryCategorySlug = category?.split(",")[0];

  if (!primaryCategorySlug) {
    return buildMetadata({
      title: "Shop Hair Extensions Uganda",
      description:
        "Browse hair extensions in Uganda from Royal Braids including braiding hair, weaves, closures, crochet hair, and hair care essentials.",
      path: "/products",
    });
  }

  const selectedCategory = await prisma.category.findUnique({
    where: { slug: primaryCategorySlug },
    select: {
      name: true,
      description: true,
      banner: true,
      featuredBanner: true,
    },
  });

  if (!selectedCategory) {
    return buildMetadata({
      title: "Shop Products",
      description:
        "Browse the Royal Braids product catalog for premium hair collections and essentials.",
      path: `/products?category=${encodeURIComponent(category)}`,
    });
  }

  return buildMetadata({
    title: `${selectedCategory.name} Collection`,
    description: sanitizeDescription(
      selectedCategory.description,
      `Browse ${selectedCategory.name.toLowerCase()} products from Royal Braids Ltd.`,
    ),
    path: `/products?category=${encodeURIComponent(category)}`,
    image: selectedCategory.featuredBanner || selectedCategory.banner,
  });
}
