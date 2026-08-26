import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toCardProduct } from "@/lib/product-display";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PRODUCT_TYPE_ORDER } from "@/lib/product-type";
import { getWishlistedProductIds } from "@/lib/wishlist";
import { CatalogueFilters } from "@/components/CatalogueFilters";
import { CatalogueResults } from "@/components/CatalogueResults";

export const metadata = {
  title: "Catalogue",
  description: "Le catalogue Fasshon : parfums, maquillage, soins et compléments de nos marques françaises.",
  alternates: { canonical: "/produits" },
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
      include: {
        category: true,
        brand: true,
        variants: { where: { active: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { name: "asc" },
    }),
    getWishlistedProductIds(),
  ]);

  const cardProducts = matchingProducts.map(toCardProduct);
  const availableTypes = PRODUCT_TYPE_ORDER.filter((t) =>
    cardProducts.some((p) => p.productType === t),
  );
  const products = type ? cardProducts.filter((p) => p.productType === type) : cardProducts;
  const hasActiveFilter = !!(categorie || marque || type);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
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
        <CatalogueResults products={products} wishlistedIds={[...wishlistedIds]} />
      )}
    </div>
  );
}
