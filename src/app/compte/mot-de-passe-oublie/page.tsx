import Link from "next/link";
import { requestPasswordReset } from "../actions";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata = { title: "Mot de passe oublié" };

export default async function MotDePasseOubliePage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <Breadcrumb
        items={[{ label: "Mon compte", href: "/compte" }, { label: "Mot de passe oublié" }]}
      />
      <h1 className="font-display text-3xl">Mot de passe oublié</h1>

      {sent ? (
        <p className="text-sm text-foreground/70">
          Si un compte existe avec cette adresse, un email contenant un lien de réinitialisation
          vient de vous être envoyé.
        </p>
      ) : (
        <form action={requestPasswordReset} className="flex flex-col gap-3">
          <p className="text-sm text-foreground/60">
            Indiquez votre email, nous vous envoyons un lien pour choisir un nouveau mot de passe.
          </p>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          />
          <button type="submit" className="btn-primary">
            Envoyer le lien
          </button>
        </form>
      )}

      <Link href="/compte/connexion" className="text-sm text-accent hover:underline">
        Retour à la connexion
      </Link>
    </div>
  );
}
