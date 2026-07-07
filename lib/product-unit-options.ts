export type ProductUnitOptionLike = {
  id?: number;
  label: string;
  unit: string;
  priceInCents: number;
  compareAtPriceInCents?: number | null;
  stock: number;
  sortOrder?: number;
};

type ProductWithUnitOptions = {
  priceInCents: number;
  compareAtPriceInCents?: number | null;
  stock: number;
  unit: string;
  unitOptions?: ProductUnitOptionLike[] | null;
};

export function getFallbackUnitOption(product: ProductWithUnitOptions): ProductUnitOptionLike {
  const fallbackLabel = product.unit?.trim() || "Default";

  return {
    label: fallbackLabel,
    unit: fallbackLabel,
    priceInCents: product.priceInCents,
    compareAtPriceInCents: product.compareAtPriceInCents ?? null,
    stock: product.stock,
    sortOrder: 0,
  };
}

// A compare-at price only counts as a discount when it is strictly above the selling price.
export function getDiscount(option: {
  priceInCents: number;
  compareAtPriceInCents?: number | null;
}) {
  const compareAt = option.compareAtPriceInCents ?? 0;

  if (compareAt <= option.priceInCents) {
    return null;
  }

  return {
    compareAtPriceInCents: compareAt,
    percentOff: Math.round(((compareAt - option.priceInCents) / compareAt) * 100),
  };
}

export function getProductUnitOptions(product: ProductWithUnitOptions): ProductUnitOptionLike[] {
  if (product.unitOptions && product.unitOptions.length > 0) {
    return [...product.unitOptions].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  return [getFallbackUnitOption(product)];
}

export function getPrimaryUnitOption(product: ProductWithUnitOptions): ProductUnitOptionLike {
  return getProductUnitOptions(product)[0];
}
