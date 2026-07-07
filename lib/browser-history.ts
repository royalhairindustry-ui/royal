"use client";

export const PRODUCT_HISTORY_STORAGE_KEY = "product_browser_history_v1";
export const PRODUCT_HISTORY_EVENT = "product-browser-history-updated";
const MAX_HISTORY_ITEMS = 20;

export type ProductHistoryEntry = {
  productId: number;
  slug: string;
  pathname: string;
  viewedAt: string;
};

function isProductHistoryEntry(value: unknown): value is ProductHistoryEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.productId === "number" &&
    typeof candidate.slug === "string" &&
    typeof candidate.pathname === "string" &&
    typeof candidate.viewedAt === "string"
  );
}

export function readProductHistory(): ProductHistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(PRODUCT_HISTORY_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isProductHistoryEntry);
  } catch {
    return [];
  }
}

export function recordProductHistory(
  entry: Omit<ProductHistoryEntry, "viewedAt">,
): ProductHistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  const nextHistory = [
    {
      ...entry,
      viewedAt: new Date().toISOString(),
    },
    ...readProductHistory().filter(
      (item) => item.productId !== entry.productId,
    ),
  ].slice(0, MAX_HISTORY_ITEMS);

  window.localStorage.setItem(
    PRODUCT_HISTORY_STORAGE_KEY,
    JSON.stringify(nextHistory),
  );
  window.dispatchEvent(new CustomEvent(PRODUCT_HISTORY_EVENT));

  return nextHistory;
}
