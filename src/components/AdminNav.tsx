import Link from "next/link";
import { logout } from "@/app/admin/actions";

export function AdminNav() {
  return (
    <header className="border-b border-border px-4 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <nav className="flex gap-4 text-sm">
          <Link href="/admin" className="hover:underline">
            Commandes
          </Link>
          <Link href="/admin/produits" className="hover:underline">
            Produits
          </Link>
        </nav>
        <form action={logout}>
          <button type="submit" className="text-sm text-foreground/60 hover:underline">
            Déconnexion
          </button>
        </form>
      </div>
    </header>
  );
}
