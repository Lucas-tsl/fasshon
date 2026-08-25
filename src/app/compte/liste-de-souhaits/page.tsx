import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";
import { ProductCard } from "@/components/ProductCard";
import { toCardProduct } from "@/lib/product-display";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata = { title: "Ma liste de souhaits" };

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/compte/connexion");
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          category: true,
          brand: true,
          variants: { where: { active: true } },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const products = items.map((i) => i.product).filter((p) => p.active);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <Breadcrumb items={[{ label: "Mon compte", href: "/compte" }, { label: "Ma liste de souhaits" }]} />
      <h1 className="font-display text-3xl">Ma liste de souhaits</h1>

      {products.length === 0 ? (
        <p className="text-sm text-foreground/60">
          Vous n&apos;avez pas encore ajouté de produit.{" "}
          <Link href="/produits" className="text-accent hover:underline">
            Voir le catalogue
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={toCardProduct(product)} wishlisted />
          ))}
        </div>
      )}
    </div>
  );
}
