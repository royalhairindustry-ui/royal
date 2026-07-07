"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base: string, ignoreId?: number) {
  let slug = base || "post";
  let i = 2;
  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || (ignoreId && existing.id === ignoreId)) return slug;
    slug = `${base}-${i++}`;
  }
}

function readFields(formData: FormData) {
  return {
    title: ((formData.get("title") as string) || "").trim(),
    excerpt: ((formData.get("excerpt") as string) || "").trim(),
    coverImage: ((formData.get("coverImage") as string) || "").trim(),
    body: ((formData.get("body") as string) || "").trim(),
    author: ((formData.get("author") as string) || "").trim(),
    isPublished: formData.get("isPublished") === "on",
  };
}

export async function createBlogPost(formData: FormData) {
  const data = readFields(formData);
  if (!data.title) throw new Error("Title is required.");
  if (!data.body) throw new Error("Body is required.");

  const slug = await uniqueSlug(slugify(data.title));

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      coverImage: data.coverImage || null,
      body: data.body,
      author: data.author || null,
      isPublished: data.isPublished,
      publishedAt: data.isPublished ? new Date() : null,
    },
    select: { id: true, slug: true },
  });

  revalidatePath("/dashboard/content/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return post;
}

export async function updateBlogPost(id: number, formData: FormData) {
  const data = readFields(formData);
  if (!data.title) throw new Error("Title is required.");
  if (!data.body) throw new Error("Body is required.");

  const existing = await prisma.blogPost.findUnique({
    where: { id },
    select: { slug: true, isPublished: true, publishedAt: true, title: true },
  });
  if (!existing) throw new Error("Blog post not found.");

  const desiredSlugBase = slugify(data.title);
  const slug =
    desiredSlugBase === slugify(existing.title)
      ? existing.slug
      : await uniqueSlug(desiredSlugBase, id);

  const becamePublished = data.isPublished && !existing.isPublished;

  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      coverImage: data.coverImage || null,
      body: data.body,
      author: data.author || null,
      isPublished: data.isPublished,
      publishedAt: data.isPublished
        ? existing.publishedAt ?? (becamePublished ? new Date() : new Date())
        : null,
    },
    select: { slug: true },
  });

  revalidatePath("/dashboard/content/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${updated.slug}`);
  if (existing.slug !== updated.slug) {
    revalidatePath(`/blog/${existing.slug}`);
  }

  return updated;
}

export async function deleteBlogPost(id: number) {
  const existing = await prisma.blogPost.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/dashboard/content/blog");
  revalidatePath("/blog");
  if (existing) revalidatePath(`/blog/${existing.slug}`);
}
