import { useMemo, useState } from "react";
import { KPICards } from "@/components/Budget/KPICards";
import { Filters } from "@/components/Budget/Filters";
import { TransactionsCard } from "@/components/Budget/transactions/TransactionsCard";
import { CashflowLine } from "@/components/Charts/CashflowLine";
import { RevenueExpenseBar } from "@/components/Charts/RevenueExpenseBar";
import { CATEGORIES } from "@/Types/budget";
import { useMonthlyData } from "@/Hooks/useMonthlyData";

export default function DashboardPage({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const { data, addTx, delTx } = useMonthlyData(year, month);

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<"tous" | "revenu" | "depense">(
    "tous",
  );
  const [catFilter, setCatFilter] = useState("toutes");

  const filtered = useMemo(() => {
    return data.transactions.filter((t) => {
      const okType = typeFilter === "tous" || t.type === typeFilter;
      const okCat = catFilter === "toutes" || t.categorie === catFilter;
      const okSearch =
        !searchText ||
        `${t.libelle} ${t.categorie} ${t.notes ?? ""}`
          .toLowerCase()
          .includes(searchText.toLowerCase());
      return okType && okCat && okSearch;
    });
  }, [data.transactions, typeFilter, catFilter, searchText]);

  const revenus = data.transactions
    .filter((t) => t.type === "revenu")
    .reduce((s, t) => s + t.montant, 0);
  const depenses = data.transactions
    .filter((t) => t.type === "depense")
    .reduce((s, t) => s + t.montant, 0);
  const solde = revenus - depenses;
  const tauxEpargne = revenus > 0 ? (solde / revenus) * 100 : 0;

  const lineData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of data.transactions)
      map.set(
        t.date,
        (map.get(t.date) ?? 0) + (t.type === "revenu" ? t.montant : -t.montant),
      );
    const days = new Date(year, month + 1, 0).getDate();
    let cumul = 0;
    const res: { date: string; cumul: number }[] = [];
    for (let d = 1; d <= days; d++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cumul += map.get(key) ?? 0;
      res.push({ date: String(d), cumul: Number(cumul.toFixed(2)) });
    }
    return res;
  }, [data.transactions, year, month]);

  const barData = useMemo(() => {
    const by: Record<string, { depenses: number; revenus: number }> = {};
    for (const t of data.transactions) {
      by[t.categorie] ||= { depenses: 0, revenus: 0 };
      by[t.categorie][t.type === "revenu" ? "revenus" : "depenses"] +=
        t.montant;
    }
    return Object.entries(by).map(([categorie, vals]) => ({
      categorie,
      ...vals,
    }));
  }, [data.transactions]);

  return (
    <>
      <KPICards
        revenus={revenus}
        depenses={depenses}
        solde={solde}
        tauxEpargne={tauxEpargne}
      />

      <Filters
        searchText={searchText}
        setSearchText={setSearchText}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        catFilter={catFilter}
        setCatFilter={setCatFilter}
      />

      <div className="grid gap-3 md:grid-cols-2">
        <RevenueExpenseBar data={barData} />
        <CashflowLine data={lineData} />
      </div>

      <TransactionsCard items={filtered} onAdd={addTx} onDelete={delTx} />

      <p className="pb-6 text-center text-[11px] text-white/80 md:text-xs">
        Vos données sont stockées localement dans votre navigateur
        (localStorage).
      </p>
    </>
  );
}
