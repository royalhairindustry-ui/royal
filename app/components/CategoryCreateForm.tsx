"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createCategory } from "@/lib/actions";
import CategoryBannerField from "@/app/components/CategoryBannerField";
import CategoryCircleImageField from "@/app/components/CategoryCircleImageField";
import CategoryColorField from "@/app/components/CategoryColorField";
import FormSwitch from "@/app/components/FormSwitch";

const initialState = {
  success: false,
  error: null as string | null,
};

export default function CategoryCreateForm({
  parentOptions = [],
}: {
  parentOptions?: Array<{ id: number; name: string }>;
}) {
  const [state, formAction, isPending] = useActionState(
    createCategory,
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
          Category created successfully.
        </div>
      )}

      <div>
        <label className="mb-2 block text-[13px] font-medium text-zinc-700">
          Name *
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="e.g. Knotless Braids"
          className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
        />
      </div>

      <div>
        <label className="mb-2 block text-[13px] font-medium text-zinc-700">
          Parent Category
        </label>
        <select
          name="parentId"
          defaultValue=""
          className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
        >
          <option value="">None (Top-level category)</option>
          {parentOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-[11px] text-zinc-400">
          Choose a parent if this should appear as a subcategory.
        </p>
      </div>

      <CategoryBannerField />
      <CategoryBannerField
        fieldName="featuredBanner"
        fieldId="featuredBanner"
        label="Full Width Featured Banner URL"
        uploadLabel="Upload Full Banner"
        previewLabel="Full banner preview"
        previewAlt="Full width featured banner preview"
        urlHelpText="Upload or paste the full-width banner shown at the bottom of featured categories."
        uploadErrorLabel="Full banner"
      />
      <CategoryCircleImageField />
      <div className="grid gap-4 md:grid-cols-2">
        <CategoryColorField
          name="circleColor"
          id="circleColor"
          label="Banner Circle Color"
          defaultValue="#4f43a5"
          helpText="Controls the large circular card color on the category banner."
        />
        <CategoryColorField
          name="backgroundColor"
          id="backgroundColor"
          label="Banner Background Color"
          defaultValue="#e9e9e9"
          helpText="Controls the outer banner section background color."
        />
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
        <FormSwitch name="isFeatured" id="isFeatured" />
        <div>
          <label
            htmlFor="isFeatured"
            className="block cursor-pointer text-[13px] font-semibold text-amber-800"
          >
            Feature on Homepage
          </label>
          <p className="text-[11px] text-amber-600">
            Shows this category&apos;s products on the home page and can display the full-width banner at the bottom
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-black bg-zinc-900 px-5 text-[14px] font-medium text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        {isPending ? "Saving..." : "Save Category"}
      </button>
    </form>
  );
}
