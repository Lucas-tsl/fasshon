import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { toCardProduct, groupByType } from "@/lib/product-display";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PRODUCT_TYPE_ORDER } from "@/lib/product-type";
import { getWishlistedProductIds } from "@/lib/wishlist";
import { CatalogueFilters } from "@/components/CatalogueFilters";
import { TypeQuickNav } from "@/components/TypeQuickNav";
import { slugifyType } from "@/lib/product-type";

export const metadata = {
  title: "Catalogue",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; marque?: string; type?: string }>;
}) {
  const { categorie, marque, type } = await searchParams;

  const [categories, brands, matchingProducts, wishlistedIds] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        active: true,
        ...(categorie ? { category: { slug: categorie } } : {}),
        ...(marque ? { brand: { slug: marque } } : {}),
      },
      include: { category: true, brand: true, variants: { where: { active: true } } },
      orderBy: { createdAt: "desc" },
    }),
    getWishlistedProductIds(),
  ]);

  const cardProducts = matchingProducts.map(toCardProduct);
  const availableTypes = PRODUCT_TYPE_ORDER.filter((t) =>
    cardProducts.some((p) => p.productType === t),
  );
  const products = type ? cardProducts.filter((p) => p.productType === type) : cardProducts;
  const groups = groupByType(products);
  const hasActiveFilter = !!(categorie || marque || type);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 pb-28">
      <Breadcrumb items={[{ label: "Catalogue" }]} />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-3xl">Catalogue</h1>
        <div className="flex items-center gap-3 text-sm text-foreground/50">
          <span>
            {products.length} produit{products.length > 1 ? "s" : ""}
          </span>
          {hasActiveFilter ? (
            <Link href="/produits" className="text-accent hover:underline">
              Réinitialiser les filtres
            </Link>
          ) : null}
        </div>
      </div>

      <CatalogueFilters
        categories={categories.map((c) => ({ value: c.slug, label: c.name }))}
        brands={brands.map((b) => ({ value: b.slug, label: b.name }))}
        availableTypes={availableTypes.map((t) => ({ value: t, label: t }))}
        categorie={categorie}
        marque={marque}
        type={type}
      />

      {products.length === 0 ? (
        <p className="text-sm text-foreground/60">
          Aucun produit ne correspond à ce filtre pour le moment.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.type} id={`type-${slugifyType(group.type)}`} className="flex scroll-mt-24 flex-col gap-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-foreground/50">
                {group.type}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {group.products.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    wishlisted={wishlistedIds.has(product.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <TypeQuickNav types={groups.map((g) => g.type)} />
    </div>
  );
}
