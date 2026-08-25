import Link from "next/link";
import Image from "next/image";

type Tile = {
  brandSlug: string;
  brandName: string;
  image: string;
  productName: string;
};

export function BrandShowcaseBanner({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
      {tiles.map((tile) => (
        <Link
          key={tile.brandSlug}
          href={`/marques/${tile.brandSlug}`}
          className="group relative aspect-square overflow-hidden bg-muted"
        >
          <Image
            src={tile.image}
            alt={tile.productName}
            fill
            sizes="(min-width: 640px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0"
          />
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
            <p className="font-display text-lg text-white sm:text-xl">{tile.brandName}</p>
            <p className="text-[11px] font-medium tracking-wide text-white/70 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Découvrir →
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
