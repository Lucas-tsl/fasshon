"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createPost(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();

  if (!title || !excerpt || !content) {
    throw new Error("Champs invalides.");
  }

  const productIds = formData.getAll("productIds").map(String).filter(Boolean);

  await prisma.blogPost.create({
    data: {
      title,
      excerpt,
      content,
      coverImage: coverImage || null,
      slug: slugify(title),
      relatedProducts: { connect: productIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updatePost(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!id || !title || !excerpt || !content) {
    throw new Error("Champs invalides.");
  }

  const productIds = formData.getAll("productIds").map(String).filter(Boolean);

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      excerpt,
      content,
      coverImage: coverImage || null,
      published,
      relatedProducts: { set: productIds.map((pid) => ({ id: pid })) },
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
