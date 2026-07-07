import React from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  EyeOff,
  Eye,
  Star,
} from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { unpublishProduct, publishProduct, toggleProductFeatured } from "@/lib/actions";
import DeleteProductForm from "@/app/components/DeleteProductForm";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    return await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black">Products</h1>
          <p className="text-[14px] text-zinc-500">
            Manage your product catalog and inventory.
            <span className="ml-2 font-medium text-black">({products.length} total)</span>
          </p>
        </div>
        <Link 
          href="/dashboard/products/add"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-[14px] font-medium text-white transition-all hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Link>
      </div>

      {/* Table Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="h-10 w-full rounded-xl bg-zinc-50 pl-10 pr-4 text-[14px] outline-none border border-transparent focus:border-black/5"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-100 px-4 text-[14px] font-medium text-zinc-600 hover:bg-zinc-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-zinc-100 p-4">
              <Plus className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="mb-1 text-[16px] font-semibold text-black">No products yet</h3>
            <p className="mb-6 text-[14px] text-zinc-500">Add your first product to get started.</p>
            <Link
              href="/dashboard/products/add"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-black px-5 text-[14px] font-medium text-white transition-all hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" />
              Add New Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-zinc-100 bg-zinc-50/50">
                <tr>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Product</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Category</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Price</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Stock</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <div className="h-12 w-12 overflow-hidden rounded-lg bg-zinc-100">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400 text-[10px] uppercase font-bold">
                            {product.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[14px] font-medium text-black">{product.name}</p>
                            {(product as any).isFeatured ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                Featured
                              </span>
                            ) : null}
                          </div>
                          <p className="text-[12px] text-zinc-400">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] text-zinc-500">
                        {product.category?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-black">
                      UGX {product.priceInCents.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[13px] ${product.stock === 0 ? "text-red-500 font-medium" : "text-zinc-500"}`}>
                        {product.stock === 0 ? "Out of Stock" : `${product.stock} available • Default: ${product.unit}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                        product.status === "Active" 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "bg-zinc-100 text-zinc-500"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="p-2 text-zinc-400 transition-colors hover:text-black"
                          title="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        {product.status === "Active" ? (
                          <form action={unpublishProduct.bind(null, product.id)}>
                            <button
                              type="submit"
                              className="p-2 text-zinc-400 transition-colors hover:text-amber-600"
                              title="Unpublish product"
                            >
                              <EyeOff className="h-4 w-4" />
                            </button>
                          </form>
                        ) : (
                          <form action={publishProduct.bind(null, product.id)}>
                            <button
                              type="submit"
                              className="p-2 text-zinc-400 transition-colors hover:text-emerald-600"
                              title={product.status === "Draft" ? "Publish product" : "Re-publish product"}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </form>
                        )}
                        <form action={toggleProductFeatured.bind(null, product.id)}>
                          <button
                            type="submit"
                            className={`p-2 transition-colors ${
                              (product as any).isFeatured
                                ? "text-amber-500 hover:text-amber-600"
                                : "text-zinc-400 hover:text-amber-500"
                            }`}
                            title={(product as any).isFeatured ? "Remove from featured products" : "Feature product"}
                          >
                            <Star className={`h-4 w-4 ${(product as any).isFeatured ? "fill-amber-500" : ""}`} />
                          </button>
                        </form>
                        <DeleteProductForm id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
