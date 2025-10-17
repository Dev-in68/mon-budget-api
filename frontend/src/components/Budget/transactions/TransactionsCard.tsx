import { useId, useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CATEGORIES, EURO, type Transaction } from "@/Types/budget";

type Props = {
  items: Transaction[];
  onDelete: (id: string) => void;
  onAdd: (tx: Omit<Transaction, "id">) => void;
};

export function TransactionsCard({ items, onDelete, onAdd }: Props) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<Omit<Transaction, "id">>({
    date: new Date().toISOString().slice(0, 10),
    type: "depense",
    categorie: "autre",
    libelle: "",
    montant: 0,
    notes: "",
  });

  // ids pour l’accessibilité
  const idDate = useId();
  const idType = useId();
  const idCat = useId();
  const idLib = useId();
  const idMnt = useId();
  const idNote = useId();

  // Parse sûr pour l’input number (évite NaN quand l’input est vide)
  const parseAmount = (v: string) => {
    const n = Number(v.replace(",", ".")); // supporte la virgule
    return Number.isFinite(n) ? n : 0;
  };

  const save = () => {
    if (!form.date || !form.libelle || !form.montant) return;
    onAdd({ ...form, montant: Math.abs(Number(form.montant)) });
    setOpen(false);
    setForm({ ...form, libelle: "", montant: 0 });
  };

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <CardTitle>Transactions</CardTitle>
        <Button onClick={() => setOpen((v) => !v)}>
          {open ? "Fermer" : "Ajouter"}
        </Button>
      </div>

      {open && (
        <div className="mt-3 grid grid-cols-1 gap-2 rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200 dark:bg-slate-900 dark:ring-white/10">
          <label htmlFor={idDate} className="sr-only">
            Date
          </label>
          <input
            id={idDate}
            type="date"
            className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={idType} className="sr-only">
                Type
              </label>
              <select
                id={idType}
                className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as "revenu" | "depense",
                  })
                }
              >
                <option value="revenu">Revenu</option>
                <option value="depense">Dépense</option>
              </select>
            </div>

            <div>
              <label htmlFor={idCat} className="sr-only">
                Catégorie
              </label>
              <select
                id={idCat}
                className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
                value={form.categorie}
                onChange={(e) =>
                  setForm({ ...form, categorie: e.target.value })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={idLib} className="sr-only">
              Libellé
            </label>
            <input
              id={idLib}
              className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
              placeholder="Libellé"
              value={form.libelle}
              onChange={(e) => setForm({ ...form, libelle: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor={idMnt} className="sr-only">
              Montant
            </label>
            <input
              id={idMnt}
              inputMode="decimal"
              type="number"
              step="0.01"
              className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
              placeholder="Montant"
              value={form.montant}
              onChange={(e) =>
                setForm({ ...form, montant: parseAmount(e.target.value) })
              }
            />
          </div>

          <div>
            <label htmlFor={idNote} className="sr-only">
              Notes
            </label>
            <input
              id={idNote}
              className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/10"
              placeholder="Notes (optionnel)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              className="h-10"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button className="h-10" onClick={save}>
              Enregistrer
            </Button>
          </div>
        </div>
      )}

      {/* Mobile/Tablet list */}
      <ul className="mt-3 divide-y divide-zinc-200 dark:divide-white/10 lg:hidden">
        {items.map((t) => (
          <li key={t.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                {t.libelle}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {new Date(t.date).toLocaleDateString("fr-FR")} ·{" "}
                {CATEGORIES.find((c) => c.id === t.categorie)?.label ??
                  t.categorie}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  t.type === "depense" ? "text-red-500" : "text-emerald-400"
                }`}
              >
                {t.type === "depense" ? "-" : "+"}
                {EURO.format(t.montant)}
              </p>
              <Button
                variant="soft"
                className="mt-1 h-7 px-2 text-xs"
                onClick={() => onDelete(t.id)}
              >
                Supprimer
              </Button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Aucune transaction.
          </li>
        )}
      </ul>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-white/10 text-left text-zinc-700 dark:text-zinc-300">
              <th className="w-28 py-2">Date</th>
              <th className="w-24 py-2">Type</th>
              <th className="py-2">Catégorie</th>
              <th className="py-2">Libellé</th>
              <th className="w-28 py-2 text-right">Montant</th>
              <th className="w-24" />
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr
                key={t.id}
                className="border-b border-zinc-200 dark:border-white/10"
              >
                <td className="py-2 text-zinc-900 dark:text-zinc-100">
                  {new Date(t.date).toLocaleDateString("fr-FR")}
                </td>
                <td className="py-2 text-zinc-900 dark:text-zinc-100">
                  {t.type}
                </td>
                <td className="py-2 text-zinc-900 dark:text-zinc-100">
                  {CATEGORIES.find((c) => c.id === t.categorie)?.label ??
                    t.categorie}
                </td>
                <td className="py-2 text-zinc-900 dark:text-zinc-100">
                  {t.libelle}
                </td>
                <td
                  className={`py-2 text-right ${
                    t.type === "depense" ? "text-red-500" : "text-emerald-400"
                  }`}
                >
                  {t.type === "depense" ? "-" : "+"}
                  {EURO.format(t.montant)}
                </td>
                <td className="text-right">
                  <Button variant="soft" onClick={() => onDelete(t.id)}>
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-zinc-500 dark:text-zinc-400"
                >
                  Aucune transaction.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
