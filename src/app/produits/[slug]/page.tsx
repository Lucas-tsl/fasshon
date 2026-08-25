import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.active) {
    notFound();
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:flex-row">
      <ProductImagePlaceholder
        name={product.name}
        categorySlug={product.category.slug}
        className="aspect-square w-full md:w-1/2"
      />

      <div className="flex flex-1 flex-col gap-4">
        <Link
          href={`/produits?categorie=${product.category.slug}`}
          className="text-sm text-black/60 hover:underline dark:text-white/60"
        >
          {product.category.name}
        </Link>

        <h1 className="text-2xl font-semibold">{product.name}</h1>

        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">{formatPrice(product.priceCents)}</span>
          {product.compareAtCents ? (
            <span className="text-black/40 line-through dark:text-white/40">
              {formatPrice(product.compareAtCents)}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
          {product.description}
        </p>

        <p className="text-xs text-black/50 dark:text-white/50">SKU : {product.sku}</p>

        <button
          type="button"
          disabled={outOfStock}
          className="mt-2 w-fit rounded-full bg-black px-6 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black"
        >
          {outOfStock ? "Rupture de stock" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
