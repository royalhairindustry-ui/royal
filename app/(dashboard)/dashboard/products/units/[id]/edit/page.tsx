import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import UnitEditForm from "@/app/components/UnitEditForm";

export const dynamic = "force-dynamic";

type EditUnitPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUnitPage({ params }: EditUnitPageProps) {
  const { id } = await params;
  const unitId = Number(id);

  if (Number.isNaN(unitId)) {
    notFound();
  }

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
  });

  if (!unit) {
    notFound();
  }

  const [productCount, unitOptionCount] = await Promise.all([
    prisma.product.count({
      where: { unit: unit.name },
    }),
    prisma.productUnitOption.count({
      where: { unit: unit.name },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products/units"
          className="flex items-center gap-2 text-[14px] text-zinc-500 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Units
        </Link>
      </div>

      <div>
        <h1 className="text-[24px] font-bold text-black">Edit Unit</h1>
        <p className="mt-1 text-[14px] text-zinc-500">
          Update the unit name and usage notes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <UnitEditForm
            unitId={unitId}
            defaultName={unit.name}
            defaultUsage={unit.usage || ""}
          />
        </div>

        <div className="h-fit rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-[15px] font-bold text-black">Unit Info</h2>
          <div className="space-y-3 text-[14px]">
            <div className="flex items-center justify-between border-b border-zinc-50 py-2">
              <span className="text-zinc-500">Name</span>
              <span className="font-medium text-black">{unit.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-50 py-2">
              <span className="text-zinc-500">Products using this unit</span>
              <span className="font-medium text-black">{productCount + unitOptionCount}</span>
            </div>
            <div className="py-2">
              <span className="block text-zinc-500">Usage</span>
              <p className="mt-2 leading-6 text-black">
                {unit.usage || "No usage note added yet."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
