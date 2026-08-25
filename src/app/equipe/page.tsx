import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata = { title: "Notre équipe" };

export default function EquipePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <Breadcrumb items={[{ label: "Notre équipe" }]} />
      <h1 className="font-display text-3xl">Notre équipe</h1>
      <p className="text-sm leading-relaxed text-foreground/70">
        Fasshon est un concept store indépendant qui réunit une sélection de marques
        françaises pour vous faire découvrir le meilleur de la beauté, des soins
        naturels, du bien-être et des senteurs.
      </p>

      <div className="flex items-center gap-4 rounded-xl border border-border p-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted font-display text-xl">
          LT
        </div>
        <div>
          <p className="font-medium">Lucas Troteseil</p>
          <p className="text-sm text-foreground/60">Fondateur de Fasshon</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/70">
            Basé à Bordeaux, Lucas est chef de projet Data &amp; IA chez Groupe Novi et
            actuellement en Master Data et IA à Nexa Digital School. Passionné de
            développement web, il a lancé Fasshon pour réunir ses marques françaises
            préférées dans un seul concept store.
          </p>
          <a
            href="https://fr.linkedin.com/in/lucas-tsl"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-accent hover:underline"
          >
            Voir le profil LinkedIn ↗
          </a>
        </div>
      </div>
    </div>
  );
}
