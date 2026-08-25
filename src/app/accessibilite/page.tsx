import { Breadcrumb } from "@/components/Breadcrumb";
import { LegalPlaceholder as Placeholder } from "@/components/LegalPlaceholder";

export const metadata = { title: "Accessibilité" };

export default function AccessibilitePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <Breadcrumb items={[{ label: "Accessibilité" }]} />
      <h1 className="font-display text-3xl">Déclaration d&apos;accessibilité</h1>

      <p className="rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm text-foreground/70">
        Trame conforme au RGAA (Référentiel Général d&apos;Amélioration de
        l&apos;Accessibilité), à finaliser une fois un audit d&apos;accessibilité réalisé.
        Ne pas publier tel quel sans avoir vérifié l&apos;état de conformité réel du site.
      </p>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">État de conformité</h2>
        <p>
          Fasshon s&apos;engage à rendre son site accessible conformément à
          l&apos;article 47 de la loi n° 2005-102 du 11 février 2005. Cette page fait
          état de la conformité de Fasshon avec le RGAA.
        </p>
        <p>
          Fasshon est en cours d&apos;évaluation d&apos;accessibilité et n&apos;a pas
          encore réalisé d&apos;audit selon la méthodologie officielle. Le taux de
          conformité sera indiqué ici une fois l&apos;audit effectué :{" "}
          <Placeholder>[À COMPLÉTER — % de conformité RGAA]</Placeholder>.
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">
          Établissement de cette déclaration
        </h2>
        <p>
          Cette déclaration a été établie le <Placeholder>[À COMPLÉTER — date]</Placeholder>.
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">
          Retour d&apos;information et contact
        </h2>
        <p>
          Si vous n&apos;arrivez pas à accéder à un contenu ou à un service, vous pouvez
          contacter le responsable du site pour être orienté vers une alternative
          accessible ou obtenir le contenu sous une autre forme :{" "}
          <Placeholder>[À COMPLÉTER — email de contact]</Placeholder>.
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">Voies de recours</h2>
        <p>
          Si vous constatez un défaut d&apos;accessibilité vous empêchant d&apos;accéder à
          un contenu et que vous n&apos;obtenez pas de réponse satisfaisante, vous êtes
          en droit de faire parvenir vos doléances ou une demande de saisine au
          Défenseur des droits.
        </p>
      </section>
    </div>
  );
}
