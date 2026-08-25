import Link from "next/link";

export function BrandsMenu({
  brands,
}: {
  brands: { slug: string; name: string }[];
}) {
  return (
    <div className="group relative">
      <Link href="/marques" className="transition-colors hover:text-accent">
        Marques
      </Link>
      <div
        className="invisible absolute left-1/2 top-full z-20 flex w-56 -translate-x-1/2 translate-y-1 flex-col gap-1 rounded-xl border border-border bg-background p-2 opacity-0 shadow-lg shadow-black/5 transition-all duration-150 ease-out group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-2 group-focus-within:opacity-100"
      >
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/marques/${brand.slug}`}
            className="rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            {brand.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
