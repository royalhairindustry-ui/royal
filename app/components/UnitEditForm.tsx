"use client";

import { useActionState } from "react";
import { updateUnit } from "@/lib/actions";

const initialState = {
  success: false,
  error: null as string | null,
};

type UnitEditFormProps = {
  unitId: number;
  defaultName: string;
  defaultUsage: string;
};

export default function UnitEditForm({
  unitId,
  defaultName,
  defaultUsage,
}: UnitEditFormProps) {
  const updateUnitWithId = updateUnit.bind(null, unitId);
  const [state, formAction, isPending] = useActionState(
    updateUnitWithId,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
          Unit updated successfully.
        </div>
      )}

      <div>
        <label className="mb-2 block text-[13px] font-medium text-zinc-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={defaultName}
          className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
        />
      </div>
      <div>
        <label className="mb-2 block text-[13px] font-medium text-zinc-700">
          Usage
        </label>
        <textarea
          name="usage"
          rows={4}
          defaultValue={defaultUsage}
          className="w-full rounded-xl border border-transparent bg-zinc-50 p-4 text-[14px] outline-none transition-all focus:border-black/10"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="h-11 w-full rounded-xl bg-black text-[14px] font-medium text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
