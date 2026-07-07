import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

function formatDate(date: Date | string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
    select: { title: true, excerpt: true, coverImage: true },
  });
  if (!post) return { title: "Post not found | Royal Braids" };
  return {
    title: `${post.title} | Royal Braids Blog`,
    description: post.excerpt ?? undefined,
    openGraph: post.coverImage
      ? { images: [{ url: post.coverImage }] }
      : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
  });

  if (!post) notFound();

  const html = renderMarkdown(post.body);
  const related = await prisma.blogPost.findMany({
    where: { isPublished: true, NOT: { id: post.id } },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 3,
  });

  return (
    <article className="w-full bg-white text-black">
      {/* Header */}
      <header className="w-full px-5 pt-10 md:px-10 md:pt-16 xl:px-16">
        <Link
          href="/blog"
          className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black"
        >
          ← Back to blog
        </Link>
        <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          {formatDate(post.publishedAt ?? post.createdAt)}
          {post.author ? ` · By ${post.author}` : ""}
        </p>
        <h1 className="mt-3 text-[34px] font-black leading-[1.05] tracking-tight text-black md:text-[56px]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-5 text-[16px] leading-relaxed text-zinc-600 md:text-[19px]">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* Cover */}
      {post.coverImage && (
        <div className="mt-10 w-full px-5 md:px-10 xl:px-16">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="w-full px-5 py-12 md:px-10 md:py-20 xl:px-16">
        <div
          className="prose-blog text-[16px] leading-[1.75] text-zinc-800 md:text-[17px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="w-full border-t border-zinc-100 bg-white px-5 py-14 md:px-10 md:py-20 xl:px-16">
          <div className="w-full">
            <h2 className="mb-8 text-[24px] font-black tracking-tight text-black md:text-[32px]">
              More from the journal
            </h2>
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100">
                    {p.coverImage ? (
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-[60px] font-black text-zinc-200">
                          {p.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    {formatDate(p.publishedAt ?? p.createdAt)}
                  </p>
                  <h3 className="mt-2 text-[18px] font-bold leading-snug tracking-tight text-black group-hover:underline md:text-[20px]">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
