"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { TextAnimation } from "./ScrollAnimation";
import PriceTag from "./PriceTag";
import DiscountBadge from "./DiscountBadge";
import { cdnImage } from "@/lib/cdn-image";

interface MoodProduct {
  id: number;
  slug: string;
  name: string;
  priceInCents: number;
  compareAtPriceInCents?: number | null;
  image: string | null;
  hoverImage?: string | null;
  category?: { name: string } | null;
}

function ProductCard({ product }: { product: MoodProduct }) {
  return (
    <article className="group snap-start shrink-0 basis-[240px] sm:basis-[420px] xl:basis-[480px]">
      <div
        className={`relative h-[380px] sm:h-[580px] overflow-hidden bg-[#e8e5e0] transition-transform duration-500 group-hover:translate-y-[-2px] rounded-[2px]`}
      >
        <DiscountBadge
          priceInCents={product.priceInCents}
          compareAtPriceInCents={product.compareAtPriceInCents}
        />
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          <span className="bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black shadow-sm">
            MUST-HAVE
          </span>
          {product.category?.name && (
            <span className="bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black shadow-sm">
              {product.category.name}
            </span>
          )}
        </div>

        {product.image ? (
          <>
            <img
              src={cdnImage(product.image)}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className={`block h-[320px] sm:h-[480px] w-full object-contain transition-all duration-700 group-hover:scale-[1.05] ${product.hoverImage ? 'group-hover:opacity-0' : 'opacity-100'}`}
            />
            {product.hoverImage && (
              <img
                src={cdnImage(product.hoverImage)}
                alt={`${product.name} hover`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 block h-[320px] sm:h-[480px] w-full object-contain transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-[1.05]"
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

      <div className="flex flex-col pt-6 h-[200px]">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-[14px] sm:text-[18px] font-semibold leading-[1.25] text-black group-hover:underline underline-offset-4 uppercase tracking-tight">
            {product.name}
          </h3>

          <div className="h-6">
            {product.category?.name && (
              <p className="mt-2 text-[14px] font-medium text-zinc-500 italic">
                {product.category.name}
              </p>
            )}
          </div>

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
  );
}

export default function MoodProductsSectionClient({ products, bannerImage }: { products: MoodProduct[], bannerImage: string }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const dragState = useRef({
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const scrollAmount = useMemo(() => 420, []);

  const updateProgress = () => {
    const el = scrollRef.current;
    if (!el || el.scrollWidth === 0) return;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (maxScroll <= 0) {
      setProgress(100);
      return;
    }

    const progressPct = (el.scrollLeft / maxScroll) * 100;
    setProgress(Math.min(100, Math.max(0, progressPct)));
  };

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    setIsDragging(true);
    dragState.current.startX = e.pageX - el.offsetLeft;
    dragState.current.scrollLeft = el.scrollLeft;
    dragState.current.moved = false;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragging) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;

    if (Math.abs(walk) > 4) {
      dragState.current.moved = true;
    }

    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const el = scrollRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      updateProgress();
    }, 100);

    const onScroll = () => updateProgress();
    const onResize = () => updateProgress();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isMounted]);

  if (!isMounted) {
    return <section className="w-full bg-[#f4f4f2] h-[600px]" />;
  }

  return (
    <section className="w-full bg-[#f4f4f2] px-5 py-12 md:px-7 md:py-24 xl:px-8">
      <div className="mx-auto max-w-full">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <TextAnimation 
              text="Must-Haves For Every Mood"
              className="text-[32px] font-black uppercase tracking-tight text-black md:text-[42px] leading-none"
            />
            <p className="mt-3 text-[18px] text-zinc-600">
              New braiding arrivals + fam faves for every style.
            </p>
          </div>

          <div className="hidden items-center gap-4 pt-2 md:flex">
            <button
              onClick={() => scrollByAmount("left")}
              className="text-black transition hover:opacity-60"
              aria-label="Scroll left"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollByAmount("right")}
              className="text-black transition hover:opacity-60"
              aria-label="Scroll right"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:gap-4">
          {/* Product Cards - Scrollable */}
          <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseLeave={stopDragging}
            onMouseUp={stopDragging}
            className={`scrollbar-hide flex-1 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-10 select-none md:gap-3 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {products.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="cursor-default"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </div>

        {/* progress bar */}
        <div className="relative mt-2 h-[3px] w-full overflow-hidden bg-black/10">
          <div
            className="absolute left-0 top-0 h-full bg-black transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
