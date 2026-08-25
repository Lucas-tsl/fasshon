import Link from "next/link";
import { signup } from "../actions";
import { Breadcrumb } from "@/components/Breadcrumb";

const ERRORS: Record<string, string> = {
  email: "Adresse email invalide.",
  password: "Le mot de passe doit contenir au moins 8 caractères.",
  exists: "Un compte existe déjà avec cet email.",
};

export const metadata = { title: "Créer un compte" };

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <Breadcrumb items={[{ label: "Mon compte", href: "/compte" }, { label: "Créer un compte" }]} />
      <h1 className="font-display text-3xl">Créer un compte</h1>
      <form action={signup} className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          placeholder="Prénom (optionnel)"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
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
          placeholder="Mot de passe (8 caractères minimum)"
          required
          minLength={8}
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        {error ? (
          <p className="text-sm text-red-600">{ERRORS[error] ?? "Une erreur est survenue."}</p>
        ) : null}
        <button type="submit" className="btn-primary">
          Créer mon compte
        </button>
      </form>
      <p className="text-sm text-foreground/60">
        Déjà un compte ?{" "}
        <Link href="/compte/connexion" className="text-accent hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
