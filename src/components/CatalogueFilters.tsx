"use client";

import { useRouter } from "next/navigation";

type Option = { value: string; label: string };

function buildHref(next: { categorie?: string; marque?: string; type?: string }): string {
  const params = new URLSearchParams();
  if (next.categorie) params.set("categorie", next.categorie);
  if (next.marque) params.set("marque", next.marque);
  if (next.type) params.set("type", next.type);
  const qs = params.toString();
  return qs ? `/produits?${qs}` : "/produits";
}

function FilterSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
}: {
  label: string;
  value: string;
  allLabel: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-foreground/50">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CatalogueFilters({
  categories,
  brands,
  availableTypes,
  categorie,
  marque,
  type,
}: {
  categories: Option[];
  brands: Option[];
  availableTypes: Option[];
  categorie?: string;
  marque?: string;
  type?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-3">
      <FilterSelect
        label="Catégorie"
        value={categorie ?? ""}
        allLabel="Toutes les catégories"
        options={categories}
        onChange={(v) => router.push(buildHref({ categorie: v || undefined, marque, type }))}
      />
      <FilterSelect
        label="Marque"
        value={marque ?? ""}
        allLabel="Toutes les marques"
        options={brands}
        onChange={(v) => router.push(buildHref({ categorie, marque: v || undefined, type }))}
      />
      {availableTypes.length > 1 ? (
        <FilterSelect
          label="Type"
          value={type ?? ""}
          allLabel="Tous les types"
          options={availableTypes}
          onChange={(v) => router.push(buildHref({ categorie, marque, type: v || undefined }))}
        />
      ) : null}
    </div>
  );
}
