import React from "react";
import { Tag, Star, Image, CheckCircle, Layers3, ChevronLeft, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import CategoryCreateForm from "@/app/components/CategoryCreateForm";
import DeleteCategoryForm from "@/app/components/DeleteCategoryForm";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

async function getCategoriesPage(page: number) {
  try {
    const [total, items, allForOptions] = await Promise.all([
      prisma.category.count(),
      prisma.category.findMany({
        include: {
          parent: { select: { id: true, name: true } },
          _count: { select: { products: true, children: true } },
        },
        orderBy: [{ parentId: "asc" }, { name: "asc" }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          parent: { select: { id: true, name: true } },
        },
        orderBy: [{ parentId: "asc" }, { name: "asc" }],
      }),
    ]);
    return { total, items, allForOptions };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { total: 0, items: [], allForOptions: [] };
  }
}

export default async function CategoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const requestedPage = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const { total, items, allForOptions } = await getCategoriesPage(requestedPage);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  // If user requested an out-of-range page, fetch the clamped one
  const categories =
    page === requestedPage
      ? items
      : (await getCategoriesPage(page)).items;

  const parentOptions = allForOptions.map((category) => ({
    id: category.id,
    name: category.parent
      ? `${category.parent.name} / ${category.name}`
      : category.name,
  }));

  const startItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, total);

  const buildHref = (p: number) => `/dashboard/products/category?page=${p}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-black sm:text-[24px]">
            Product Categories
          </h1>
          <p className="text-[13px] text-zinc-500 sm:text-[14px]">
            Organize your products into logical groups.
            <span className="ml-2 font-medium text-black">({total} total)</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 rounded-full bg-zinc-100 p-4">
                  <Tag className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="text-[15px] font-medium text-black">
                  No categories yet
                </p>
                <p className="mt-1 text-[13px] text-zinc-500">
                  Create your first category to get started
                </p>
              </div>
            ) : (
              <>
                {/* Mobile: Card list */}
                <ul className="divide-y divide-zinc-100 md:hidden">
                  {categories.map((cat) => (
                    <li key={cat.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100">
                          {cat.banner ? (
                            <img
                              src={cat.banner}
                              alt={cat.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Tag className="h-5 w-5 text-zinc-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-[14px] font-semibold text-black">
                              {cat.name}
                            </p>
                            {cat.parent ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                                <Layers3 className="h-3 w-3" />
                                Sub
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5 text-[10px] font-medium text-white">
                                Top
                              </span>
                            )}
                            {cat.isFeatured && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                                <Star className="h-3 w-3 fill-amber-500" />
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-[11px] text-zinc-400">
                            {cat.parent ? `${cat.parent.name} / ` : ""}/
                            {cat.slug}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-zinc-500">
                            <span>
                              <strong className="text-black">
                                {cat._count.products}
                              </strong>{" "}
                              products
                            </span>
                            <span>
                              <strong className="text-black">
                                {cat._count.children}
                              </strong>{" "}
                              subs
                            </span>
                            {cat.banner && (
                              <span className="inline-flex items-center gap-1 text-emerald-600">
                                <CheckCircle className="h-3 w-3" /> Banner
                              </span>
                            )}
                            {(cat as { featuredBanner?: string | null })
                              .featuredBanner && (
                              <span className="inline-flex items-center gap-1 text-emerald-600">
                                <CheckCircle className="h-3 w-3" /> Full
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <Link
                              href={`/dashboard/products/category/${cat.id}/edit`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium text-zinc-700 transition hover:bg-zinc-50"
                            >
                              <Image className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            <DeleteCategoryForm
                              id={cat.id}
                              name={cat.name}
                              productCount={cat._count.products}
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Desktop: Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead className="border-b border-zinc-100 bg-zinc-50/50">
                      <tr>
                        <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                          Category
                        </th>
                        <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                          Level
                        </th>
                        <th className="hidden px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 lg:table-cell">
                          Banner
                        </th>
                        <th className="hidden px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 lg:table-cell">
                          Full Banner
                        </th>
                        <th className="hidden px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 xl:table-cell">
                          Circle
                        </th>
                        <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                          Products
                        </th>
                        <th className="hidden px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 lg:table-cell">
                          Subs
                        </th>
                        <th className="hidden px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 md:table-cell">
                          Featured
                        </th>
                        <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {categories.map((cat) => (
                        <tr
                          key={cat.id}
                          className="group transition-colors hover:bg-zinc-50/30"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-zinc-100">
                                {cat.banner ? (
                                  <img
                                    src={cat.banner}
                                    alt={cat.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Tag className="h-4 w-4 text-zinc-400" />
                                )}
                              </div>
                              <div>
                                <p className="text-[14px] font-medium text-black">
                                  {cat.name}
                                </p>
                                <p className="text-[11px] text-zinc-400">
                                  {cat.parent
                                    ? `${cat.parent.name} / `
                                    : ""}
                                  /{cat.slug}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {cat.parent ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-700">
                                <Layers3 className="h-3.5 w-3.5" />
                                Subcategory
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-black px-2 py-1 text-[11px] font-medium text-white">
                                Top Level
                              </span>
                            )}
                          </td>
                          <td className="hidden px-6 py-4 lg:table-cell">
                            {cat.banner ? (
                              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-emerald-600">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Set
                              </span>
                            ) : (
                              <span className="text-[12px] text-zinc-400">
                                -
                              </span>
                            )}
                          </td>
                          <td className="hidden px-6 py-4 lg:table-cell">
                            {(cat as { featuredBanner?: string | null })
                              .featuredBanner ? (
                              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-emerald-600">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Set
                              </span>
                            ) : (
                              <span className="text-[12px] text-zinc-400">
                                -
                              </span>
                            )}
                          </td>
                          <td className="hidden px-6 py-4 xl:table-cell">
                            {(cat as { circleImage?: string | null })
                              .circleImage ? (
                              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
                                <img
                                  src={
                                    (cat as { circleImage?: string | null })
                                      .circleImage ?? ""
                                  }
                                  alt={cat.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <span className="text-[12px] text-zinc-400">
                                -
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-[14px] text-zinc-600">
                            {cat._count.products}
                          </td>
                          <td className="hidden px-6 py-4 text-[14px] text-zinc-600 lg:table-cell">
                            {cat._count.children}
                          </td>
                          <td className="hidden px-6 py-4 md:table-cell">
                            {cat.isFeatured ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                                <Star className="h-3 w-3 fill-amber-500" />
                                Featured
                              </span>
                            ) : (
                              <span className="text-[12px] text-zinc-400">
                                -
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/dashboard/products/category/${cat.id}/edit`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium text-zinc-700 transition hover:bg-zinc-50"
                              >
                                <Image className="h-3.5 w-3.5" />
                                Edit
                              </Link>
                              <DeleteCategoryForm
                                id={cat.id}
                                name={cat.name}
                                productCount={cat._count.products}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-3 shadow-sm sm:flex-row">
              <p className="text-[12px] text-zinc-500">
                Showing <strong className="text-black">{startItem}</strong>–
                <strong className="text-black">{endItem}</strong> of{" "}
                <strong className="text-black">{total}</strong>
              </p>
              <div className="flex items-center gap-1">
                {page > 1 ? (
                  <Link
                    href={buildHref(page - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium text-zinc-700 transition hover:bg-zinc-50"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-100 px-3 py-1.5 text-[12px] font-medium text-zinc-300">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev
                  </span>
                )}

                <span className="px-3 text-[12px] font-medium text-zinc-700">
                  Page {page} / {totalPages}
                </span>

                {page < totalPages ? (
                  <Link
                    href={buildHref(page + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-100 px-3 py-1.5 text-[12px] font-medium text-zinc-300">
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-6 text-[16px] font-bold text-black">
            Create Category
          </h3>
          <CategoryCreateForm parentOptions={parentOptions} />
        </div>
      </div>
    </div>
  );
}
