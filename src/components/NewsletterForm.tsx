"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-sm text-accent">Merci ! Vérifiez votre boîte mail 🎉</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        className="min-w-0 flex-1 rounded-md border border-border bg-transparent px-4 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary shrink-0 !px-5 !py-2"
      >
        {status === "loading" ? "…" : "S'inscrire"}
      </button>
      {status === "error" ? (
        <p className="absolute mt-12 text-xs text-red-600">Une erreur est survenue.</p>
      ) : null}
    </form>
  );
}
