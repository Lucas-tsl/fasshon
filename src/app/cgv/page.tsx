import { Breadcrumb } from "@/components/Breadcrumb";
import { LegalPlaceholder as Placeholder } from "@/components/LegalPlaceholder";

export const metadata = { title: "Conditions générales de vente" };

export default function CgvPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <Breadcrumb items={[{ label: "CGV" }]} />
      <h1 className="text-2xl font-semibold">Conditions générales de vente</h1>

      <p className="rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm text-foreground/70">
        Trame à valider avant mise en ligne publique — les champs en surbrillance
        doivent être complétés ou confirmés avec vos vraies conditions commerciales.
      </p>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">1. Objet</h2>
        <p>
          Les présentes CGV régissent les ventes de produits effectuées sur le site
          Fasshon entre <Placeholder>[À COMPLÉTER — raison sociale]</Placeholder> et tout
          client (« le Client »).
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">2. Prix</h2>
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises (TTC). Fasshon se
          réserve le droit de modifier ses prix à tout moment, les produits étant
          facturés sur la base des tarifs en vigueur au moment de la validation de la
          commande.
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">3. Commande et paiement</h2>
        <p>
          Le paiement est sécurisé et géré par Stripe. La commande est validée dès
          confirmation du paiement.
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">4. Livraison</h2>
        <p>
          Délais et frais de livraison : <Placeholder>[À COMPLÉTER]</Placeholder>.
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">5. Droit de rétractation</h2>
        <p>
          Conformément à la loi, le Client dispose d&apos;un délai de 14 jours à
          compter de la réception de sa commande pour exercer son droit de
          rétractation, sans avoir à justifier de motif. Les frais de retour sont à la
          charge de <Placeholder>[À COMPLÉTER — client ou vendeur]</Placeholder>.
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">6. Garanties</h2>
        <p>
          Les produits vendus bénéficient de la garantie légale de conformité et de la
          garantie contre les vices cachés.
        </p>
      </section>

      <section className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/70">
        <h2 className="text-base font-medium text-foreground">7. Contact</h2>
        <p>
          Pour toute question relative à une commande :{" "}
          <Placeholder>[À COMPLÉTER — email]</Placeholder>.
        </p>
      </section>
    </div>
  );
}
