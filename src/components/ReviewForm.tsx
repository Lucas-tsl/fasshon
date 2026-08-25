import { StarInput } from "./StarInput";
import { submitReview } from "@/app/produits/[slug]/review-actions";

export function ReviewForm({
  productId,
  productSlug,
  existingReview,
}: {
  productId: string;
  productSlug: string;
  existingReview?: { rating: number; comment: string } | null;
}) {
  return (
    <form action={submitReview} className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      <p className="text-sm font-medium">
        {existingReview ? "Modifier mon avis" : "Laisser un avis"}
      </p>
      <StarInput name="rating" defaultValue={existingReview?.rating ?? 5} />
      <textarea
        name="comment"
        required
        rows={3}
        defaultValue={existingReview?.comment}
        placeholder="Votre avis sur ce produit..."
        className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
      />
      <button type="submit" className="btn-primary w-fit">
        {existingReview ? "Mettre à jour" : "Publier mon avis"}
      </button>
    </form>
  );
}
