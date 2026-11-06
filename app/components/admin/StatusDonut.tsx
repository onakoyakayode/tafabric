"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type Slice = { name: string; value: number; key: string };

const COLORS: Record<string, string> = {
  pending: "#a8a29e",
  awaiting: "#c53967",
  paid: "#22c55e",
  rest: "#3b82f6",
};

export default function StatusDonut({
  data,
  total,
}: {
  data: Slice[];
  total: number;
}) {
  const visible = data.filter((d) => d.value > 0);

  return (
    <div>
      <div className="relative w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={visible}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
            >
              {visible.map((d) => (
                <Cell key={d.key} fill={COLORS[d.key] ?? "#dadada"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #dadada",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-xs text-stone-500">orders</span>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        {data.map((d) => (
          <div
            key={d.key}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: COLORS[d.key] ?? "#dadada" }}
              />
              <span className="text-stone-600">{d.name}</span>
            </div>
            <span className="font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
