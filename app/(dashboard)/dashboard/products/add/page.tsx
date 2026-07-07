import ProductEditorForm from "@/app/components/ProductEditorForm";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AddProductPage() {
  let units: Array<{ id: number; name: string }> = [];
  let categories: Array<{ id: number; name: string }> = [];
  let colors: Array<{ id: number; name: string; hex: string; code: string | null }> = [];

  try {
    units = await prisma.unit.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch units for add product page:", error);
  }

  try {
    categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories for add product page:", error);
  }

  try {
    colors = await prisma.color.findMany({
      select: { id: true, name: true, hex: true, code: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch colors for add product page:", error);
  }

  return (
    <ProductEditorForm
      mode="create"
      units={units}
      categories={categories}
      availableColors={colors}
      fullWidth
    />
  );
}
