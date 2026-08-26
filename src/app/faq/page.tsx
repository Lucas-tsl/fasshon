import { Breadcrumb } from "@/components/Breadcrumb";
import { LegalPlaceholder as Placeholder } from "@/components/LegalPlaceholder";

export const metadata = {
  title: "FAQ",
  description: "Livraison, retours, paiement : les réponses aux questions les plus fréquentes sur Fasshon.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    question: "Quels sont les délais de livraison ?",
    answer: (
      <>
        Délais indicatifs : <Placeholder>[À COMPLÉTER]</Placeholder>. Vous recevez un
        email de confirmation dès l&apos;expédition de votre commande.
      </>
    ),
  },
  {
    question: "Quels sont les frais de livraison ?",
    answer: <>Frais de livraison : <Placeholder>[À COMPLÉTER]</Placeholder>.</>,
  },
  {
    question: "Puis-je retourner un produit ?",
    answer: (
      <>
        Oui, vous disposez de 14 jours après réception pour changer d&apos;avis
        (voir nos{" "}
        <a href="/cgv" className="underline">
          CGV
        </a>
        ).
      </>
    ),
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Le paiement se fait en ligne, de façon sécurisée, via carte bancaire.",
  },
  {
    question: "Les produits sont-ils vendus par Fasshon ou directement par les marques ?",
    answer:
      "Fasshon est un revendeur autorisé des marques présentes sur le site. Chaque commande est traitée par notre équipe.",
  },
  {
    question: "Comment vous contacter ?",
    answer: <>Par email à <Placeholder>[À COMPLÉTER]</Placeholder>.</>,
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <Breadcrumb items={[{ label: "FAQ" }]} />
      <h1 className="font-display text-3xl">Questions fréquentes</h1>

      <div className="flex flex-col divide-y divide-border">
        {FAQS.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
              {item.question}
              <span className="text-foreground/40 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
