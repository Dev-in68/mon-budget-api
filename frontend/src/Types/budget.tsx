export type Transaction = {
  id: string;
  date: string;
  type: "revenu" | "depense";
  categorie: string;
  libelle: string;
  montant: number;
  notes?: string;
};

export type MonthlyData = {
  budgetMensuel: number;
  transactions: Transaction[];
};

export const EURO = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export const CATEGORIES = [
  { id: "logement", label: "Logement" },
  { id: "courses", label: "Courses" },
  { id: "transport", label: "Transport" },
  { id: "sante", label: "Santé" },
  { id: "loisirs", label: "Loisirs" },
  { id: "resto", label: "Restaurants" },
  { id: "abonnements", label: "Abonnements" },
  { id: "voyage", label: "Voyage" },
  { id: "autre", label: "Autre" },
] as const;

export const storageKey = (y: number, m: number) =>
  `budget-app:${y}-${String(m + 1).padStart(2, "0")}`;
