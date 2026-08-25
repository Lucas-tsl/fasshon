import { Breadcrumb } from "@/components/Breadcrumb";
import { LegalPlaceholder as Placeholder } from "@/components/LegalPlaceholder";

export const metadata = { title: "Notre équipe" };

export default function EquipePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <Breadcrumb items={[{ label: "Notre équipe" }]} />
      <h1 className="text-2xl font-semibold">Notre équipe</h1>
      <p className="text-sm leading-relaxed text-foreground/70">
        Fasshon est un concept store indépendant qui réunit une sélection de marques
        françaises pour vous faire découvrir le meilleur de la beauté, des soins
        naturels, du bien-être et des senteurs.
      </p>

      <div className="flex items-center gap-4 rounded-xl border border-border p-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-medium">
          <Placeholder>?</Placeholder>
        </div>
        <div>
          <p className="font-medium">
            <Placeholder>[À COMPLÉTER — votre nom]</Placeholder>
          </p>
          <p className="text-sm text-foreground/60">Fondateur·rice de Fasshon</p>
        </div>
      </div>

      <p className="text-xs text-foreground/50">
        Cette page est un point de départ — ajoutez les vraies informations sur vous et
        votre équipe quand vous le souhaitez.
      </p>
    </div>
  );
}
