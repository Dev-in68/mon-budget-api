import { EURO } from "@/Types/budget";
import { Card, CardTitle } from "@/components/ui/Card";

type Props = {
  revenus: number;
  depenses: number;
  solde: number;
  tauxEpargne: number;
};

export function KPICards({
  revenus = 0,
  depenses = 0,
  solde = 0,
  tauxEpargne = 0,
}: Props) {
  // clamp & format du taux (0–100)
  const taux = Math.max(
    0,
    Math.min(100, Number.isFinite(tauxEpargne) ? tauxEpargne : 0),
  );

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card className="p-3" aria-label="Revenus">
        <CardTitle>Revenus</CardTitle>
        <p
          className={`mt-1 text-2xl font-semibold ${solde >= 0 ? "kpi-pos" : "kpi-neg"}`}
        >
          {EURO.format(solde)}
        </p>
      </Card>

      <Card className="p-3" aria-label="Dépenses">
        <CardTitle>Dépenses</CardTitle>
        <p
          className={`mt-1 text-2xl font-semibold ${solde >= 0 ? "kpi-pos" : "kpi-neg"}`}
        >
          {EURO.format(solde)}
        </p>
      </Card>

      <Card className="p-3" aria-label="Solde">
        <CardTitle>Solde</CardTitle>
        <p
          className={`mt-1 text-2xl font-semibold ${solde >= 0 ? "kpi-pos" : "kpi-neg"}`}
        >
          {EURO.format(solde)}
        </p>
      </Card>

      <Card className="p-3" aria-label="Taux d'épargne">
        <CardTitle>Taux d'épargne</CardTitle>
        <p
          className={`mt-1 text-2xl font-semibold ${solde >= 0 ? "kpi-pos" : "kpi-neg"}`}
        >
          {EURO.format(solde)}
        </p>
      </Card>
    </div>
  );
}
