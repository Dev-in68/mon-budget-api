import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/Card";

type Point = { date: string; cumul: number };

export function CashflowLine({ data }: { data: Point[] }) {
  // Données sûres : filtre les points invalides, normalise et trie par date croissante
  const safeData = useMemo<Point[]>(() => {
    if (!Array.isArray(data)) return [];
    const cleaned = data
      .map((d) => ({
        date: String(d?.date ?? ""),
        cumul: Number.isFinite(d?.cumul as number) ? Number(d.cumul) : 0,
      }))
      .filter((d) => d.date !== "");
    // Tri numérique si "1..31", sinon lexicographique
    const isNumeric = cleaned.every((d) => /^\d+$/.test(d.date));
    cleaned.sort((a, b) =>
      isNumeric
        ? Number(a.date) - Number(b.date)
        : a.date.localeCompare(b.date),
    );
    return cleaned;
  }, [data]);

  const hasData = safeData.some((d) => d.cumul !== 0);

  return (
    <Card className="p-3">
      <CardTitle>Trésorerie cumulée</CardTitle>
      <div className="mt-2 h-36 md:h-64">
        {!hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
            Pas encore de données
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={safeData}
              margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
            >
              {/* axes masqués -> look épuré mobile */}
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
              <Line
                type="monotone"
                dataKey="cumul"
                strokeWidth={2}
                dot={false}
                stroke="#2563eb"
                isAnimationActive={false} // évite jank sur montées successives
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
