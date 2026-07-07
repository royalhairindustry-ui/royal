"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Star, X } from "lucide-react";

type CategoryOption = { slug: string; name: string };
type ColorOption = { hex: string; name: string };
type VariationGroup = { type: string; values: string[] };

type ProductsFilterSidebarProps = {
  categories: CategoryOption[];
  colors: ColorOption[];
  variationGroups: VariationGroup[];
  priceBounds: { min: number; max: number };
  resultCount: number;
};

const RATING_OPTIONS = [4, 3, 2];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Rating: High to Low" },
];

function toggleInList(current: string[], value: string) {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

export default function ProductsFilterSidebar({
  categories,
  colors,
  variationGroups,
  priceBounds,
  resultCount,
}: ProductsFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedCategories = searchParams.get("category")?.split(",").filter(Boolean) ?? [];
  const selectedColors = searchParams.get("color")?.split(",").filter(Boolean) ?? [];
  const selectedVariations = searchParams.get("variation")?.split(",").filter(Boolean) ?? [];
  const minRating = searchParams.get("minRating");
  const inStockOnly = searchParams.get("inStock") === "1";
  const sort = searchParams.get("sort") ?? "newest";
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  const [priceInputs, setPriceInputs] = useState({
    min: minPriceParam ?? String(priceBounds.min),
    max: maxPriceParam ?? String(priceBounds.max),
  });

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleCategoryToggle(slug: string) {
    updateParams((params) => {
      const next = toggleInList(selectedCategories, slug);
      next.length ? params.set("category", next.join(",")) : params.delete("category");
    });
  }

  function handleColorToggle(hex: string) {
    updateParams((params) => {
      const next = toggleInList(selectedColors, hex);
      next.length ? params.set("color", next.join(",")) : params.delete("color");
    });
  }

  function handleVariationToggle(type: string, value: string) {
    const key = `${type}:${value}`;
    updateParams((params) => {
      const next = toggleInList(selectedVariations, key);
      next.length ? params.set("variation", next.join(",")) : params.delete("variation");
    });
  }

  function handleRatingSelect(rating: number) {
    updateParams((params) => {
      minRating === String(rating) ? params.delete("minRating") : params.set("minRating", String(rating));
    });
  }

  function handleInStockToggle() {
    updateParams((params) => {
      inStockOnly ? params.delete("inStock") : params.set("inStock", "1");
    });
  }

  function handleSortChange(value: string) {
    updateParams((params) => {
      value === "newest" ? params.delete("sort") : params.set("sort", value);
    });
  }

  function handlePriceApply() {
    updateParams((params) => {
      const min = Number(priceInputs.min);
      const max = Number(priceInputs.max);
      if (!Number.isNaN(min) && min > priceBounds.min) params.set("minPrice", String(min));
      else params.delete("minPrice");
      if (!Number.isNaN(max) && max < priceBounds.max) params.set("maxPrice", String(max));
      else params.delete("maxPrice");
    });
  }

  function handleClearAll() {
    router.push(pathname, { scroll: false });
    setPriceInputs({ min: String(priceBounds.min), max: String(priceBounds.max) });
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedVariations.length > 0 ||
    !!minRating ||
    inStockOnly ||
    !!minPriceParam ||
    !!maxPriceParam;

  const body = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-black">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-[12px] font-bold uppercase tracking-wider text-zinc-400 transition hover:text-black"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <div>
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-400">Sort by</p>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full border border-zinc-200 bg-white px-3 py-2.5 text-[14px] font-medium text-black outline-none focus:border-black"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-400">Category</p>
          <div className="space-y-2.5">
            {categories.map((cat) => (
              <label key={cat.slug} className="flex cursor-pointer items-center gap-2.5 text-[14px] text-black">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => handleCategoryToggle(cat.slug)}
                  className="h-4 w-4 accent-black"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-400">
          Price (UGX)
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceInputs.min}
            onChange={(e) => setPriceInputs((prev) => ({ ...prev, min: e.target.value }))}
            className="w-full border border-zinc-200 bg-white px-2.5 py-2 text-[13px] outline-none focus:border-black"
            placeholder="Min"
          />
          <span className="text-zinc-300">–</span>
          <input
            type="number"
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceInputs.max}
            onChange={(e) => setPriceInputs((prev) => ({ ...prev, max: e.target.value }))}
            className="w-full border border-zinc-200 bg-white px-2.5 py-2 text-[13px] outline-none focus:border-black"
            placeholder="Max"
          />
        </div>
        <button
          onClick={handlePriceApply}
          className="mt-2.5 w-full bg-black py-2 text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800"
        >
          Apply
        </button>
      </div>

      {/* Rating */}
      <div>
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-400">Rating</p>
        <div className="space-y-2.5">
          {RATING_OPTIONS.map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingSelect(rating)}
              className={`flex w-full items-center gap-1.5 text-[14px] transition ${
                minRating === String(rating) ? "font-bold text-black" : "text-zinc-600 hover:text-black"
              }`}
            >
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-zinc-300"
                    }`}
                  />
                ))}
              </span>
              & up
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      {colors.length > 0 && (
        <div>
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-400">Color</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.hex}
                onClick={() => handleColorToggle(color.hex)}
                title={color.name}
                style={{ backgroundColor: color.hex }}
                className={`h-8 w-8 rounded-full border-2 transition ${
                  selectedColors.includes(color.hex)
                    ? "border-black ring-2 ring-black ring-offset-2"
                    : "border-zinc-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Variations (length, texture, etc.) */}
      {variationGroups.map((group) => (
        <div key={group.type}>
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            {group.type}
          </p>
          <div className="space-y-2.5">
            {group.values.map((value) => (
              <label key={value} className="flex cursor-pointer items-center gap-2.5 text-[14px] text-black">
                <input
                  type="checkbox"
                  checked={selectedVariations.includes(`${group.type}:${value}`)}
                  onChange={() => handleVariationToggle(group.type, value)}
                  className="h-4 w-4 accent-black"
                />
                {value}
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* In stock */}
      <div>
        <label className="flex cursor-pointer items-center gap-2.5 text-[14px] font-medium text-black">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={handleInStockToggle}
            className="h-4 w-4 accent-black"
          />
          In stock only
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 border border-zinc-200 px-4 py-2.5 text-[13px] font-bold uppercase tracking-wider text-black"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
        </button>
        <span className="text-[13px] text-zinc-500">{resultCount} results</span>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-[340px] overflow-y-auto bg-white px-5 py-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-black">Filters</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5 text-black" />
              </button>
            </div>
            {body}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="mb-4 text-[13px] text-zinc-500">{resultCount} results</div>
        {body}
      </aside>
    </>
  );
}
