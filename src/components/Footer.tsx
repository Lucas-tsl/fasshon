import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
          <span className="text-lg font-semibold tracking-tight">Fasshon</span>
          <p className="text-sm text-foreground/60">
            Concept store multi-marques — beauté, soins naturels, bien-être et senteurs.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h3 className="font-medium text-foreground/80">Boutique</h3>
          <Link href="/produits" className="text-foreground/60 hover:text-accent">
            Catalogue
          </Link>
          <Link href="/marques" className="text-foreground/60 hover:text-accent">
            Nos marques
          </Link>
          <Link href="/panier" className="text-foreground/60 hover:text-accent">
            Panier
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h3 className="font-medium text-foreground/80">Aide</h3>
          <Link href="/faq" className="text-foreground/60 hover:text-accent">
            FAQ
          </Link>
          <Link href="/equipe" className="text-foreground/60 hover:text-accent">
            Notre équipe
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h3 className="font-medium text-foreground/80">Légal</h3>
          <Link href="/mentions-legales" className="text-foreground/60 hover:text-accent">
            Mentions légales
          </Link>
          <Link href="/cgv" className="text-foreground/60 hover:text-accent">
            CGV
          </Link>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 text-center text-xs text-foreground/40">
        © {new Date().getFullYear()} Fasshon. Tous droits réservés.
      </div>
    </footer>
  );
}
