import Image from "next/image";

export function BlogImage({
  src,
  title,
  className,
  sizes,
}: {
  src: string | null;
  title: string;
  className?: string;
  sizes?: string;
}) {
  if (!src) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-muted to-border ${className ?? ""}`}
      >
        <span className="font-display text-3xl text-foreground/30">
          {title.trim().charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-muted ${className ?? ""}`}>
      <Image src={src} alt={title} fill sizes={sizes ?? "(min-width: 768px) 33vw, 100vw"} className="object-cover" />
    </div>
  );
}
