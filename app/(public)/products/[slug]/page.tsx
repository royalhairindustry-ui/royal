import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailView from "@/app/components/ProductDetailView";
import RecentlyViewed from "@/app/components/RecentlyViewed";
import ProductHistoryTracker from "@/app/components/ProductHistoryTracker";
import { getPrimaryUnitOption } from "@/lib/product-unit-options";
import { absoluteUrl, buildMetadata, sanitizeDescription } from "@/lib/seo";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function getSeoProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      colors: true,
      unitOptions: {
        orderBy: { sortOrder: "asc" },
      },
      variations: true,
    },
  });
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getSeoProduct(slug);

  if (!product || product.status !== "Active") {
    return buildMetadata({
      title: "Product Not Found",
      description: "This product is not available in the Royal Braids catalog.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  const primaryUnitOption = getPrimaryUnitOption(product);
  const categoryName = product.category.name;
  const description = sanitizeDescription(
    product.description,
    `${product.name} in the ${categoryName} collection from Royal Braids Ltd. Shop premium hair products online.`,
  );

  return buildMetadata({
    title: `${product.name} | ${categoryName}`,
    description: `${description} From UGX ${primaryUnitOption.priceInCents.toLocaleString()}.`,
    path: `/products/${product.slug}`,
    image: product.image || product.hoverImage,
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await getSeoProduct(slug);

  if (!product || product.status !== "Active") {
    notFound();
  }

  const primaryUnitOption = getPrimaryUnitOption(product);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: sanitizeDescription(product.description),
    image: [product.image, product.hoverImage].filter(Boolean),
    sku: product.slug,
    category: product.category.name,
    brand: {
      "@type": "Brand",
      name: "Royal Braids Ltd",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "UGX",
      price: primaryUnitOption.priceInCents,
      availability:
        primaryUnitOption.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/products/${product.slug}`),
    },
  };

  const [sameCategoryProducts, latestProducts] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "Active",
        id: { not: product.id },
        categoryId: product.categoryId,
      },
      include: {
        category: true,
        colors: true,
        unitOptions: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 8,
    }),
    prisma.product.findMany({
      where: {
        status: "Active",
        id: { not: product.id },
      },
      include: {
        category: true,
        colors: true,
        unitOptions: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 16,
    }),
  ]);

  const recentProducts = [...sameCategoryProducts, ...latestProducts].filter(
    (item, index, items) =>
      items.findIndex((candidate) => candidate.id === item.id) === index,
  );

  const recentlyViewedItems = recentProducts.map((item) => {
    const relatedPrimaryUnitOption = getPrimaryUnitOption(item);

    return {
      id: item.id,
      slug: item.slug,
      image: item.image,
      title: item.name,
      shades:
        item.colors.length > 0
          ? `${item.colors.length} color${item.colors.length === 1 ? "" : "s"}`
          : undefined,
      price: `UGX ${relatedPrimaryUnitOption.priceInCents.toLocaleString()}`,
      tag1: "NEW",
      tag2: item.category.name.toUpperCase(),
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductHistoryTracker productId={product.id} slug={product.slug} />
      <ProductDetailView product={product} />
      <RecentlyViewed
        currentProductId={product.id}
        items={recentlyViewedItems}
      />
    </>
  );
}
