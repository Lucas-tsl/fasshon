import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
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
          priceCents: product.priceCents,
          stock: product.stock,
          brandName: product.brand.name,
          categorySlug: product.category.slug,
          images: parseImages(product.images),
        }}
        variants={product.variants.map((v) => ({
          id: v.id,
          name: v.name,
          priceCents: v.priceCents,
          stock: v.stock,
          image: v.image,
        }))}
      />

      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <div>
          <Link
            href={`/produits?categorie=${product.category.slug}`}
            className="text-sm text-foreground/60 hover:underline"
          >
            {product.category.name}
          </Link>
          <h1 className="font-display text-3xl">{product.name}</h1>
          {product.reviews.length > 0 ? (
            <a href="#avis" className="mt-1 inline-block">
              <StarRating value={averageRating} count={product.reviews.length} />
            </a>
          ) : null}
        </div>

        {product.variants.length === 0 && product.compareAtCents ? (
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{formatPrice(product.priceCents)}</span>
            <span className="text-foreground/40 line-through">
              {formatPrice(product.compareAtCents)}
            </span>
          </div>
        ) : null}

        <p className="max-w-2xl text-sm leading-relaxed text-foreground/70">
          {product.description}
        </p>

        <p className="text-xs text-foreground/50">SKU : {product.sku}</p>
      </div>

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
