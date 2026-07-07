import { notFound } from "next/navigation";
import ProductEditorForm from "@/app/components/ProductEditorForm";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      colors: true,
      category: true,
      unitOptions: {
        orderBy: { sortOrder: "asc" },
      },
      variations: true,
    },
  });

  if (!product) {
    notFound();
  }

  const [units, categories, colors] = await Promise.all([
    prisma.unit.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.color.findMany({
      select: { id: true, name: true, hex: true, code: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <ProductEditorForm
      mode="edit"
      units={units}
      categories={categories}
      availableColors={colors}
      initialData={{
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: String(product.priceInCents),
        stock: String(product.stock),
        category: product.category.name,
        unit: product.unit,
        isFeatured: (product as any).isFeatured,
        unitOptions:
          product.unitOptions.length > 0
            ? product.unitOptions.map((option) => ({
                id: option.id,
                label: option.label,
                unit: option.unit,
                price: String(option.priceInCents),
                discountType: (option.compareAtPriceInCents &&
                option.compareAtPriceInCents > option.priceInCents
                  ? "fixed"
                  : "none") as "fixed" | "none",
                discountValue:
                  option.compareAtPriceInCents &&
                  option.compareAtPriceInCents > option.priceInCents
                    ? String(option.compareAtPriceInCents - option.priceInCents)
                    : "",
                stock: String(option.stock),
              }))
            : [
                {
                  id: 1,
                  label: product.unit,
                  unit: product.unit,
                  price: String(product.priceInCents),
                  discountType: (product.compareAtPriceInCents &&
                  product.compareAtPriceInCents > product.priceInCents
                    ? "fixed"
                    : "none") as "fixed" | "none",
                  discountValue:
                    product.compareAtPriceInCents &&
                    product.compareAtPriceInCents > product.priceInCents
                      ? String(product.compareAtPriceInCents - product.priceInCents)
                      : "",
                  stock: String(product.stock),
                },
              ],
        status: product.status,
        variations:
          product.variations.length > 0
            ? product.variations.map((variation) => ({
                id: variation.id,
                name: variation.type,
                value: variation.value,
              }))
            : [{ id: 1, name: "Length", value: "24 inch" }],
        selectedColors: product.colors.map((color) => ({
          id: color.id,
          name: color.name,
          hex: color.hex,
          code: color.code,
        })),
        imageUrl: product.image || "",
        hoverImageUrl: (product as any).hoverImage || "",
      }}
    />
  );
}
