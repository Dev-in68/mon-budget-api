// src/hooks/useMonthlyData.ts
import { useEffect, useState } from "react";
import type { MonthlyData, Transaction } from "@/Types/budget";
import { storageKey } from "@/Types/budget";

const isBrowser = typeof window !== "undefined";

export function useMonthlyData(year: number, month: number) {
  const [data, setData] = useState<MonthlyData>({
    budgetMensuel: 0,
    transactions: [],
  });

  useEffect(() => {
    if (!isBrowser) return;
    const raw = localStorage.getItem(storageKey(year, month));
    setData(raw ? JSON.parse(raw) : { budgetMensuel: 0, transactions: [] });
  }, [year, month]);

  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem(storageKey(year, month), JSON.stringify(data));
  }, [data, year, month]);

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

  return { data, setData, addTx, delTx };
}
