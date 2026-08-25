import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/ProductGallery";
import { parseImages } from "@/lib/product-display";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import { getCurrentUser } from "@/lib/user-auth";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [product, currentUser] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: { where: { active: true }, orderBy: { position: "asc" } },
        reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
      },
    }),
    getCurrentUser(),
  ]);

  if (!product || !product.active) {
    notFound();
  }

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;
  const myReview = currentUser
    ? product.reviews.find((r) => r.userId === currentUser.id)
    : undefined;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <Breadcrumb
        items={[
          { label: "Catalogue", href: "/produits" },
          { label: product.brand.name, href: `/marques/${product.brand.slug}` },
          { label: product.name },
        ]}
      />

      <ProductGallery
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          sku: product.sku,
          priceCents: product.priceCents,
          compareAtCents: product.compareAtCents,
          stock: product.stock,
          brandName: product.brand.name,
          categoryName: product.category.name,
          categorySlug: product.category.slug,
          images: parseImages(product.images),
          averageRating,
          reviewCount: product.reviews.length,
        }}
        variants={product.variants.map((v) => ({
          id: v.id,
          name: v.name,
          priceCents: v.priceCents,
          stock: v.stock,
          image: v.image,
        }))}
      />

      <div id="avis" className="flex scroll-mt-24 flex-col gap-6 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Avis clients</h2>
          {product.reviews.length > 0 ? (
            <StarRating value={averageRating} count={product.reviews.length} size="md" />
          ) : null}
        </div>

        {product.reviews.length === 0 ? (
          <p className="text-sm text-foreground/60">Aucun avis pour le moment.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {product.reviews.map((review) => (
              <li key={review.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <StarRating value={review.rating} />
                  <span className="text-xs text-foreground/50">
                    {review.createdAt.toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium">{review.user.name ?? "Client vérifié"}</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/70">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}

        {currentUser ? (
          <ReviewForm
            productId={product.id}
            productSlug={product.slug}
            existingReview={myReview ? { rating: myReview.rating, comment: myReview.comment } : null}
          />
        ) : (
          <p className="text-sm text-foreground/60">
            <Link href="/compte/connexion" className="text-accent hover:underline">
              Connectez-vous
            </Link>{" "}
            pour laisser un avis sur ce produit.
          </p>
        )}
      </div>
    </div>
  );
}
