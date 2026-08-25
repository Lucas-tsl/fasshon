import Image from "next/image";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";

export function ProductImage({
  images,
  name,
  categorySlug,
  className,
  sizes,
}: {
  images: string[];
  name: string;
  categorySlug: string;
  className?: string;
  sizes?: string;
}) {
  if (images.length === 0) {
    return (
      <ProductImagePlaceholder name={name} categorySlug={categorySlug} className={className} />
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-muted ${className ?? ""}`}>
      <Image
        src={images[0]}
        alt={name}
        fill
        sizes={sizes ?? "(min-width: 768px) 25vw, 50vw"}
        className="object-cover"
      />
      {/* Deuxième photo en fondu au survol — n'a d'effet que si un ancêtre
          porte la classe "group" (cartes produit), sans effet ailleurs
          (galerie fiche produit, panier...). */}
      {images[1] ? (
        <Image
          src={images[1]}
          alt={name}
          fill
          sizes={sizes ?? "(min-width: 768px) 25vw, 50vw"}
          className="object-cover opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
        />
      ) : null}
    </div>
  );
}
