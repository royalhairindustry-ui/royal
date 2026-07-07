"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import PriceTag from "./PriceTag";
import DiscountBadge from "./DiscountBadge";

interface Product {
  id: number;
  slug: string;
  name: string;
  priceInCents: number;
  compareAtPriceInCents?: number | null;
  unit: string;
  image: string | null;
  hoverImage?: string | null;
  category?: { name: string } | null;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="group relative flex flex-col"
    >
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-[4/5] overflow-hidden rounded-none bg-zinc-100"
      >
        <DiscountBadge
          priceInCents={product.priceInCents}
          compareAtPriceInCents={product.compareAtPriceInCents}
        />
        <div className="absolute left-4 top-4 z-10">
          <span className="bg-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg">
            Latest
          </span>
        </div>

        {product.image ? (
          <>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`absolute inset-0 h-full w-full object-contain transition-transform duration-1000 group-hover:scale-105 ${product.hoverImage ? "group-hover:opacity-0" : "opacity-100"}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {product.hoverImage && (
              <Image
                src={product.hoverImage}
                alt={`${product.name} hover`}
                fill
                className="absolute inset-0 h-full w-full object-contain opacity-0 transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-100"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[40px] font-black text-zinc-300">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>

      <div className="mt-3 flex flex-col items-center text-center md:mt-6">
        {product.category?.name && (
          <p className="mb-2 text-[10px] md:text-[12px] font-medium uppercase tracking-[0.2em] text-zinc-500 italic">
            {product.category.name}
          </p>
        )}
        <h3 className="flex-1 line-clamp-2 text-[14px] md:text-[18px] font-bold uppercase tracking-tight text-black">
          <Link
            href={`/products/${product.slug}`}
            className="hover:underline underline-offset-4"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex items-center gap-0.5 text-black">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-black text-black" />
          ))}
        </div>

        <PriceTag
          priceInCents={product.priceInCents}
          compareAtPriceInCents={product.compareAtPriceInCents}
          className="mt-2 text-[15px] md:mt-4 md:text-[20px] font-black tracking-tighter text-black"
        />

        <Link
          href={`/products/${product.slug}`}
          className="mt-3 inline-flex h-9 items-center justify-center border border-black px-4 text-[11px] md:mt-6 md:h-11 md:px-8 md:text-[12px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-black hover:text-white"
        >
          View Product
        </Link>
      </div>
    </motion.article>
  );
}

export default function LatestProductsSectionClient({ products }: { products: Product[] }) {
  return (
    <section className="w-full bg-white px-5 py-24 md:px-7 md:py-32 xl:px-8">
      <div className="mx-auto max-w-full">
        <div className="mb-16 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 border-y border-zinc-200 py-2 px-6"
          >
            <span className="text-[14px] font-bold uppercase tracking-[0.4em] text-zinc-400">
              Fresh Arrivals
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[42px] font-black uppercase tracking-tight text-black md:text-[56px] lg:text-[72px] leading-tight"
          >
            Latest Products
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-[600px] text-[18px] text-zinc-500"
          >
            Fresh arrivals from the newest drops in the Royal Braids catalog.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3 lg:gap-12 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <Link href="/products" className="group flex flex-col items-center gap-2">
            <span className="text-[14px] font-bold uppercase tracking-[0.3em] text-black">
              View All Products
            </span>
            <div className="h-[2px] w-12 bg-black transition-all group-hover:w-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}
