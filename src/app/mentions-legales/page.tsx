import { Breadcrumb } from "@/components/Breadcrumb";
import { LegalPlaceholder as Placeholder } from "@/components/LegalPlaceholder";

export const metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <Breadcrumb items={[{ label: "Mentions légales" }]} />
      <h1 className="font-display text-3xl">Mentions légales</h1>

      <p className="rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm text-foreground/70">
        Cette page contient des informations à compléter avant toute mise en ligne
        publique du site. Les champs en surbrillance doivent être remplacés par les
        vraies informations de l&apos;entreprise.
      </p>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">Éditeur du site</h2>
        <p>
          Raison sociale : <Placeholder>[À COMPLÉTER]</Placeholder>
          <br />
          Forme juridique : <Placeholder>[À COMPLÉTER — ex. SASU, EI]</Placeholder>
          <br />
          Siège social : <Placeholder>[À COMPLÉTER]</Placeholder>
          <br />
          SIRET : <Placeholder>[À COMPLÉTER]</Placeholder>
          <br />
          Numéro de TVA intracommunautaire : <Placeholder>[À COMPLÉTER]</Placeholder>
          <br />
          Directeur de la publication : <Placeholder>[À COMPLÉTER]</Placeholder>
          <br />
          Contact : <Placeholder>[À COMPLÉTER — email]</Placeholder>
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">Hébergement</h2>
        <p>
          Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
          États-Unis.
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu de ce site (textes, visuels, logos) est la propriété
          de Fasshon ou de ses marques partenaires, sauf mention contraire. Toute
          reproduction sans autorisation est interdite.
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">Données personnelles</h2>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
          rectification et de suppression de vos données personnelles. Pour l&apos;exercer,
          contactez-nous à <Placeholder>[À COMPLÉTER — email]</Placeholder>.
        </p>
      </section>
    </div>
  );
}
