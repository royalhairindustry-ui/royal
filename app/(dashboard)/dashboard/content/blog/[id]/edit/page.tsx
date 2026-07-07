import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/prisma";
import { updateBlogPost } from "@/lib/blog-actions";
import BlogPostForm from "@/app/components/BlogPostForm";
import DeleteBlogPostForm from "@/app/components/DeleteBlogPostForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string; success?: string }>;
}) {
  const { id: idParam } = await params;
  const sp = (await searchParams) ?? {};
  const id = parseInt(idParam, 10);
  if (Number.isNaN(id)) notFound();

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  async function updateAction(formData: FormData) {
    "use server";
    try {
      await updateBlogPost(id, formData);
    } catch (error: any) {
      if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
      const message = encodeURIComponent(
        error?.message || "Failed to save post.",
      );
      redirect(`/dashboard/content/blog/${id}/edit?error=${message}`);
    }
    redirect(`/dashboard/content/blog/${id}/edit?success=1`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/content/blog"
          className="flex items-center gap-2 text-[14px] text-zinc-500 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-black sm:text-[24px]">
            Edit Post
          </h1>
          <p className="text-[13px] text-zinc-500 sm:text-[14px]">
            <span className="font-mono text-[12px] text-zinc-600">
              /blog/{post.slug}
            </span>
          </p>
        </div>
        <DeleteBlogPostForm id={post.id} title={post.title} />
      </div>

      {sp.error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {sp.error}
        </div>
      ) : null}
      {sp.success ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Post saved successfully.
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm sm:p-6">
        <BlogPostForm
          action={updateAction}
          defaults={{
            title: post.title,
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            body: post.body,
            author: post.author,
            isPublished: post.isPublished,
          }}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
