"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";

export async function toggleWishlist(productId: string): Promise<{ wishlisted: boolean }> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/compte/connexion");
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/compte/liste-de-souhaits");
    return { wishlisted: false };
  }

  await prisma.wishlistItem.create({ data: { userId: user.id, productId } });
  revalidatePath("/compte/liste-de-souhaits");
  return { wishlisted: true };
}
