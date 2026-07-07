import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Pencil,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { createBlogPost } from "@/lib/blog-actions";
import BlogPostForm from "@/app/components/BlogPostForm";
import DeleteBlogPostForm from "@/app/components/DeleteBlogPostForm";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

async function getPostsPage(page: number) {
  try {
    const [total, items] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.findMany({
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
    ]);
    return { total, items };
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return { total: 0, items: [] };
  }
}

export default async function BlogDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    error?: string;
    success?: string;
  }>;
}) {
  const sp = (await searchParams) ?? {};
  const requested = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const { total, items } = await getPostsPage(requested);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requested, totalPages);
  const posts = page === requested ? items : (await getPostsPage(page)).items;

  const startItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, total);
  const buildHref = (p: number) =>
    `/dashboard/content/blog?page=${p}`;

  async function createAction(formData: FormData) {
    "use server";
    try {
      await createBlogPost(formData);
    } catch (error: any) {
      if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
      const message = encodeURIComponent(
        error?.message || "Failed to create post.",
      );
      redirect(`/dashboard/content/blog?error=${message}`);
    }
    redirect(`/dashboard/content/blog?success=1`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-black sm:text-[24px]">
            Blog Posts
          </h1>
          <p className="text-[13px] text-zinc-500 sm:text-[14px]">
            Write articles, news, and tutorials for the Royal Braids blog.
            <span className="ml-2 font-medium text-black">
              ({total} total)
            </span>
          </p>
        </div>
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

      <div className="grid gap-6 lg:grid-cols-5">
        {/* List */}
        <div className="space-y-4 lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 rounded-full bg-zinc-100 p-4">
                  <FileText className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="text-[15px] font-medium text-black">
                  No posts yet
                </p>
                <p className="mt-1 text-[13px] text-zinc-500">
                  Use the form to publish your first article.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {posts.map((post) => (
                  <li key={post.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100 sm:w-28">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <FileText className="h-5 w-5 text-zinc-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-[14px] font-semibold text-black">
                            {post.title}
                          </p>
                          {post.isPublished ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-zinc-400">
                          /blog/{post.slug}
                        </p>
                        {post.excerpt && (
                          <p className="mt-1 line-clamp-2 text-[12px] text-zinc-500">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          {post.author && <span>by {post.author}</span>}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Link
                            href={`/dashboard/content/blog/${post.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium text-zinc-700 transition hover:bg-zinc-50"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          {post.isPublished && (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium text-zinc-700 transition hover:bg-zinc-50"
                            >
                              View
                            </Link>
                          )}
                          <DeleteBlogPostForm id={post.id} title={post.title} />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {total > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-3 shadow-sm sm:flex-row">
              <p className="text-[12px] text-zinc-500">
                Showing <strong className="text-black">{startItem}</strong>–
                <strong className="text-black">{endItem}</strong> of{" "}
                <strong className="text-black">{total}</strong>
              </p>
              <div className="flex items-center gap-1">
                {page > 1 ? (
                  <Link
                    href={buildHref(page - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium text-zinc-700 transition hover:bg-zinc-50"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-100 px-3 py-1.5 text-[12px] font-medium text-zinc-300">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev
                  </span>
                )}
                <span className="px-3 text-[12px] font-medium text-zinc-700">
                  Page {page} / {totalPages}
                </span>
                {page < totalPages ? (
                  <Link
                    href={buildHref(page + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-medium text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-100 px-3 py-1.5 text-[12px] font-medium text-zinc-300">
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Create form */}
        <div className="h-fit rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
          <h3 className="mb-6 text-[16px] font-bold text-black">
            Create Post
          </h3>
          <BlogPostForm action={createAction} submitLabel="Create Post" />
        </div>
      </div>
    </div>
  );
}
