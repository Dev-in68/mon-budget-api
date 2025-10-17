import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

type Row = { categorie: string; revenus: number; depenses: number };

export default function CompareBar({ data }: { data: Row[] }) {
  // Données sûres: agrège par catégorie, filtre les valeurs invalides, clamp min 0
  const safeData = useMemo<Row[]>(() => {
    if (!Array.isArray(data)) return [];
    const map = new Map<string, { revenus: number; depenses: number }>();
    for (const it of data) {
      const cat = String(it?.categorie ?? "").trim();
      const rev = Number.isFinite(it?.revenus)
        ? Math.max(0, Number(it.revenus))
        : 0;
      const dep = Number.isFinite(it?.depenses)
        ? Math.max(0, Number(it.depenses))
        : 0;
      if (!cat) continue;
      const prev = map.get(cat) ?? { revenus: 0, depenses: 0 };
      map.set(cat, {
        revenus: prev.revenus + rev,
        depenses: prev.depenses + dep,
      });
    }
    // Tri par total décroissant
    const arr = Array.from(map, ([categorie, v]) => ({ categorie, ...v }));
    arr.sort((a, b) => b.revenus + b.depenses - (a.revenus + a.depenses));
    return arr;
  }, [data]);

  const hasData = safeData.some((d) => d.revenus > 0 || d.depenses > 0);

  return (
    <div className="h-60 md:h-80">
      {!hasData ? (
        <div className="flex h-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
          Pas encore de données
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={safeData} barCategoryGap={16}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
            <XAxis dataKey="categorie" tickMargin={8} />
            <YAxis />
            <Legend />
            {/* Pas de <Tooltip /> pour éviter les crashes */}
            <Bar
              dataKey="revenus"
              name="Revenus"
              fill="#60a5fa"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="depenses"
              name="Dépenses"
              fill="#1d4ed8"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
