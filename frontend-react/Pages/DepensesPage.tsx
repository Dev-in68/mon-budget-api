import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EURO, CATEGORIES, storageKey, type MonthlyData } from "@/Types/budget";
import CategoryPie from "@/components/Charts/CategoryPie";

type Ctx = { month: number; year: number };

export default function DepensesPage() {
  const { month, year } = useOutletContext<Ctx>();

  const [data, setData] = useState<MonthlyData>({
    budgetMensuel: 0,
    transactions: [],
  });
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("toutes");

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(year, month));
    setData(raw ? JSON.parse(raw) : { budgetMensuel: 0, transactions: [] });
  }, [year, month]);

  const depenses = useMemo(
    () =>
      data.transactions.filter(
        (t) =>
          t.type === "depense" &&
          (cat === "toutes" || t.categorie === cat) &&
          (!search ||
            `${t.libelle} ${t.notes ?? ""} ${t.categorie}`
              .toLowerCase()
              .includes(search.toLowerCase())),
      ),
    [data.transactions, cat, search],
  );

  const total = useMemo(
    () => depenses.reduce((s, t) => s + t.montant, 0),
    [depenses],
  );

  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of depenses)
      map.set(t.categorie, (map.get(t.categorie) ?? 0) + t.montant);
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [depenses]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-3 md:col-span-2">
          <CardTitle>Total des dépenses</CardTitle>
          <p className="mt-1 text-2xl font-semibold kpi-neg">
            {EURO.format(total)}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Mois de{" "}
            {new Date(2000, month, 1).toLocaleDateString("fr-FR", {
              month: "long",
            })}{" "}
            {year}
          </p>
        </Card>

        <Card className="p-3">
          <CardTitle>Transactions</CardTitle>
          <p className="mt-1 text-2xl font-semibold text-zinc-100">
            {depenses.length}
          </p>
          <p className="text-xs text-zinc-400 mt-1">Dépenses</p>
        </Card>

        <Card className="p-3">
          <CardTitle>Ticket moyen</CardTitle>
          <p className="mt-1 text-2xl font-semibold text-zinc-100">
            {EURO.format(depenses.length ? total / depenses.length : 0)}
          </p>
          <p className="text-xs text-zinc-400 mt-1">par transaction</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-3 md:col-span-2">
          <CardTitle>Recherche</CardTitle>
          <input
            className="mt-2 w-full rounded-xl border-0 bg:white/10 bg-white/10 px-3 py-2 text-sm text-zinc-100 ring-1 ring-white/15 focus:ring-2 focus:ring-cyan-400 placeholder:text-zinc-400"
            placeholder="Libellé, notes, catégorie…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Card>

        <Card className="p-3">
          <CardTitle>Catégorie</CardTitle>
          <select
            className="mt-2 w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-zinc-100 ring-1 ring-white/15 focus:ring-2 focus:ring-cyan-400"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            <option value="toutes">Toutes</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Card>

        <Card className="p-3">
          <CardTitle>Actions</CardTitle>
          <div className="mt-2 flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setSearch("");
                setCat("toutes");
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-3">
        <CardTitle>Répartition par catégorie</CardTitle>
        <div className="mt-2 h-72 md:h-80">
          <CategoryPie data={pieData} />
        </div>
      </Card>

      <Card className="p-3">
        <CardTitle>Dépenses</CardTitle>

        <ul className="mt-3 divide-y divide-white/10 lg:hidden">
          {depenses.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-[13px] font-medium text-zinc-100">
                  {t.libelle}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {new Date(t.date).toLocaleDateString("fr-FR")} ·{" "}
                  {CATEGORIES.find((c) => c.id === t.categorie)?.label ??
                    t.categorie}
                </p>
              </div>
              <p className="text-sm font-semibold kpi-neg">
                {EURO.format(t.montant)}
              </p>
            </li>
          ))}
          {depenses.length === 0 && (
            <li className="py-8 text-center text-sm text-zinc-400">
              Aucune dépense.
            </li>
          )}
        </ul>

        <div className="hidden lg:block overflow-x-auto">
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-zinc-300">
                <th className="w-28 py-2">Date</th>
                <th className="py-2">Catégorie</th>
                <th className="py-2">Libellé</th>
                <th className="w-28 py-2 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {depenses.map((t) => (
                <tr key={t.id} className="border-b border-white/10">
                  <td className="py-2">
                    {new Date(t.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-2">
                    {CATEGORIES.find((c) => c.id === t.categorie)?.label ??
                      t.categorie}
                  </td>
                  <td className="py-2">{t.libelle}</td>
                  <td className="py-2 text-right kpi-neg">
                    {EURO.format(t.montant)}
                  </td>
                </tr>
              ))}
              {depenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-400">
                    Aucune dépense.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
