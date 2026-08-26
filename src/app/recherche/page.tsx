import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductCard } from "@/components/ProductCard";
import { BrandLogo } from "@/components/BrandLogo";
import { BlogImage } from "@/components/BlogImage";
import { toCardProduct } from "@/lib/product-display";
import { getWishlistedProductIds } from "@/lib/wishlist";

export const metadata = {
  title: "Recherche",
  description: "Recherchez un produit, une marque ou un article sur Fasshon.",
  robots: { index: false, follow: true },
};

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <Breadcrumb items={[{ label: "Recherche" }]} />
        <h1 className="font-display text-3xl">Recherche</h1>
        <p className="text-sm text-foreground/60">Entrez un terme de recherche.</p>
      </div>
    );
  }

  const [brands, products, posts, wishlistedIds] = await Promise.all([
    prisma.brand.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.product.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: true,
        brand: true,
        variants: { where: { active: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { name: "asc" },
      take: 24,
    }),
    prisma.blogPost.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { publishedAt: "desc" },
    }),
    getWishlistedProductIds(),
  ]);

  const totalResults = brands.length + products.length + posts.length;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10">
      <div className="flex flex-col gap-2">
        <Breadcrumb items={[{ label: "Recherche" }]} />
        <h1 className="font-display text-3xl">Résultats pour « {query} »</h1>
        <p className="text-sm text-foreground/50">
          {totalResults} résultat{totalResults > 1 ? "s" : ""}
        </p>
      </div>

      {totalResults === 0 ? (
        <p className="text-sm text-foreground/60">
          Aucun résultat. Essayez un autre terme, ou{" "}
          <Link href="/produits" className="text-accent hover:underline">
            parcourez le catalogue
          </Link>
          .
        </p>
      ) : (
        <>
          {brands.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-foreground/50">
                Marques ({brands.length})
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/marques/${brand.slug}`}
                    className="flex items-center justify-center rounded-md border border-border p-6 transition-colors hover:border-foreground"
                  >
                    <BrandLogo name={brand.name} logoPath={brand.logoPath} className="h-8" />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {products.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-foreground/50">
                Produits ({products.length})
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={toCardProduct(product)}
                    wishlisted={wishlistedIds.has(product.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {posts.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-foreground/50">
                Articles de blog ({posts.length})
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-3 rounded-md border border-border p-3 transition-colors hover:border-foreground"
                  >
                    <BlogImage src={post.coverImage} title={post.title} className="aspect-[4/3] w-full" />
                    <div>
                      <h3 className="font-display text-lg">{post.title}</h3>
                      <p className="mt-1 text-sm text-foreground/60">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
