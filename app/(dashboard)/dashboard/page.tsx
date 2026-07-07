import {
  Package,
  Layers3,
  Boxes,
  Archive,
  ArrowUpRight,
  DatabaseZap,
} from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-UG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function DashboardPage() {
  try {
    const [
      totalProducts,
      activeProducts,
      draftProducts,
      totalCategories,
      totalUnits,
      stockAggregate,
      latestProducts,
      latestCategories,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "Active" } }),
      prisma.product.count({ where: { status: "Draft" } }),
      prisma.category.count(),
      prisma.unit.count(),
      prisma.product.aggregate({
        _sum: { stock: true },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { category: true },
      }),
      prisma.category.findMany({
        take: 3,
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const totalStock = stockAggregate._sum.stock || 0;

    const stats = [
      {
        name: "Total Products",
        value: totalProducts.toLocaleString(),
        meta: `${activeProducts} active`,
        icon: Package,
      },
      {
        name: "Draft Products",
        value: draftProducts.toLocaleString(),
        meta: `${Math.max(totalProducts - draftProducts, 0)} published`,
        icon: Layers3,
      },
      {
        name: "Categories",
        value: totalCategories.toLocaleString(),
        meta: `${totalUnits} units configured`,
        icon: Boxes,
      },
      {
        name: "Total Stock",
        value: totalStock.toLocaleString(),
        meta: "Combined inventory count",
        icon: Archive,
      },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-[24px] font-bold text-black">Dashboard Overview</h1>
          <p className="text-[14px] text-zinc-500">
            Live inventory data from your catalog and storefront setup.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="rounded-2xl border border-zinc-100 bg-white p-6 transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-zinc-50 p-2.5">
                  <stat.icon className="h-5 w-5 text-black" />
                </div>
                <div className="flex items-center gap-1 text-[12px] font-medium text-emerald-600">
                  Live
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-[14px] font-medium text-zinc-500">
                  {stat.name}
                </h3>
                <p className="mt-1 text-[24px] font-bold text-black">
                  {stat.value}
                </p>
                <p className="mt-2 text-[12px] text-zinc-400">{stat.meta}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="col-span-2 rounded-2xl border border-zinc-100 bg-white p-6">
            <h3 className="text-[16px] font-bold text-black">Latest Products</h3>
            <div className="mt-6 space-y-4">
              {latestProducts.length === 0 ? (
                <div className="rounded-xl bg-zinc-50 px-4 py-10 text-center text-[14px] text-zinc-500">
                  No products added yet.
                </div>
              ) : (
                latestProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-zinc-100 px-4 py-4"
                  >
                    <div className="flex items-center gap-4">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-100 text-[18px] font-bold text-zinc-400">
                          {product.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-[14px] font-semibold text-black">
                          {product.name}
                        </p>
                        <p className="mt-1 text-[12px] text-zinc-500">
                          {product.category.name} · {product.stock}{" "}
                          {product.unit.toLowerCase()}
                          {product.stock === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-semibold text-black">
                        UGX {product.priceInCents.toLocaleString()}
                      </p>
                      <p className="mt-1 text-[12px] text-zinc-400">
                        Updated {formatDate(product.updatedAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-6">
            <h3 className="text-[16px] font-bold text-black">Recent Activity</h3>
            <div className="mt-6 space-y-6">
              {latestProducts.slice(0, 3).map((product) => (
                <div key={`product-${product.id}`} className="flex gap-4">
                  <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-full bg-zinc-100" />
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-black">
                      Product updated: {product.name}
                    </p>
                    <p className="text-[12px] text-zinc-500">
                      {formatDate(product.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
              {latestCategories.map((category) => (
                <div key={`category-${category.id}`} className="flex gap-4">
                  <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-full bg-zinc-100" />
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-black">
                      Category updated: {category.name}
                    </p>
                    <p className="text-[12px] text-zinc-500">
                      {formatDate(category.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
              {latestProducts.length === 0 && latestCategories.length === 0 && (
                <div className="text-[13px] text-zinc-500">
                  No recent activity yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard overview data error:", error);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-[24px] font-bold text-black">Dashboard Overview</h1>
          <p className="text-[14px] text-zinc-500">
            Live inventory data from your catalog and storefront setup.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              <DatabaseZap className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-black">
                Dashboard data is temporarily unavailable
              </h2>
              <p className="mt-2 max-w-[680px] text-[14px] leading-6 text-zinc-600">
                The dashboard could not reach the database right now. The rest of
                the admin UI is still available, and this page will load real
                metrics again once the database connection is restored.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
