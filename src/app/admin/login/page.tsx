import { login } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-24">
      <h1 className="text-xl font-semibold">Connexion admin</h1>
      <form action={login} className="flex flex-col gap-3">
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        {error ? <p className="text-sm text-red-600">Mot de passe incorrect.</p> : null}
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
