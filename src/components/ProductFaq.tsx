import { toJsonLd } from "@/lib/json-ld";

type Faq = { id: string; question: string; answer: string };

export function ProductFaq({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="flex flex-col gap-6 border-t border-border pt-6">
      <h2 className="font-display text-2xl">Questions fréquentes</h2>
      <dl className="flex flex-col gap-2">
        {faqs.map((faq) => (
          <details key={faq.id} className="group rounded-xl border border-border p-4">
            <summary className="cursor-pointer list-none text-sm font-medium marker:content-none">
              <span className="flex items-center justify-between gap-3">
                {faq.question}
                <span className="text-foreground/40 transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <dd className="mt-2 text-sm leading-relaxed text-foreground/70">{faq.answer}</dd>
          </details>
        ))}
      </dl>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }} />
    </div>
  );
}
