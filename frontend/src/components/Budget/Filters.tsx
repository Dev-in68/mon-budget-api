import { useId } from "react";
import { CATEGORIES } from "@/Types/budget";
import { Card, CardTitle } from "@/components/ui/Card";

type TypeFilter = "tous" | "revenu" | "depense";

type Props = {
  searchText: string;
  setSearchText: (v: string) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (v: TypeFilter) => void;
  catFilter: string;
  setCatFilter: (v: string) => void;
};

export function Filters({
  searchText,
  setSearchText,
  typeFilter,
  setTypeFilter,
  catFilter,
  setCatFilter,
}: Props) {
  const idSearch = useId();
  const idType = useId();
  const idCat = useId();

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card className="p-3 md:col-span-2">
        <CardTitle>Recherche</CardTitle>
        <label htmlFor={idSearch} className="sr-only">
          Recherche
        </label>
        <input
          id={idSearch}
          className="mt-2 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
          placeholder="Libellé, notes, catégorie…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Card>

      <Card className="p-3">
        <CardTitle>Type</CardTitle>
        <label htmlFor={idType} className="sr-only">
          Type
        </label>
        <select
          id={idType}
          className="mt-2 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
        >
          <option value="tous">Tous</option>
          <option value="revenu">Revenu</option>
          <option value="depense">Dépense</option>
        </select>
      </Card>

      <Card className="p-3">
        <CardTitle>Catégorie</CardTitle>
        <label htmlFor={idCat} className="sr-only">
          Catégorie
        </label>
        <select
          id={idCat}
          className="mt-2 w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option value="toutes">Toutes</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </Card>
    </div>
  );
}
