import Link from "next/link";
import { resetPassword } from "../actions";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata = { title: "Réinitialiser le mot de passe" };

const ERRORS: Record<string, string> = {
  password: "Le mot de passe doit contenir au moins 8 caractères.",
  invalid: "Ce lien de réinitialisation est invalide ou a expiré.",
};

export default async function ReinitialiserPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
        <Breadcrumb items={[{ label: "Mon compte", href: "/compte" }, { label: "Réinitialiser" }]} />
        <h1 className="font-display text-3xl">Lien invalide</h1>
        <p className="text-sm text-foreground/60">
          Ce lien de réinitialisation est incomplet.{" "}
          <Link href="/compte/mot-de-passe-oublie" className="text-accent hover:underline">
            Demander un nouveau lien
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <Breadcrumb items={[{ label: "Mon compte", href: "/compte" }, { label: "Réinitialiser" }]} />
      <h1 className="font-display text-3xl">Nouveau mot de passe</h1>
      <form action={resetPassword} className="flex flex-col gap-3">
        <input type="hidden" name="token" value={token} />
        <input
          type="password"
          name="password"
          placeholder="Nouveau mot de passe (8 caractères minimum)"
          required
          minLength={8}
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        {error ? (
          <p className="text-sm text-red-600">{ERRORS[error] ?? "Une erreur est survenue."}</p>
        ) : null}
        <button type="submit" className="btn-primary">
          Réinitialiser mon mot de passe
        </button>
      </form>
      {error === "invalid" ? (
        <Link href="/compte/mot-de-passe-oublie" className="text-sm text-accent hover:underline">
          Demander un nouveau lien
        </Link>
      ) : null}
    </div>
  );
}
