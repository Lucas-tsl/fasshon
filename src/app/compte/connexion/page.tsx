import Link from "next/link";
import { login } from "../actions";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata = { title: "Connexion" };

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <Breadcrumb items={[{ label: "Mon compte", href: "/compte" }, { label: "Connexion" }]} />
      <h1 className="font-display text-3xl">Connexion</h1>
      <form action={login} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        {error ? <p className="text-sm text-red-600">Email ou mot de passe incorrect.</p> : null}
        <button type="submit" className="btn-primary">
          Se connecter
        </button>
      </form>
      <Link href="/compte/mot-de-passe-oublie" className="text-sm text-accent hover:underline">
        Mot de passe oublié ?
      </Link>
      <p className="text-sm text-foreground/60">
        Pas encore de compte ?{" "}
        <Link href="/compte/inscription" className="text-accent hover:underline">
          En créer un
        </Link>
      </p>
    </div>
  );
}
