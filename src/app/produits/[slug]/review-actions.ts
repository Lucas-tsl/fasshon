"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";

export async function submitReview(formData: FormData) {
  const user = await getCurrentUser();
  const productId = String(formData.get("productId") ?? "");
  const productSlug = String(formData.get("productSlug") ?? "");

  if (!user) {
    redirect(`/compte/connexion`);
  }

  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!productId || !productSlug || !Number.isInteger(rating) || rating < 1 || rating > 5 || !comment) {
    throw new Error("Champs invalides.");
  }

  await prisma.review.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    update: { rating, comment },
    create: { userId: user.id, productId, rating, comment },
  });

  revalidatePath(`/produits/${productSlug}`);
}
