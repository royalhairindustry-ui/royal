import { getDiscount } from "@/lib/product-unit-options";

type PriceTagProps = {
  priceInCents: number;
  compareAtPriceInCents?: number | null;
  className?: string;
};

export default function PriceTag({
  priceInCents,
  compareAtPriceInCents,
  className,
}: PriceTagProps) {
  const discount = getDiscount({ priceInCents, compareAtPriceInCents });

  return (
    <p className={className}>
      UGX {priceInCents.toLocaleString()}
      {discount && (
        <span className="ml-2 text-[14px] font-medium text-zinc-400 line-through">
          UGX {discount.compareAtPriceInCents.toLocaleString()}
        </span>
      )}
    </p>
  );
}
