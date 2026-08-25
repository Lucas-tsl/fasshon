import Link from "next/link";

export const metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <div className="mx-auto flex flex-1 max-w-lg flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <p className="font-display text-8xl text-accent">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl">Cette page n&apos;existe pas</h1>
        <p className="text-sm text-foreground/60">
          Le lien est peut-être erroné, ou la page a été déplacée. Voici de quoi retrouver votre
          chemin.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
        <Link href="/produits" className="btn-secondary">
          Voir le catalogue
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/60">
        <Link href="/marques" className="hover:text-accent">
          Nos marques
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/blog" className="hover:text-accent">
          Blog
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/faq" className="hover:text-accent">
          FAQ
        </Link>
      </div>
    </div>
  );
}
