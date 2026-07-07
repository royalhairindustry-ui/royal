"use client";

import { useEffect } from "react";
import { recordProductHistory } from "@/lib/browser-history";

type ProductHistoryTrackerProps = {
  productId: number;
  slug: string;
};

export default function ProductHistoryTracker({
  productId,
  slug,
}: ProductHistoryTrackerProps) {
  useEffect(() => {
    recordProductHistory({
      productId,
      slug,
      pathname: `/products/${slug}`,
    });
  }, [productId, slug]);

  return null;
}
