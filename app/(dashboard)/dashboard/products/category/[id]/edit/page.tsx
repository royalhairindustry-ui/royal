import prisma from "@/lib/prisma";
import { updateCategory } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import CategoryBannerField from "@/app/components/CategoryBannerField";
import CategoryCircleImageField from "@/app/components/CategoryCircleImageField";
import CategoryColorField from "@/app/components/CategoryColorField";
import SaveChangesButton from "@/app/components/SaveChangesButton";
import FormSwitch from "@/app/components/FormSwitch";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string; success?: string }>;
}) {
  const { id: idParam } = await params;
  const resolvedSearchParams = await searchParams;
  const id = parseInt(idParam);
  if (isNaN(id)) notFound();

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: {
        select: { id: true, name: true },
      },
      _count: { select: { products: true, children: true } },
    },
  });

  if (!category) notFound();

  const parentOptions = await prisma.category.findMany({
    where: { id: { not: id } },
    select: {
      id: true,
      name: true,
      parent: {
        select: { name: true },
      },
    },
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
  });

  async function updateWithId(formData: FormData) {
    "use server";
    try {
      await updateCategory(id, formData);
    } catch (error: any) {
      // next/navigation's redirect throws a special error we must re-throw
      if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
      const message = encodeURIComponent(
        error?.message || "Failed to update category.",
      );
      redirect(`/dashboard/products/category/${id}/edit?error=${message}`);
    }
    redirect(`/dashboard/products/category/${id}/edit?success=1`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products/category"
          className="flex items-center gap-2 text-[14px] text-zinc-500 hover:text-black transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>
      </div>

      <div>
        <h1 className="text-[24px] font-bold text-black">Edit Category</h1>
        <p className="text-[14px] text-zinc-500 mt-1">
          Update the parent, category images, and featured status for <strong>{category.name}</strong>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Edit Form */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <form action={updateWithId} className="space-y-6">
            {resolvedSearchParams?.error ? (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                {resolvedSearchParams.error}
              </div>
            ) : null}
            {resolvedSearchParams?.success ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Category saved successfully.
              </div>
            ) : null}
            <div>
              <label className="block text-[13px] font-semibold text-zinc-700 mb-2">Category Name</label>
              <input
                type="text"
                name="name"
                defaultValue={category.name}
                required
                className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
                placeholder="e.g. Premium Braiding Hair"
              />
              <p className="mt-1 text-[11px] text-zinc-400">Updating the name will also automatically update the URL slug</p>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-zinc-700 mb-2">Category Description (for banner)</label>
              <textarea
                name="description"
                defaultValue={(category as any).description || ""}
                rows={3}
                className="w-full rounded-xl border border-transparent bg-zinc-50 px-4 py-3 text-[14px] outline-none transition-all focus:border-black/10 min-h-[100px]"
                placeholder="Enter a description to be shown on the category banner..."
              />
              <p className="mt-1 text-[11px] text-zinc-400">This description will be shown on the home page category banner circle.</p>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-zinc-700 mb-2">
                Parent Category
              </label>
              <select
                name="parentId"
                defaultValue={category.parentId ?? ""}
                className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
              >
                <option value="">None (Top-level category)</option>
                {parentOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.parent ? `${option.parent.name} / ${option.name}` : option.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-zinc-400">
                Assign a parent if this category should be nested as a subcategory.
              </p>
            </div>

            <CategoryBannerField defaultValue={category.banner ?? ""} />
            <CategoryBannerField
              defaultValue={(category as any).featuredBanner ?? ""}
              fieldName="featuredBanner"
              fieldId="featuredBanner"
              label="Full Width Featured Banner URL"
              uploadLabel="Upload Full Banner"
              previewLabel="Full banner preview"
              previewAlt="Full width featured banner preview"
              urlHelpText="Upload or paste the full-width banner shown at the bottom of this featured category section."
              uploadErrorLabel="Full banner"
            />
            <CategoryCircleImageField defaultValue={(category as any).circleImage ?? ""} />
            <div className="grid gap-4 md:grid-cols-2">
              <CategoryColorField
                name="circleColor"
                id="circleColor"
                label="Banner Circle Color"
                defaultValue={(category as any).circleColor ?? "#4f43a5"}
                helpText="Controls the large circular card color on this category banner."
              />
              <CategoryColorField
                name="backgroundColor"
                id="backgroundColor"
                label="Banner Background Color"
                defaultValue={(category as any).backgroundColor ?? "#e9e9e9"}
                helpText="Controls the outer background color of this category banner section."
              />
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-4">
              <div className="mt-0.5">
                <FormSwitch
                  name="isFeatured"
                  id="isFeatured"
                  defaultChecked={category.isFeatured}
                />
              </div>
              <div>
                <label htmlFor="isFeatured" className="block text-[14px] font-semibold text-amber-800 cursor-pointer">
                  Feature on Homepage
                </label>
                <p className="text-[12px] text-amber-700 mt-0.5">
                  Displays a dedicated section on the homepage with this category&apos;s banner, products, and optional full-width bottom banner.
                  Requires a banner image to be set.
                </p>
              </div>
            </div>

            <SaveChangesButton />
          </form>
        </div>

        {/* Category Info */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm h-fit space-y-4">
          <h3 className="text-[15px] font-bold text-black">Category Info</h3>
          <div className="space-y-3 text-[14px]">
            <div className="flex items-center justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Name</span>
              <span className="font-medium text-black">{category.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Slug</span>
              <span className="font-mono text-[12px] text-zinc-600">/{category.slug}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Parent</span>
              <span className="font-medium text-black">{category.parent?.name ?? "None"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Products</span>
              <span className="font-medium text-black">{category._count.products}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Subcategories</span>
              <span className="font-medium text-black">{category._count.children}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Featured</span>
              <span className={`font-medium ${category.isFeatured ? "text-amber-600" : "text-zinc-400"}`}>
                {category.isFeatured ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-500">Banner</span>
              <span className={`font-medium ${category.banner ? "text-emerald-600" : "text-zinc-400"}`}>
                {category.banner ? "Set" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-500">Full Banner</span>
              <span className={`font-medium ${(category as any).featuredBanner ? "text-emerald-600" : "text-zinc-400"}`}>
                {(category as any).featuredBanner ? "Set" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-500">Circle Image</span>
              <span className={`font-medium ${(category as any).circleImage ? "text-emerald-600" : "text-zinc-400"}`}>
                {(category as any).circleImage ? "Set" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-500">Circle Color</span>
              <span className="font-medium text-black">
                {(category as any).circleColor || "Default"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-500">Background Color</span>
              <span className="font-medium text-black">
                {(category as any).backgroundColor || "Default"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
