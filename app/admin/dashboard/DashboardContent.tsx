export const instant = false;

import { db } from "@/lib/db";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import RevenueChart from "@/app/components/admin/RevenueChart";
import StatusDonut from "@/app/components/admin/StatusDonut";

export default async function Dashboard() {
  // Counts
  const [total, pending, submitted, paid] = await Promise.all([
    db.order.count(),
    db.order.count({ where: { status: "PENDING_PAYMENT" } }),
    db.order.count({ where: { status: "PAYMENT_SUBMITTED" } }),
    db.order.count({ where: { status: "PAID" } }),
  ]);

  // Revenue (paid only)
  const paidRevenue = await db.order.aggregate({
    where: { status: { in: ["PAID", "PROCESSING", "SHIPPED"] } },
    _sum: { totalAmount: true },
  });

  // Last 14 days — daily order counts and revenue
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const recentOrdersForChart = await db.order.findMany({
    where: { createdAt: { gte: fourteenDaysAgo } },
    select: { createdAt: true, totalAmount: true, status: true },
    orderBy: { createdAt: "asc" },
  });

  const daily = new Map<string, { count: number; revenue: number }>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    daily.set(key, { count: 0, revenue: 0 });
  }
  for (const o of recentOrdersForChart) {
    const key = o.createdAt.toISOString().slice(0, 10);
    const entry = daily.get(key);
    if (entry) {
      entry.count += 1;
      if (["PAID", "PROCESSING", "SHIPPED"].includes(o.status)) {
        entry.revenue += Number(o.totalAmount);
      }
    }
  }
  const chartData = Array.from(daily.entries()).map(([date, v]) => ({
    date: date.slice(5), // "MM-DD"
    orders: v.count,
    revenue: v.revenue,
  }));

  // Status breakdown for donut
  const statusBreakdown = [
    { name: "Pending", value: pending, key: "pending" },
    { name: "Awaiting", value: submitted, key: "awaiting" },
    { name: "Paid", value: paid, key: "paid" },
    {
      name: "Processing / Shipped",
      value: Math.max(0, total - pending - submitted - paid),
      key: "rest",
    },
  ];

  const recent = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const cards = [
    {
      label: "Total orders",
      value: total,
      icon: ShoppingBag,
      color: "text-ink",
      bg: "bg-ash-light",
    },
    {
      label: "Pending payment",
      value: pending,
      icon: Clock,
      color: "text-stone-700",
      bg: "bg-stone-100",
    },
    {
      label: "Awaiting confirmation",
      value: submitted,
      icon: AlertCircle,
      color: "text-rose",
      bg: "bg-rose-soft",
      highlight: submitted > 0,
    },
    {
      label: "Paid orders",
      value: paid,
      icon: CheckCircle2,
      color: "text-green-700",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-stone-500 mt-1">
          Overview of your store — orders, revenue and recent activity
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={`p-5 rounded-2xl border transition-shadow hover:shadow-sm ${
                c.highlight
                  ? "bg-rose-soft border-rose/30"
                  : "bg-white border-ash"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-stone-500">
                  {c.label}
                </p>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg}`}
                >
                  <Icon size={16} className={c.color} />
                </div>
              </div>
              <p className="text-2xl font-bold">{c.value}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue highlight */}
      <div className="bg-white border border-ash rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-500 mb-2">
              Total revenue (paid)
            </p>
            <p className="text-3xl font-bold">
              CAD {Number(paidRevenue._sum.totalAmount ?? 0).toLocaleString()}
            </p>
            <p className="text-sm text-stone-500 mt-1 flex items-center gap-1">
              <TrendingUp size={14} className="text-green-600" />
              From confirmed payments
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <DollarSign size={20} className="text-green-700" />
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-ash rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg">Last 14 days</h2>
              <p className="text-xs text-stone-500">Orders and revenue</p>
            </div>
          </div>
          <RevenueChart data={chartData} />
        </div>

        <div className="bg-white border border-ash rounded-2xl p-6">
          <h2 className="font-display text-lg mb-1">Status breakdown</h2>
          <p className="text-xs text-stone-500 mb-4">
            Where orders stand today
          </p>
          <StatusDonut data={statusBreakdown} total={total} />
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display text-lg">Recent orders</h2>
            <p className="text-xs text-stone-500">Latest 6 orders</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm text-rose hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-ash overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ash-light border-b border-ash">
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Order
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Customer
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Date
                  </th>
                  <th className="text-right p-4 text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Total
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-stone-500 font-medium">
                    Status
                  </th>
                  <th className="p-4 w-16" />
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-ash hover:bg-ash-light/40 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-xs bg-ash-light px-2 py-1 rounded">
                        {o.orderId}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{o.customerName}</div>
                      <div className="text-xs text-stone-500">
                        {o.customerEmail}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-stone-600">
                      {o.createdAt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-right font-medium">
                      CAD {Number(o.totalAmount).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${o.orderId}`}
                        className="text-rose text-xs hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recent.length === 0 && (
            <p className="p-10 text-center text-stone-500 text-sm">
              No orders yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING_PAYMENT: "bg-stone-100 text-stone-700",
    PAYMENT_SUBMITTED: "bg-rose text-white",
    PAID: "bg-green-100 text-green-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
  };
  const labels: Record<string, string> = {
    PENDING_PAYMENT: "Pending",
    PAYMENT_SUBMITTED: "Awaiting",
    PAID: "Paid",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
  };
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-ash-light text-stone-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}
