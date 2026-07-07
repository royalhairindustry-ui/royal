"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  Upload,
  Plus,
  X,
  Check,
  Settings2,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions";
import { Switch } from "@/components/ui/interfaces-switch";

type ProductColor = {
  id?: number;
  name: string;
  hex: string;
  code?: string | null;
};

const fallbackColors: ProductColor[] = [
  { name: "Jet Black", hex: "#000000", code: "1" },
  { name: "Dark Brown", hex: "#3D2B1F", code: "2" },
  { name: "Auburn", hex: "#722620", code: "33" },
  { name: "Honey Blonde", hex: "#D4AF37", code: "27" },
  { name: "Platinum", hex: "#E5E4E2", code: "613" },
  { name: "Copper", hex: "#B87333", code: "350" },
];

function normalizeHex(hex: string) {
  return hex.trim().toUpperCase();
}

function getReadableTextColor(hex: string) {
  const value = hex.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 160 ? "text-black" : "text-white";
}

function buildColorName(hex: string) {
  return `Custom ${normalizeHex(hex)}`;
}

function mergeColors(colors: ProductColor[]) {
  const colorMap = new Map<string, ProductColor>();

  colors.forEach((color) => {
    colorMap.set(normalizeHex(color.hex), {
      ...color,
      hex: normalizeHex(color.hex),
    });
  });

  return Array.from(colorMap.values());
}

type ProductFormData = {
  id?: number;
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  unit: string;
  unitOptions: Array<{
    id: number;
    label: string;
    unit: string;
    price: string;
    discountType?: "none" | "percent" | "fixed";
    discountValue?: string;
    stock: string;
  }>;
  isFeatured?: boolean;
  status?: string;
  variations: Array<{ id: number; name: string; value: string }>;
  selectedColors: ProductColor[];
  imageUrl: string;
  hoverImageUrl?: string;
};

type ProductEditorFormProps = {
  mode: "create" | "edit";
  initialData?: ProductFormData;
  units?: Array<{ id: number; name: string }>;
  categories?: Array<{ id: number; name: string }>;
  availableColors?: ProductColor[];
  fullWidth?: boolean;
};

const defaultProduct: ProductFormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "Braids",
  unit: "Piece",
  unitOptions: [{ id: 1, label: "1 pc", unit: "Piece", price: "", discountType: "none" as const, discountValue: "", stock: "" }],
  isFeatured: false,
  status: "Active",
  variations: [{ id: 1, name: "Length", value: "24 inch" }],
  selectedColors: [fallbackColors[0]],
  imageUrl: "",
  hoverImageUrl: "",
};

export default function ProductEditorForm({
  mode,
  initialData,
  units = [],
  categories = [],
  availableColors = [],
  fullWidth = false,
}: ProductEditorFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const product = initialData || defaultProduct;
  const paletteColors = useMemo(
    () => mergeColors([...fallbackColors, ...availableColors, ...product.selectedColors]),
    [availableColors, product.selectedColors]
  );

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [category, setCategory] = useState(product.category);
  const [unit, setUnit] = useState(product.unit);
  const [unitOptions, setUnitOptions] = useState(
    product.unitOptions.length > 0
      ? product.unitOptions
      : [{ id: 1, label: "1 pc", unit: "Piece", price: "", discountType: "none" as const, discountValue: "", stock: "" }]
  );
  const [isFeatured, setIsFeatured] = useState(Boolean(product.isFeatured));
  const [status, setStatus] = useState(product.status || "Active");
  const [variations, setVariations] = useState(product.variations);
  const [selectedColors, setSelectedColors] = useState<ProductColor[]>(
    product.selectedColors
  );
  const [customColorHex, setCustomColorHex] = useState("#C08457");
  const [customColorName, setCustomColorName] = useState("");
  const [customColorCode, setCustomColorCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [hoverImageUrl, setHoverImageUrl] = useState(product.hoverImageUrl || "");
  const [imageName, setImageName] = useState("");
  const [hoverImageName, setHoverImageName] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const hoverFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingHoverImage, setIsUploadingHoverImage] = useState(false);

  // The form is long; whenever feedback appears, bring it into view so
  // validation errors triggered from the bottom action bar are never missed.
  useEffect(() => {
    if (message) {
      messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [message]);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const categoryOptions =
    categories.length > 0
      ? categories
      : [
          { id: 1, name: "Braids" },
          { id: 2, name: "Crochet" },
          { id: 3, name: "Weaves" },
          { id: 4, name: "Closure" },
        ];

  const addVariation = () => {
    setVariations([...variations, { id: Date.now(), name: "", value: "" }]);
  };

  const addUnitOption = () => {
    const fallbackUnit = units[0]?.name || "Piece";

    setUnitOptions((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: "",
        unit: fallbackUnit,
        price: "",
        discountType: "none" as const,
        discountValue: "",
        stock: "",
      },
    ]);
  };

  const removeUnitOption = (id: number) => {
    setUnitOptions((prev) =>
      prev.length === 1 ? prev : prev.filter((option) => option.id !== id)
    );
  };

  const removeVariation = (id: number) => {
    setVariations(variations.filter((variation) => variation.id !== id));
  };

  const toggleColor = (color: ProductColor) => {
    const normalizedHex = normalizeHex(color.hex);

    setSelectedColors((prev) => {
      const exists = prev.some((item) => normalizeHex(item.hex) === normalizedHex);
      if (exists) {
        return prev.filter((item) => normalizeHex(item.hex) !== normalizedHex);
      }

      return [
        ...prev,
        {
          ...color,
          hex: normalizedHex,
        },
      ];
    });
  };

  const addCustomColor = () => {
    const normalizedHex = normalizeHex(customColorHex);
    const trimmedName = customColorName.trim();
    const nextColor: ProductColor = {
      name: trimmedName || buildColorName(normalizedHex),
      hex: normalizedHex,
      code: customColorCode.trim() || undefined,
    };

    setSelectedColors((prev) => {
      const exists = prev.some((item) => normalizeHex(item.hex) === normalizedHex);
      if (exists) {
        return prev.map((item) =>
          normalizeHex(item.hex) === normalizedHex ? { ...item, ...nextColor } : item
        );
      }

      return [...prev, nextColor];
    });

    setCustomColorName("");
    setCustomColorCode("");
  };

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "hover" = "main"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      setMessage({
        type: "error",
        text: "Cloudinary upload is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your environment.",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please choose a valid image file." });
      event.target.value = "";
      return;
    }

    const isMain = type === "main";
    isMain ? setIsUploadingImage(true) : setIsUploadingHoverImage(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: payload }
      );

      const data = await response.json();
      if (!response.ok || !data.secure_url) {
        throw new Error(data?.error?.message || `${type} image upload failed.`);
      }

      if (isMain) {
        setImageUrl(data.secure_url);
        setImageName(file.name);
      } else {
        setHoverImageUrl(data.secure_url);
        setHoverImageName(file.name);
      }
      setMessage({ type: "success", text: `${isMain ? "Main" : "Hover"} image uploaded successfully.` });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Image upload failed.";
      if (isMain) {
        setImageUrl("");
        setImageName("");
      } else {
        setHoverImageUrl("");
        setHoverImageName("");
      }
      setMessage({ type: "error", text: errorMessage });
    } finally {
      isMain ? setIsUploadingImage(false) : setIsUploadingHoverImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      setMessage({
        type: "error",
        text: "Please fill in the product name before saving.",
      });
      return;
    }

    if (!imageUrl) {
      setMessage({
        type: "error",
        text: "Please upload a product image before saving.",
      });
      return;
    }

    if (selectedColors.length === 0) {
      setMessage({
        type: "error",
        text: "Select at least one product color.",
      });
      return;
    }

    const normalizedUnitOptions = unitOptions
      .map((option) => {
        const price = Math.round(parseFloat(option.price || "0"));
        const discountType = option.discountType ?? "none";
        const discountValue = parseFloat(option.discountValue || "");

        // The discount is translated into a compare-at ("was") price so the
        // storefront can always render was/now + percent-off from one field.
        let compareAtPrice: number | null = null;
        let discountInvalid = false;

        if (discountType === "percent") {
          if (Number.isNaN(discountValue) || discountValue <= 0 || discountValue >= 100) {
            discountInvalid = true;
          } else {
            compareAtPrice = Math.round((price * 100) / (100 - discountValue));
          }
        } else if (discountType === "fixed") {
          if (Number.isNaN(discountValue) || discountValue <= 0) {
            discountInvalid = true;
          } else {
            compareAtPrice = price + Math.round(discountValue);
          }
        }

        return {
          label: option.label.trim(),
          unit: option.unit.trim(),
          price,
          compareAtPrice,
          discountInvalid,
          stock: parseInt(option.stock || "0", 10),
        };
      })
      .filter((option) => option.label && option.unit);

    if (normalizedUnitOptions.length === 0) {
      setMessage({
        type: "error",
        text: "Add at least one unit option with a label, unit, price, and stock.",
      });
      return;
    }

    const hasInvalidUnitOption = normalizedUnitOptions.some(
      (option) =>
        Number.isNaN(option.price) ||
        option.price < 0 ||
        Number.isNaN(option.stock) ||
        option.stock < 0
    );

    if (hasInvalidUnitOption) {
      setMessage({
        type: "error",
        text: "Each unit option needs a valid price and stock value.",
      });
      return;
    }

    const hasInvalidDiscount = normalizedUnitOptions.some(
      (option) => option.discountInvalid
    );

    if (hasInvalidDiscount) {
      setMessage({
        type: "error",
        text: "Discounts need a value above 0 (and below 100 for percentage).",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const primaryUnitOption = normalizedUnitOptions[0];

    const payload = {
      id: product.id,
      name,
      description,
      price: primaryUnitOption.price,
      stock: primaryUnitOption.stock,
      category,
      unit: primaryUnitOption.label,
      unitOptions: normalizedUnitOptions,
      isFeatured,
      colors: selectedColors.map((color) => ({
        name: color.name.trim() || buildColorName(color.hex),
        hex: normalizeHex(color.hex),
        code: color.code?.trim() || undefined,
      })),
      variations: variations.map((variation) => ({
        name: variation.name,
        value: variation.value,
      })),
      status,
      image: imageUrl,
      hoverImage: hoverImageUrl,
    };

    const result =
      mode === "edit" ? await updateProduct(payload) : await createProduct(payload);

    if (result.success) {
      setMessage({
        type: "success",
        text:
          mode === "edit"
            ? "Product updated successfully! Redirecting..."
            : "Product published successfully! Redirecting...",
      });
      setTimeout(() => {
        router.push("/dashboard/products");
        router.refresh();
      }, 1200);
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to save product.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`space-y-8 font-sans ${
        fullWidth ? "w-full max-w-none" : "mx-auto max-w-[1000px]"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white transition-all hover:bg-zinc-50"
          >
            <ChevronLeft className="h-5 w-5 text-black" />
          </Link>
          <div>
            <h1 className="font-sans text-[24px] font-bold text-black">
              {mode === "edit" ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-[14px] text-zinc-500">
              {mode === "edit"
                ? "Update an item in your catalog."
                : "Create a new item in your catalog."}
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/dashboard/products"
            className="flex h-11 items-center rounded-sm border border-zinc-200 bg-white px-6 text-[14px] font-medium text-black hover:bg-zinc-50"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-11 rounded-sm bg-black px-6 text-[14px] font-bold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? mode === "edit"
                ? "Saving..."
                : "Publishing..."
              : mode === "edit"
                ? "Save Changes"
                : "Publish Product"}
          </button>
        </div>
      </div>

      {message && (
        <div
          ref={messageRef}
          className={`rounded-sm border p-4 text-[14px] font-medium ${
            message.type === "success"
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-sm border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-[16px] font-bold text-black">
              General Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block font-sans text-[13px] font-medium uppercase tracking-widest text-zinc-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Knotless Braids Medium"
                  className="h-11 w-full rounded-sm border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block font-sans text-[13px] font-medium uppercase tracking-widest text-zinc-700">
                  Description
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about this product..."
                  className="w-full resize-none rounded-sm border border-transparent bg-zinc-50 p-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block font-sans text-[13px] font-medium uppercase tracking-widest text-zinc-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 w-full appearance-none rounded-sm border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                >
                  {categoryOptions.map((categoryOption) => (
                    <option key={categoryOption.id} value={categoryOption.name}>
                      {categoryOption.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-black" />
                <h3 className="text-[16px] font-bold text-black">
                  Product Variations
                </h3>
              </div>
              <button
                onClick={addVariation}
                className="flex items-center gap-1.5 text-[13px] font-bold text-black transition-opacity hover:opacity-70"
              >
                <Plus className="h-4 w-4" />
                Add Variation
              </button>
            </div>

            <div className="space-y-4">
              {variations.map((variation) => (
                <div
                  key={variation.id}
                  className="flex flex-col gap-4 rounded-sm border border-zinc-100 bg-zinc-50/50 p-4 sm:flex-row sm:items-end"
                >
                  <div className="flex-1">
                    <label className="mb-1.5 block pl-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Type
                    </label>
                    <input
                      type="text"
                      value={variation.name}
                      onChange={(e) => {
                        const next = [...variations];
                        const target = next.find((item) => item.id === variation.id);
                        if (target) target.name = e.target.value;
                        setVariations(next);
                      }}
                      placeholder="e.g. Length"
                      className="h-10 w-full rounded-sm border border-zinc-200 bg-white px-3 text-[13px] outline-none focus:border-black/20"
                    />
                  </div>
                  <div className="flex-[2]">
                    <label className="mb-1.5 block pl-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Value
                    </label>
                    <input
                      type="text"
                      value={variation.value}
                      onChange={(e) => {
                        const next = [...variations];
                        const target = next.find((item) => item.id === variation.id);
                        if (target) target.value = e.target.value;
                        setVariations(next);
                      }}
                      placeholder="e.g. 24 inch"
                      className="h-10 w-full rounded-sm border border-zinc-200 bg-white px-3 text-[13px] outline-none focus:border-black/20"
                    />
                  </div>
                  <button
                    onClick={() => removeVariation(variation.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-sm text-zinc-300 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-[16px] font-bold text-black">
              Pricing & Stock
            </h3>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium text-zinc-700">
                  Unit options
                </p>
                <p className="mt-1 text-[12px] text-zinc-500">
                  Add one row for each purchasable option, for example `1 pc` and `Pack`.
                </p>
              </div>
              <button
                type="button"
                onClick={addUnitOption}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-black transition-opacity hover:opacity-70"
              >
                <Plus className="h-4 w-4" />
                Add Unit Price
              </button>
            </div>

            <div className="space-y-4">
              {unitOptions.map((option, index) => (
                <div
                  key={option.id}
                  className="grid grid-cols-2 gap-3 rounded-sm border border-zinc-100 bg-zinc-50/70 p-4 md:grid-cols-[1.2fr_1fr_1fr_1.4fr_1fr_auto] md:gap-4"
                >
                  <div className="col-span-2 md:col-span-1">
                    <label className="mb-2 block text-[12px] font-medium text-zinc-700">
                      Option Label
                    </label>
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => {
                        const next = [...unitOptions];
                        next[index] = { ...next[index], label: e.target.value };
                        setUnitOptions(next);
                      }}
                      placeholder="e.g. 1 pc or Pack"
                      className="h-11 w-full rounded-sm border border-transparent bg-white px-4 text-[14px] outline-none transition-all focus:border-black/10"
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="block text-[12px] font-medium text-zinc-700">
                        Unit
                      </label>
                      <Link
                        href="/dashboard/products/units"
                        className="text-[11px] font-medium text-black underline underline-offset-4 hover:opacity-70"
                      >
                        Manage
                      </Link>
                    </div>
                    <select
                      value={option.unit}
                      onChange={(e) => {
                        const next = [...unitOptions];
                        next[index] = { ...next[index], unit: e.target.value };
                        setUnitOptions(next);
                      }}
                      className="h-11 w-full appearance-none rounded-sm border border-transparent bg-white px-4 text-[14px] outline-none transition-all focus:border-black/10"
                    >
                      {(units.length > 0
                        ? units
                        : [{ id: 0, name: "Piece" }]).map((unitOption) => (
                        <option key={unitOption.id} value={unitOption.name}>
                          {unitOption.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[12px] font-medium text-zinc-700">
                      Price (UGX)
                    </label>
                    <input
                      type="number"
                      value={option.price}
                      onChange={(e) => {
                        const next = [...unitOptions];
                        next[index] = { ...next[index], price: e.target.value };
                        setUnitOptions(next);
                        if (index === 0) setPrice(e.target.value);
                      }}
                      placeholder="0.00"
                      className="h-11 w-full rounded-sm border border-transparent bg-white px-4 text-[14px] outline-none transition-all focus:border-black/10"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="mb-2 block text-[12px] font-medium text-zinc-700">
                      Discount
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={option.discountType ?? "none"}
                        onChange={(e) => {
                          const next = [...unitOptions];
                          next[index] = {
                            ...next[index],
                            discountType: e.target.value as "none" | "percent" | "fixed",
                            discountValue:
                              e.target.value === "none" ? "" : next[index].discountValue,
                          };
                          setUnitOptions(next);
                        }}
                        className="h-11 w-[120px] appearance-none rounded-sm border border-transparent bg-white px-3 text-[13px] outline-none transition-all focus:border-black/10"
                      >
                        <option value="none">None</option>
                        <option value="percent">Percent (%)</option>
                        <option value="fixed">Fixed (UGX)</option>
                      </select>
                      <input
                        type="number"
                        value={option.discountValue ?? ""}
                        disabled={(option.discountType ?? "none") === "none"}
                        onChange={(e) => {
                          const next = [...unitOptions];
                          next[index] = { ...next[index], discountValue: e.target.value };
                          setUnitOptions(next);
                        }}
                        placeholder={option.discountType === "percent" ? "e.g. 20" : "e.g. 5000"}
                        className="h-11 w-full rounded-sm border border-transparent bg-white px-4 text-[14px] outline-none transition-all focus:border-black/10 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-[12px] font-medium text-zinc-700">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={option.stock}
                      onChange={(e) => {
                        const next = [...unitOptions];
                        next[index] = { ...next[index], stock: e.target.value };
                        setUnitOptions(next);
                        if (index === 0) setStock(e.target.value);
                      }}
                      placeholder="0"
                      className="h-11 w-full rounded-sm border border-transparent bg-white px-4 text-[14px] outline-none transition-all focus:border-black/10"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeUnitOption(option.id)}
                      disabled={unitOptions.length === 1}
                      className="flex h-11 w-11 items-center justify-center rounded-sm text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:text-zinc-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="order-2 rounded-sm border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Palette className="h-5 w-5 text-black" />
              <h3 className="text-[16px] font-bold text-black">
                Product Colors <span className="text-red-500">*</span>
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Palette
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {paletteColors.map((color) => {
                    const isSelected = selectedColors.some(
                      (item) => normalizeHex(item.hex) === normalizeHex(color.hex)
                    );
                    return (
                      <button
                        key={`${color.hex}-${color.name}`}
                        type="button"
                        onClick={() => toggleColor(color)}
                        title={`${color.name}${color.code ? ` (${color.code})` : ""}`}
                        className={`group relative flex flex-col items-center gap-2 rounded-sm p-2 transition-all ${
                          isSelected
                            ? "bg-zinc-900 ring-2 ring-zinc-900 ring-offset-2"
                            : "bg-zinc-50 hover:bg-zinc-100"
                        }`}
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 shadow-sm transition-transform group-active:scale-90"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <Check
                              className={`h-4 w-4 ${getReadableTextColor(color.hex)}`}
                            />
                          )}
                        </div>
                        <span
                          className={`text-center text-[10px] font-bold uppercase tracking-tight ${
                            isSelected ? "text-white" : "text-zinc-500"
                          }`}
                        >
                          {color.code || color.name.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-sm border border-zinc-100 bg-zinc-50/70 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Custom Picker
                    </p>
                    <p className="mt-1 text-[12px] text-zinc-500">
                      Choose any color and add it to this product.
                    </p>
                  </div>
                  <input
                    type="color"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(normalizeHex(e.target.value))}
                    className="h-14 w-14 cursor-pointer rounded-sm border border-zinc-200 bg-white p-1"
                    aria-label="Pick custom product color"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-2 block text-[12px] font-medium text-zinc-700">
                      Color Name
                    </label>
                    <input
                      type="text"
                      value={customColorName}
                      onChange={(e) => setCustomColorName(e.target.value)}
                      placeholder="e.g. Burgundy Wine"
                      className="h-10 w-full rounded-sm border border-zinc-200 bg-white px-3 text-[13px] outline-none focus:border-black/20"
                    />
                  </div>
                  <div className="grid grid-cols-[1fr_110px] gap-3">
                    <div>
                      <label className="mb-2 block text-[12px] font-medium text-zinc-700">
                        Hex Value
                      </label>
                      <input
                        type="text"
                        value={customColorHex}
                        onChange={(e) => setCustomColorHex(normalizeHex(e.target.value))}
                        placeholder="#C08457"
                        className="h-10 w-full rounded-sm border border-zinc-200 bg-white px-3 text-[13px] uppercase outline-none focus:border-black/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[12px] font-medium text-zinc-700">
                        Code
                      </label>
                      <input
                        type="text"
                        value={customColorCode}
                        onChange={(e) => setCustomColorCode(e.target.value)}
                        placeholder="30"
                        className="h-10 w-full rounded-sm border border-zinc-200 bg-white px-3 text-[13px] outline-none focus:border-black/20"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addCustomColor}
                    className="h-10 w-full rounded-sm bg-black text-[13px] font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Add Custom Color
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Selected Colors
                  </p>
                  <span className="text-[12px] text-zinc-500">
                    {selectedColors.length} selected
                  </span>
                </div>

                {selectedColors.length === 0 ? (
                  <div className="rounded-sm border border-dashed border-zinc-200 px-4 py-5 text-[13px] text-zinc-500">
                    No colors selected yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedColors.map((color) => (
                      <div
                        key={`${color.hex}-${color.name}`}
                        className="flex items-center justify-between gap-3 rounded-sm border border-zinc-100 bg-white px-3 py-2"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="h-8 w-8 rounded-full border border-black/10"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-black">
                              {color.name}
                            </p>
                            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                              {color.hex}
                              {color.code ? ` Â· Code ${color.code}` : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleColor(color)}
                          className="text-[12px] font-medium text-zinc-500 hover:text-black"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="order-1 rounded-sm border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-[16px] font-bold text-black">
              Product Images
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Main Image */}
              <div className="space-y-4">
                <label className="block text-[12px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Main Image (View 1) <span className="text-red-500">*</span></label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageSelect(e, "main")}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-6 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
                    <Upload className="h-4 w-4 text-zinc-400" />
                  </div>
                  <p className="mt-4 text-[13px] font-medium text-black">
                    {isUploadingImage ? "Uploading..." : "Click to upload"}
                  </p>
                </button>

                {imageUrl && (
                  <div className="relative overflow-hidden rounded-sm border border-zinc-100 bg-zinc-50">
                    <img src={imageUrl} alt="Main" className="h-48 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageUrl(""); setImageName(""); }}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Hover Image */}
              <div className="space-y-4">
                <label className="block text-[12px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Hover Image (View 2)</label>
                <input
                  ref={hoverFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageSelect(e, "hover")}
                />
                <button
                  type="button"
                  onClick={() => hoverFileInputRef.current?.click()}
                  disabled={isUploadingHoverImage}
                  className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-6 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
                    <Upload className="h-4 w-4 text-zinc-400" />
                  </div>
                  <p className="mt-4 text-[13px] font-medium text-black">
                    {isUploadingHoverImage ? "Uploading..." : "Click to upload"}
                  </p>
                </button>

                {hoverImageUrl && (
                  <div className="relative overflow-hidden rounded-sm border border-zinc-100 bg-zinc-50">
                    <img src={hoverImageUrl} alt="Hover" className="h-48 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setHoverImageUrl(""); setHoverImageName(""); }}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="order-3 rounded-sm border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-[16px] font-bold text-black">
              Organization
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-zinc-700">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-11 w-full appearance-none rounded-sm border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                >
                  <option value="Active">Published (Active)</option>
                  <option value="Draft">Unpublished (Draft)</option>
                </select>
                <p className="mt-2 px-1 text-[11px] text-zinc-400">
                  {status === "Active" 
                    ? "This product will be visible to customers." 
                    : "This product will be hidden from the store."}
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-sm border border-amber-100 bg-amber-50 px-4 py-4">
                <div className="mt-0.5">
                  <Switch
                    id="isFeaturedProduct"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                </div>
                <div>
                  <label
                    htmlFor="isFeaturedProduct"
                    className="block cursor-pointer text-[14px] font-semibold text-amber-800"
                  >
                    Feature this product
                  </label>
                  <p className="mt-0.5 text-[12px] text-amber-700">
                    Featured products are prioritized in the home page curated products section.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky action bar â€” keeps Save reachable at the end of a long form,
          which is where you are after filling everything in (crucial on mobile). */}
      <div className="sticky bottom-0 z-40 -mx-6 border-t border-zinc-200 bg-white/95 px-6 py-3 backdrop-blur lg:mx-0 lg:rounded-t-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="hidden text-[12px] text-zinc-500 sm:block">
            {status === "Active"
              ? "Will be visible to customers once saved."
              : "Saved as a hidden draft."}
          </p>
          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <Link
              href="/dashboard/products"
              className="flex h-11 flex-1 items-center justify-center rounded-sm border border-zinc-200 bg-white px-4 text-[14px] font-medium text-black hover:bg-zinc-50 sm:flex-none sm:px-6"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-11 flex-1 rounded-sm bg-black px-4 text-[14px] font-bold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-8"
            >
              {isSubmitting
                ? mode === "edit"
                  ? "Saving..."
                  : "Publishing..."
                : mode === "edit"
                  ? "Save Changes"
                  : "Publish Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
