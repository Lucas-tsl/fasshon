import Image from "next/image";

export function BrandLogo({
  name,
  logoPath,
  className,
}: {
  name: string;
  logoPath: string | null;
  className?: string;
}) {
  if (!logoPath) {
    return <span className={`font-medium ${className ?? ""}`}>{name}</span>;
  }

  return (
    <Image
      src={logoPath}
      alt={name}
      width={160}
      height={48}
      className={`h-8 w-auto object-contain ${className ?? ""}`}
      unoptimized
    />
  );
}
