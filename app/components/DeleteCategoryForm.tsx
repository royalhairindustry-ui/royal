"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions";

interface DeleteCategoryFormProps {
  id: number;
  name: string;
  productCount: number;
}

export default function DeleteCategoryForm({ id, name, productCount }: DeleteCategoryFormProps) {
  return (
    <form 
      action={deleteCategory.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all ${productCount} products in this category.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="p-2 text-zinc-400 hover:text-red-500 transition"
        title="Delete category and products"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
