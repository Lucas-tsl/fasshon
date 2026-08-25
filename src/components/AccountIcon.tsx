import Link from "next/link";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.7 4.5-5.5 7.5-5.5s6.1 1.8 7.5 5.5" strokeLinecap="round" />
    </svg>
  );
}

export function AccountIcon({ connected }: { connected: boolean }) {
  return (
    <Link
      href={connected ? "/compte" : "/compte/connexion"}
      aria-label={connected ? "Mon compte" : "Connexion"}
      title={connected ? "Mon compte" : "Connexion"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
        connected
          ? "border-accent text-accent"
          : "border-border text-foreground/40 hover:border-foreground/60 hover:text-foreground/70"
      }`}
    >
      <UserIcon />
    </Link>
  );
}
