import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      variants: { where: { active: true }, orderBy: { position: "asc" } },
    },
  });

  if (!product || !product.active) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:flex-row">
      <ProductImagePlaceholder
        name={product.name}
        categorySlug={product.category.slug}
        className="aspect-square w-full md:w-1/2"
      />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap gap-2 text-sm text-foreground/60">
          <Link href={`/produits?marque=${product.brand.slug}`} className="hover:underline">
            {product.brand.name}
          </Link>
          <span>·</span>
          <Link href={`/produits?categorie=${product.category.slug}`} className="hover:underline">
            {product.category.name}
          </Link>
        </div>

        <h1 className="text-2xl font-semibold">{product.name}</h1>

        {product.variants.length === 0 && product.compareAtCents ? (
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">{formatPrice(product.priceCents)}</span>
            <span className="text-foreground/40 line-through">
              {formatPrice(product.compareAtCents)}
            </span>
          </div>
        ) : null}

        <p className="text-sm leading-relaxed text-foreground/70">{product.description}</p>

        <p className="text-xs text-foreground/50">SKU : {product.sku}</p>

        <AddToCartButton
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            priceCents: product.priceCents,
            stock: product.stock,
            brandName: product.brand.name,
            categorySlug: product.category.slug,
          }}
          variants={product.variants.map((v) => ({
            id: v.id,
            name: v.name,
            priceCents: v.priceCents,
            stock: v.stock,
          }))}
        />
      </div>
    </div>
  );
}
