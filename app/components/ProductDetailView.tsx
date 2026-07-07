"use client";

import { useMemo, useState } from "react";
import {
  Heart,
  Minus,
  Plus,
  Star,
  Scissors,
  Sparkles,
  ShieldCheck,
  Camera,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { getDiscount, getProductUnitOptions } from "@/lib/product-unit-options";
import { cdnImage } from "@/lib/cdn-image";

type ProductDetailViewProps = {
  product: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    priceInCents: number;
    compareAtPriceInCents?: number | null;
    stock: number;
    unit: string;
    status: string;
    category: { name: string; slug: string };
    colors: Array<{ id: number; name: string; hex: string }>;
    unitOptions?: Array<{
      id: number;
      label: string;
      unit: string;
      priceInCents: number;
      compareAtPriceInCents?: number | null;
      stock: number;
      sortOrder: number;
    }>;
    variations: Array<{ id: number; type: string; value: string }>;
  };
};

export default function ProductDetailView({
  product,
}: ProductDetailViewProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const gallery = useMemo(() => {
    const images = product.image ? [product.image] : [];
    return images.length > 0 ? images : ["/auth-bg.png"];
  }, [product.image]);
  const unitOptions = useMemo(() => getProductUnitOptions(product), [product]);

  const [selectedImage, setSelectedImage] = useState(gallery[0]);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0] || null
  );
  const [selectedUnitLabel, setSelectedUnitLabel] = useState(unitOptions[0]?.label);

  const selectedUnitOption =
    unitOptions.find((option) => option.label === selectedUnitLabel) || unitOptions[0];

  const decreaseQty = () => setQty((prev) => Math.max(1, prev - 1));
  const increaseQty = () =>
    setQty((prev) => Math.min(selectedUnitOption?.stock || prev + 1, prev + 1));

  const handleUnitChange = (label: string) => {
    setSelectedUnitLabel(label);
    setQty(1);
  };

  const handleAddToCart = () => {
    if (!selectedUnitOption || selectedUnitOption.stock === 0) {
      return;
    }

    for (let index = 0; index < qty; index += 1) {
      addToCart({
        cartKey: `${product.id}:${selectedUnitOption.label}`,
        id: product.id,
        name: product.name,
        unitLabel: selectedUnitOption.label,
        price: selectedUnitOption.priceInCents,
        image: product.image,
      });
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: selectedUnitOption.priceInCents,
      unitLabel: selectedUnitOption.label,
    });
  };

  const variationLabel =
    product.variations.length > 0
      ? `${product.variations[0].type}: ${product.variations[0].value}`
      : "Standard option";

  return (
    <section className="min-h-screen bg-white px-4 py-8 md:px-8 xl:px-12">
      <div className="mx-auto max-w-[1320px]">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2 text-[14px] font-medium text-black/60 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Link>

        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[760px_minmax(420px,1fr)]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_minmax(0,1fr)]">
            <div className="hidden flex-col gap-2 md:flex">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square overflow-hidden border transition ${
                    selectedImage === image
                      ? "border-black"
                      : "border-black/20 hover:border-black/50"
                  }`}
                >
                  <img
                    src={cdnImage(image, 240)}
                    alt={`${product.name} view ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="cursor-default overflow-hidden rounded-[2px] bg-white">
              <img
                src={cdnImage(selectedImage, 1000)}
                alt={product.name}
                className="h-full min-h-[500px] w-full object-cover md:min-h-[720px]"
              />
            </div>

            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 md:hidden">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square w-20 shrink-0 overflow-hidden border transition ${
                    selectedImage === image
                      ? "border-black"
                      : "border-black/20"
                  }`}
                >
                  <img
                    src={cdnImage(image, 240)}
                    alt={`${product.name} view ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <div className="mb-5 text-[13px] text-black/70">
              Home / {product.category.name} / {product.name}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <span className="bg-[#f3e1d7] px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-black">
                {product.status}
              </span>
              <span className="bg-[#f3e1d7] px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-black">
                {product.category.name}
              </span>
            </div>

            <div className="mb-4 flex items-start justify-between gap-4">
              <h1 className="max-w-[520px] text-[34px] font-black uppercase leading-[1.1] tracking-[0.06em] text-black">
                {product.name}
              </h1>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition ${
                  isWishlisted(product.id)
                    ? "border-black bg-black text-white"
                    : "border-black/20 text-black hover:border-black"
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted(product.id) ? "fill-white" : ""}`} />
              </button>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-[24px] font-black text-black">
                UGX {selectedUnitOption.priceInCents.toLocaleString()}
              </span>
              {(() => {
                const discount = getDiscount(selectedUnitOption);
                if (!discount) return null;
                return (
                  <>
                    <span className="text-[16px] font-medium text-zinc-400 line-through">
                      UGX {discount.compareAtPriceInCents.toLocaleString()}
                    </span>
                    <span className="bg-red-600 px-2 py-1 text-[12px] font-bold text-white">
                      -{discount.percentOff}%
                    </span>
                  </>
                );
              })()}
            </div>

            <div className="mb-5 flex items-center gap-3">
              <div className="flex items-center gap-1 text-black">
                <Star className="h-4 w-4 fill-black text-black" />
                <Star className="h-4 w-4 fill-black text-black" />
                <Star className="h-4 w-4 fill-black text-black" />
                <Star className="h-4 w-4 fill-black text-black" />
                <Star className="h-4 w-4 text-black" />
              </div>
              <span className="text-[15px] font-medium underline underline-offset-2">
                Product details
              </span>
            </div>

            <p className="mb-8 max-w-[620px] text-[17px] leading-[1.5] text-zinc-700">
              {product.description || "No product description has been added yet."}
            </p>

            <div className="mb-10 grid grid-cols-2 gap-6 text-black md:grid-cols-4">
              <div className="flex items-center gap-3">
                <Scissors className="h-8 w-8 stroke-[1.2]" />
                <span className="text-[14px] font-medium leading-[1.2]">
                  Easy
                  <br />
                  styling
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 stroke-[1.2]" />
                <span className="text-[14px] font-medium leading-[1.2]">
                  Premium
                  <br />
                  finish
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 stroke-[1.2]" />
                <span className="text-[14px] font-medium leading-[1.2]">
                  Stock
                  <br />
                  {selectedUnitOption.stock > 0
                    ? `${selectedUnitOption.stock} available`
                    : "Out of stock"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Camera className="h-8 w-8 stroke-[1.2]" />
                <span className="text-[14px] font-medium leading-[1.2]">
                  Category
                  <br />
                  {product.category.name}
                </span>
              </div>
            </div>

            {product.colors.length > 0 && (
              <>
                <div className="mb-8 grid grid-cols-7 gap-2 md:grid-cols-10">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className={`relative h-12 w-full border transition ${
                        selectedColor?.id === color.id
                          ? "z-10 scale-105 border-black ring-1 ring-black"
                          : "border-black/10 hover:border-black/40"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor?.id === color.id && (
                        <span className="absolute -right-1 -top-1 bg-black px-1 text-[8px] font-bold uppercase text-white shadow-sm">
                          Selected
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-[13px] font-bold uppercase tracking-wider text-black">
                    Color selected: {selectedColor?.name}
                  </label>
                  <div className="flex items-center gap-3 rounded-[2px] border border-black/15 bg-white px-4 py-3">
                    <span
                      className="h-8 w-8 rounded-full border border-black/10"
                      style={{ backgroundColor: selectedColor?.hex }}
                    />
                    <select
                      className="w-full bg-transparent text-[16px] font-medium text-black outline-none"
                      value={selectedColor?.id}
                      onChange={(e) => {
                        const nextColor = product.colors.find(
                          (color) => color.id === Number(e.target.value)
                        );
                        if (nextColor) setSelectedColor(nextColor);
                      }}
                    >
                      {product.colors.map((color) => (
                        <option key={color.id} value={color.id}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {product.variations.length > 0 && (
              <div className="mb-8 rounded-[2px] border border-black/10 bg-zinc-50 px-4 py-4">
                <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-500">
                  Variation
                </p>
                <p className="mt-2 text-[16px] font-medium text-black">
                  {variationLabel}
                </p>
                {product.variations.length > 1 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.variations.slice(1).map((variation) => (
                      <span
                        key={variation.id}
                        className="rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] text-zinc-700"
                      >
                        {variation.type}: {variation.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {unitOptions.length > 0 && (
              <div className="mb-8">
                <label className="mb-3 block text-[13px] font-bold uppercase tracking-wider text-black">
                  Choose Unit
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {unitOptions.map((option) => {
                    const isActive = selectedUnitOption.label === option.label;

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => handleUnitChange(option.label)}
                        className={`rounded-[2px] border px-4 py-4 text-left transition ${
                          isActive
                            ? "border-black bg-black text-white"
                            : "border-black/10 bg-white text-black hover:border-black/30"
                        }`}
                      >
                        <p className="text-[14px] font-bold uppercase tracking-wide">
                          {option.label}
                        </p>
                        <p className={`mt-2 text-[20px] font-black ${isActive ? "text-white" : "text-black"}`}>
                          UGX {option.priceInCents.toLocaleString()}
                          {(() => {
                            const discount = getDiscount(option);
                            if (!discount) return null;
                            return (
                              <span className={`ml-2 text-[13px] font-medium line-through ${isActive ? "text-white/60" : "text-zinc-400"}`}>
                                {discount.compareAtPriceInCents.toLocaleString()}
                              </span>
                            );
                          })()}
                        </p>
                        <p className={`mt-1 text-[12px] uppercase tracking-wide ${isActive ? "text-white/80" : "text-zinc-500"}`}>
                          {option.stock > 0 ? `${option.stock} in stock` : "Out of stock"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button className="mb-8 flex w-full items-center justify-center gap-3 rounded-[2px] border border-black/15 bg-white px-4 py-4 text-[15px] font-bold uppercase tracking-widest text-black transition hover:border-black/30 hover:bg-zinc-50">
              <Camera className="h-5 w-5" />
              Try This Style On
            </button>

            <div className="flex w-full overflow-hidden rounded-[2px] border border-black shadow-sm">
              <div className="flex min-w-[150px] items-center justify-between bg-white px-6">
                <button
                  onClick={decreaseQty}
                  className="p-2 transition hover:opacity-50"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="text-[18px] font-bold text-black">{qty}</span>

                <button
                  onClick={increaseQty}
                  className="p-2 transition hover:opacity-50"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={selectedUnitOption.stock === 0}
                className="flex-1 bg-black px-8 py-5 text-[15px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {selectedUnitOption.stock === 0 ? "Out of Stock" : `Add ${selectedUnitOption.label} to Cart`}
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4 rounded-[2px] border border-black/5 bg-white p-4 text-black shadow-sm">
              <ShieldCheck className="h-6 w-6 text-green-600" />
              <div className="text-[14px]">
                <p className="font-bold">Authentic Quality Guaranteed</p>
                <p className="text-zinc-500">Live product data from Royal Braids inventory.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
