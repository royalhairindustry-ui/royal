"use client";

import { Trash2 } from "lucide-react";
import { deleteBlogPost } from "@/lib/blog-actions";

type DeleteBlogPostFormProps = {
  id: number;
  title: string;
};

export default function DeleteBlogPostForm({
  id,
  title,
}: DeleteBlogPostFormProps) {
  return (
    <form
      action={deleteBlogPost.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-[12px] font-medium text-red-600 transition hover:bg-red-50"
        title="Delete post"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>
    </form>
  );
}
