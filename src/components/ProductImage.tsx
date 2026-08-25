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
    </div>
  );
}
