import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/ProductGallery";
import { parseImages, toCardProduct } from "@/lib/product-display";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import { ProductFaq } from "@/components/ProductFaq";
import { ProductCard } from "@/components/ProductCard";
import { getCurrentUser } from "@/lib/user-auth";
import { getWishlistedProductIds } from "@/lib/wishlist";
import { Carousel, CarouselItem } from "@/components/Carousel";
import { BlogImage } from "@/components/BlogImage";
import { toJsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true, brand: { select: { name: true } } },
  });
  if (!product) return { title: "Produit introuvable" };

  const description = product.description.slice(0, 155);
  return {
    title: `${product.name} — ${product.brand.name}`,
    description,
    openGraph: { title: product.name, description },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [product, currentUser, wishlistedIds] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: { where: { active: true }, orderBy: { position: "asc" } },
        reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
        faqs: { orderBy: { position: "asc" } },
      },
    }),
    getCurrentUser(),
    getWishlistedProductIds(),
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

  const productImages = parseImages(product.images).map((img) => `${SITE_URL}${img}`);
  const variantPrices = product.variants.map((v) => v.priceCents);
  const inStock = product.variants.length > 0 ? product.variants.some((v) => v.stock > 0) : product.stock > 0;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: productImages,
    brand: { "@type": "Brand", name: product.brand.name },
    ...(product.reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: product.reviews.length,
          },
        }
      : {}),
    offers:
      variantPrices.length > 0
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: (Math.min(...variantPrices) / 100).toFixed(2),
            highPrice: (Math.max(...variantPrices) / 100).toFixed(2),
            offerCount: variantPrices.length,
            availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/produits/${product.slug}`,
          }
        : {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: (product.priceCents / 100).toFixed(2),
            availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/produits/${product.slug}`,
          },
  };

  const similarProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      active: true,
      productType: product.productType,
    },
    include: {
      category: true,
      brand: true,
      variants: { where: { active: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { name: "asc" },
    take: 4,
  });

  // Articles qui parlent spécifiquement de ce produit en priorité, sinon
  // les derniers articles publiés en découverte générale.
  const linkedPosts = await prisma.blogPost.findMany({
    where: { published: true, relatedProducts: { some: { id: product.id } } },
    orderBy: { publishedAt: "desc" },
  });
  const relatedPosts =
    linkedPosts.length > 0
      ? linkedPosts
      : await prisma.blogPost.findMany({
          where: { published: true },
          orderBy: { publishedAt: "desc" },
          take: 6,
        });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(productSchema) }} />
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

      <ProductFaq faqs={product.faqs} />

      {relatedPosts.length > 0 ? (
        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <h2 className="font-display text-2xl">À lire sur le blog</h2>
          <Carousel>
            {relatedPosts.map((post) => (
              <CarouselItem key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-2">
                  <BlogImage src={post.coverImage} title={post.title} className="aspect-[4/3] w-full" />
                  <p className="text-sm font-medium group-hover:underline">{post.title}</p>
                </Link>
              </CarouselItem>
            ))}
          </Carousel>
        </div>
      ) : null}

      {similarProducts.length > 0 ? (
        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <h2 className="font-display text-2xl">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {similarProducts.map((p) => (
              <ProductCard
                key={p.slug}
                product={toCardProduct(p)}
                wishlisted={wishlistedIds.has(p.id)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
