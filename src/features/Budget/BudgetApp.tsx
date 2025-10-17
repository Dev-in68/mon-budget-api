import { useEffect, useMemo, useState } from "react";

import { Header } from "@/components/Budget/Header";
import { KPICards } from "@/components/Budget/KPICards";
import { Filters } from "@/components/Budget/Filters";
import { TransactionsCard } from "@/components/Budget/transactions/TransactionsCard";

import { CashflowLine } from "@/components/Charts/CashflowLine";
import { RevenueExpenseBar } from "@/components/Charts/RevenueExpenseBar";

import { storageKey, type MonthlyData, type Transaction } from "@/Types/budget";

const isBrowser = typeof window !== "undefined";
const today = new Date();

export default function BudgetApp() {
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<"tous" | "revenu" | "depense">(
    "tous",
  );
  const [catFilter, setCatFilter] = useState("toutes");

  const [data, setData] = useState<MonthlyData>({
    budgetMensuel: 0,
    transactions: [],
  });

  // ---- Simule ton utilisateur & actions de compte (remplace par ton auth réel) ----
  const userEmail = "anthony@orange.fr";
  const logout = () => {
    // TODO: déconnexion réelle
    console.log("logout");
  };
  const goChangePassword = () => {
    // TODO: ouvrir une modale ou router vers une page
    console.log("change password");
  };
  const handleSignOut = () => {
    // -> remplace par ton vrai logout
    localStorage.clear();
    window.location.reload();
  };
  const handleChangePassword = () => {
    // -> remplace par une navigation/modale vers la page Changer le mot de passe
    alert("Aller vers: /account/password (à brancher sur ton routeur)");
  };
  // -------------------------------------------------------------------------------

  // Load current month
  useEffect(() => {
    if (!isBrowser) return;
    const raw = localStorage.getItem(storageKey(year, month));
    setData(raw ? JSON.parse(raw) : { budgetMensuel: 0, transactions: [] });
  }, [year, month]);

  // Persist
  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem(storageKey(year, month), JSON.stringify(data));
  }, [data, year, month]);

  // CRUD
  const addTx = (tx: Omit<Transaction, "id">) => {
    const id =
      (crypto?.randomUUID && crypto.randomUUID()) ||
      Math.random().toString(36).slice(2);
    setData((d) => ({
      ...d,
      transactions: [{ id, ...tx }, ...d.transactions],
    }));
  };

  const delTx = (id: string) =>
    setData((d) => ({
      ...d,
      transactions: d.transactions.filter((t) => t.id !== id),
    }));

  const resetMonth = () =>
    setData({
      budgetMensuel: 0,
      transactions: [],
    });

  // Filters
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

  // Summary
  const summary = useMemo(() => {
    const revenus = data.transactions
      .filter((t) => t.type === "revenu")
      .reduce((s, t) => s + t.montant, 0);
    const depenses = data.transactions
      .filter((t) => t.type === "depense")
      .reduce((s, t) => s + t.montant, 0);
    const solde = revenus - depenses;
    const tauxEpargne = revenus > 0 ? (solde / revenus) * 100 : 0;
    return { revenus, depenses, solde, tauxEpargne };
  }, [data.transactions]);

  // Charts data
  const lineData = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of data.transactions) {
      map.set(
        t.date,
        (map.get(t.date) ?? 0) + (t.type === "revenu" ? t.montant : -t.montant),
      );
    }
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
    <div className="min-h-screen bg-[radial-gradient(1200px_700px_at_10%_-20%,#0ea5e933,transparent_60%),radial-gradient(1000px_600px_at_90%_-10%,#22d3ee22,transparent_60%),#0b1220] text-slate-100">
      <Header
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
      />

      {/* CONTENT */}
      <main className="mx-auto max-w-md space-y-4 px-4 py-4 md:max-w-3xl lg:max-w-6xl">
        {/* KPIs */}
        <KPICards
          revenus={summary.revenus}
          depenses={summary.depenses}
          solde={summary.solde}
          tauxEpargne={summary.tauxEpargne}
        />

        {/* Filtres */}
        <Filters
          searchText={searchText}
          setSearchText={setSearchText}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          catFilter={catFilter}
          setCatFilter={setCatFilter}
        />

        {/* Graphiques */}
        <div className="grid gap-3 md:grid-cols-2">
          <RevenueExpenseBar data={barData} />
          <CashflowLine data={lineData} />
        </div>

        {/* Transactions */}
        <TransactionsCard items={filtered} onAdd={addTx} onDelete={delTx} />

        <p className="pb-6 text-center text-[11px] text-white/80 md:text-xs">
          Vos données sont stockées localement dans votre navigateur
          (localStorage).
        </p>

        {/* (optionnel) Bouton réinitialiser le mois si tu le gardes */}
        {/* <div className="text-right">
          <button className="text-xs underline text-white/80" onClick={resetMonth}>
            Réinitialiser le mois
          </button>
        </div> */}
      </main>
    </div>
  );
}
