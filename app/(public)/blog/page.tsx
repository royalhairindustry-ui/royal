import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Royal Braids",
  description:
    "Tips, tutorials, and stories on braiding, weaves, hair care, and styling from the Royal Braids team.",
};

function formatDate(date: Date | string | null) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function getPublishedPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("Failed to load blog posts:", error);
    return [];
  }
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <main className="w-full bg-white px-5 py-12 text-black md:px-10 md:py-20 xl:px-16">
      <header className="mb-10 md:mb-14">
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          The Royal Braids Journal
        </p>
        <h1 className="text-[40px] font-black leading-[1.05] tracking-tight text-black md:text-[64px]">
          Stories, tips & tutorials.
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] text-zinc-600 md:text-[17px]">
          Hair care guides, styling inspiration, and behind-the-scenes from the
          Royal Braids team.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-6 py-20 text-center">
          <h2 className="text-[20px] font-bold text-black">
            No posts published yet
          </h2>
          <p className="mt-2 text-[14px] text-zinc-500">
            Check back soon — we&apos;re working on new stories for you.
          </p>
        </div>
      ) : (
        <>
          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group mb-14 grid gap-8 md:mb-20 md:grid-cols-2"
            >
              <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-100">
                {featured.coverImage ? (
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-[80px] font-black text-zinc-200">
                      {featured.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Featured · {formatDate(featured.publishedAt ?? featured.createdAt)}
                </p>
                <h2 className="text-[28px] font-black leading-tight tracking-tight text-black group-hover:underline md:text-[40px]">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="mt-4 text-[15px] leading-relaxed text-zinc-600 md:text-[17px]">
                    {featured.excerpt}
                  </p>
                )}
                {featured.author && (
                  <p className="mt-4 text-[13px] text-zinc-500">
                    By {featured.author}
                  </p>
                )}
              </div>
            </Link>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-[60px] font-black text-zinc-200">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    {formatDate(post.publishedAt ?? post.createdAt)}
                  </p>
                  <h3 className="mt-2 text-[20px] font-bold leading-snug tracking-tight text-black group-hover:underline md:text-[22px]">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-3 text-[14px] text-zinc-600">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
