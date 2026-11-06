"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Point = { date: string; orders: number; revenue: number };

export default function RevenueChart({ data }: { data: Point[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c53967" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#c53967" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#dadada"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#78716c" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#78716c" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #dadada",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const amount = Number(value ?? 0);
              return name === "revenue"
                ? [`CAD ${amount.toLocaleString()}`, "Revenue"]
                : [amount, "Orders"];
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#c53967"
            strokeWidth={2}
            fill="url(#revenueFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
