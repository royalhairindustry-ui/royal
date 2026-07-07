"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import {
  PRODUCT_HISTORY_EVENT,
  readProductHistory,
} from "@/lib/browser-history";

type RecentlyViewedItem = {
  id: number;
  slug: string;
  image: string | null;
  title: string;
  shades?: string;
  price: string;
  tag1?: string;
  tag2?: string;
};

type RecentlyViewedProps = {
  currentProductId: number;
  items: RecentlyViewedItem[];
};

export default function RecentlyViewed({
  currentProductId,
  items,
}: RecentlyViewedProps) {
  const [historyIds, setHistoryIds] = useState<number[]>([]);

  useEffect(() => {
    const syncHistory = () => {
      const ids = readProductHistory().map((entry) => entry.productId);
      setHistoryIds(ids);
    };

    syncHistory();
    window.addEventListener(PRODUCT_HISTORY_EVENT, syncHistory);
    window.addEventListener("storage", syncHistory);

    return () => {
      window.removeEventListener(PRODUCT_HISTORY_EVENT, syncHistory);
      window.removeEventListener("storage", syncHistory);
    };
  }, [currentProductId]);

  const displayItems = useMemo(() => {
    const filteredItems = items.filter((item) => item.id !== currentProductId);
    if (filteredItems.length === 0) return [];

    if (historyIds.length === 0) {
      return filteredItems.slice(0, 4);
    }

    const sorted = [...filteredItems].sort((a, b) => {
      const aIndex = historyIds.indexOf(a.id);
      const bIndex = historyIds.indexOf(b.id);
      const normalizedA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
      const normalizedB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
      return normalizedA - normalizedB;
    });

    return sorted.slice(0, 4);
  }, [currentProductId, historyIds, items]);

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f3f3f1] px-8 py-16">
      <div className="max-w-[1440px]">
        <h2 className="mb-8 text-[52px] font-black tracking-[-0.03em] text-black">
          Recently Viewed
        </h2>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {displayItems.map((item) => (
            <article key={item.id} className="w-full max-w-[400px]">
              <Link href={`/products/${item.slug}`} className="block">
                <div className="relative overflow-hidden bg-[#ebe9e3]">
                  <div className="absolute left-1 top-3 z-10 flex gap-1">
                    {item.tag1 && (
                      <span className="bg-white px-3 py-1 text-[12px] font-medium uppercase text-black">
                        {item.tag1}
                      </span>
                    )}
                    {item.tag2 && (
                      <span className="bg-white px-3 py-1 text-[12px] font-medium uppercase text-black">
                        {item.tag2}
                      </span>
                    )}
                  </div>

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-[560px] w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-[560px] w-full items-center justify-center text-[64px] font-black text-zinc-300">
                      {item.title.charAt(0)}
                    </div>
                  )}
                </div>
              </Link>

              <div className="pt-5">
                <h3 className="text-[20px] font-semibold leading-[1.25] text-black">
                  {item.title}
                </h3>

                {item.shades && (
                  <Link
                    href={`/products/${item.slug}`}
                    className="mt-2 inline-block text-[18px] text-black underline underline-offset-2"
                  >
                    {item.shades}
                  </Link>
                )}

                <div className="mt-3 flex items-center gap-1 text-black">
                  <Star className="h-4 w-4 fill-black text-black" />
                  <Star className="h-4 w-4 fill-black text-black" />
                  <Star className="h-4 w-4 fill-black text-black" />
                  <Star className="h-4 w-4 fill-black text-black" />
                  <Star className="h-4 w-4 text-black" />
                </div>

                <p className="mt-3 text-[20px] font-semibold text-black">
                  {item.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
