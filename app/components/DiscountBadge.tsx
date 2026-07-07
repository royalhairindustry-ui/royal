import { getDiscount } from "@/lib/product-unit-options";

type DiscountBadgeProps = {
  priceInCents: number;
  compareAtPriceInCents?: number | null;
};

// Percent-off badge pinned to the top-right of a product card image.
// Renders nothing when the product has no active discount.
export default function DiscountBadge({
  priceInCents,
  compareAtPriceInCents,
}: DiscountBadgeProps) {
  const discount = getDiscount({ priceInCents, compareAtPriceInCents });

  if (!discount) return null;

  return (
    <span className="absolute right-3 top-3 z-10 bg-red-600 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
      -{discount.percentOff}%
    </span>
  );
}
