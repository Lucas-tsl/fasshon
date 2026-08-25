import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";

export async function getWishlistedProductIds(): Promise<Set<string>> {
  const user = await getCurrentUser();
  if (!user) return new Set();
  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    select: { productId: true },
  });
  return new Set(items.map((i) => i.productId));
}
