import { Boxes, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { deleteUnit } from "@/lib/actions";
import UnitCreateForm from "@/app/components/UnitCreateForm";

export const dynamic = "force-dynamic";

async function getUnits() {
  try {
    const units = await prisma.unit.findMany({
      orderBy: { name: "asc" },
    });

    const usageCounts = await Promise.all(
      units.map(async (unit) => ({
        id: unit.id,
        count:
          (await prisma.product.count({
            where: { unit: unit.name },
          })) +
          (await prisma.productUnitOption.count({
            where: { unit: unit.name },
          })),
      }))
    );

    return units.map((unit) => ({
      ...unit,
      productCount: usageCounts.find((item) => item.id === unit.id)?.count || 0,
    }));
  } catch (error) {
    console.error("Failed to fetch units:", error);
    return [];
  }
}

export default async function UnitsPage() {
  const units = await getUnits();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black">Units</h1>
          <p className="text-[14px] text-zinc-500">
            Manage reference units used in product stock and pricing.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
            {units.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 rounded-full bg-zinc-100 p-4">
                  <Boxes className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="text-[15px] font-medium text-black">No units yet</p>
                <p className="mt-1 text-[13px] text-zinc-500">
                  Create your first unit to use in product registration.
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="border-b border-zinc-100 bg-zinc-50/50">
                  <tr>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Products
                    </th>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {units.map((unit) => (
                    <tr key={unit.id} className="transition-colors hover:bg-zinc-50/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
                            <Boxes className="h-4 w-4 text-zinc-500" />
                          </div>
                          <span className="text-[14px] font-medium text-black">
                            {unit.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-zinc-500">
                        {unit.usage || "—"}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-zinc-600">
                        {unit.productCount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/products/units/${unit.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium text-zinc-700 transition hover:bg-zinc-50"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          <form action={deleteUnit.bind(null, unit.id)}>
                            <button
                              type="submit"
                              disabled={unit.productCount > 0}
                              className="p-2 text-zinc-400 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                              title={
                                unit.productCount > 0
                                  ? "Remove this unit from products first"
                                  : "Delete unit"
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-[16px] font-bold text-black">Create Unit</h2>
          <UnitCreateForm />
        </div>
      </div>
    </div>
  );
}
