import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";
import type { PieLabelRenderProps } from "recharts";

const COLORS = [
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#1d4ed8",
  "#0ea5e9",
  "#38bdf8",
  "#0284c7",
];

export default function CategoryPie({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  if (!data?.length) {
    return (
      <div className="h-80 flex items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Pas encore de données
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  const renderLabel = (entry: PieLabelRenderProps) => {
    const pct = (Number(entry.value) / total) * 100;
    // On n’affiche le label que si la part ≥ 6%
    return pct >= 6 ? `${entry.name} ${pct.toFixed(0)}%` : "";
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            label={renderLabel}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
