"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions";

interface DeleteProductFormProps {
  id: number;
  name: string;
}

export default function DeleteProductForm({ id, name }: DeleteProductFormProps) {
  return (
    <form 
      action={deleteProduct.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="p-2 text-zinc-400 transition-colors hover:text-red-500"
        title="Delete product"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
