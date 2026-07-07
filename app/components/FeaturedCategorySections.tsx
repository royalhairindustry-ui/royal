import { Star } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import PriceTag from "./PriceTag";
import DiscountBadge from "./DiscountBadge";
import { cdnImage } from "@/lib/cdn-image";

async function getFeaturedCategories() {
  noStore();

  try {
    return await prisma.category.findMany({
      where: { isFeatured: true, featuredBanner: { not: null } },
      include: {
        products: {
          where: { status: "Active" },
          orderBy: { createdAt: "desc" },
          take: 12,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch featured categories:", error);
    return [];
  }
}

import { TextAnimation } from "./ScrollAnimation";

export default async function FeaturedCategorySections() {
  const categories = await getFeaturedCategories();

  if (categories.length === 0) return null;

  const bannerCategories = categories.filter(
    (c) => c.products.length > 0 && (c as any).featuredBanner,
  );

  return (
    <>
      {categories.map((category, i) => {
        if (category.products.length === 0) return null;

        // Alternate background for visual variety
        const isEven = i % 2 === 0;
        const bg = isEven ? "bg-[#f4f4f2]" : "bg-white";
        // const bannerBg = isEven ? "bg-[#1f1f1f]" : "bg-[#2c2c2c]";

        return (
          <section key={category.id} className={`w-full ${bg} px-5 py-12 md:px-7 md:py-24 xl:px-8`}>
            <div className="mx-auto max-w-full">
              {/* Section Header */}
              <div className="mb-10 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Category Collection
                  </p>
                  <TextAnimation 
                    text={category.name} 
                    className="text-[32px] font-black uppercase tracking-tight text-black md:text-[42px] leading-none"
                  />
                </div>
                <div className="hidden items-center gap-4 pt-2 md:flex">
                  <Link href="/products" className="text-[14px] font-bold uppercase tracking-widest text-black underline underline-offset-4 hover:opacity-60 transition">
                    View All
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:gap-4">
                {/* Product Cards — Scrollable */}
                <div className={`scrollbar-hide flex-1 snap-x snap-mandatory gap-2 overflow-x-auto pb-10 select-none md:gap-3 cursor-grab active:cursor-grabbing ${category.products.length > 5 ? "grid grid-rows-2 grid-flow-col auto-cols-max" : "flex"}`}>
                  {category.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="cursor-default snap-start shrink-0 basis-[240px] sm:basis-[420px] xl:basis-[480px] group"
                    >
                      <article>
                        {/* Image */}
                        <div className="relative h-[380px] sm:h-[580px] overflow-hidden bg-[#e8e5e0] transition-transform duration-500 group-hover:translate-y-[-2px] rounded-[2px]">
                          <DiscountBadge
                            priceInCents={product.priceInCents}
                            compareAtPriceInCents={product.compareAtPriceInCents}
                          />
                          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
                            <span className="bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black shadow-sm">
                              {category.name}
                            </span>
                          </div>

                          {product.image ? (
                            <>
                              <img
                                src={cdnImage(product.image)}
                                alt={product.name}
                                loading="lazy"
                                decoding="async"
                                className={`block h-[380px] sm:h-[580px] w-full bg-[#e8e5e0] object-contain transition-all duration-700 group-hover:scale-[1.05] ${(product as any).hoverImage ? 'group-hover:opacity-0' : 'opacity-100'}`}
                              />
                              {(product as any).hoverImage && (
                                <img
                                  src={cdnImage((product as any).hoverImage)}
                                  alt={`${product.name} hover`}
                                  loading="lazy"
                                  decoding="async"
                                  className="absolute inset-0 block h-[380px] sm:h-[580px] w-full bg-[#e8e5e0] object-contain transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-[1.05]"
                                />
                              )}
                            </>
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-[60px] font-black text-zinc-300 uppercase">
                                {product.name.charAt(0)}
                              </span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col pt-6 h-[180px]">
                          <div className="flex-1">
                            <h3 className="line-clamp-2 text-[14px] sm:text-[17px] font-semibold leading-[1.25] text-black group-hover:underline underline-offset-4 uppercase tracking-tight">
                              {product.name}
                            </h3>
                            <div className="mt-3 flex items-center gap-1 text-black">
                              <Star className="h-4 w-4 fill-black text-black" />
                              <Star className="h-4 w-4 fill-black text-black" />
                              <Star className="h-4 w-4 fill-black text-black" />
                              <Star className="h-4 w-4 fill-black text-black" />
                              <Star className="h-4 w-4 text-black" />
                            </div>
                          </div>
                          <PriceTag
                            priceInCents={product.priceInCents}
                            compareAtPriceInCents={product.compareAtPriceInCents}
                            className="mt-4 text-[20px] font-black tracking-tight text-black"
                          />
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative mt-2 h-[3px] w-full overflow-hidden bg-black/10">
                <div className="absolute left-0 top-0 h-full w-[40%] bg-black" />
              </div>
            </div>
          </section>
        );
      })}

      {bannerCategories.length > 0 && (
        <section className="w-full bg-white px-0 py-0">
          <div
            className={`grid gap-0 ${
              bannerCategories.length === 1
                ? "grid-cols-1"
                : bannerCategories.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {bannerCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group relative block w-full overflow-hidden"
                >
                  <img
                    src={(category as any).featuredBanner}
                    alt={`${category.name} banner`}
                    className="block h-[220px] w-full object-contain transition-transform duration-700 group-hover:scale-[1.03] sm:h-[280px] md:h-[340px] lg:h-[400px]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-6 pb-6 text-white md:px-10 md:pb-10">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
                      Featured Collection
                    </p>
                    <h3 className="text-[26px] font-black uppercase leading-tight tracking-tight md:text-[36px]">
                      {category.name}
                    </h3>
                    <span className="mt-2 inline-block w-fit text-[12px] font-bold uppercase tracking-widest underline underline-offset-4 group-hover:opacity-80">
                      Shop Now →
                    </span>
                  </div>
                </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
