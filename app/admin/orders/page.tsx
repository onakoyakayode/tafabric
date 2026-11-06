export const instant = false;

import { db } from "@/lib/db";
import Link from "next/link";
import {
  Eye,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  PlusCircle,
  Inbox,
} from "lucide-react";
import OrderSearch from "@/app/components/admin/OrderSearch";
import DeleteOrderButton from "@/app/components/admin/DeleteOrderButton";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const where: any = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { orderId: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
    ];
  }

  const [orders, allCounts] = await Promise.all([
    db.order.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { createdAt: "desc" },
    }),
    db.order.groupBy({ by: ["status"], _count: true }),
  ]);

  const countBy = (s: string) =>
    allCounts.find((c) => c.status === s)?._count ?? 0;
  const totalCount = allCounts.reduce((sum, c) => sum + c._count, 0);

  const filters = [
    { value: "", label: "All", icon: Inbox, count: totalCount },
    {
      value: "PENDING_PAYMENT",
      label: "Pending",
      icon: Clock,
      count: countBy("PENDING_PAYMENT"),
    },
    {
      value: "PAYMENT_SUBMITTED",
      label: "Awaiting",
      icon: PlusCircle,
      count: countBy("PAYMENT_SUBMITTED"),
    },
    {
      value: "PAID",
      label: "Paid",
      icon: CheckCircle2,
      count: countBy("PAID"),
    },
    {
      value: "PROCESSING",
      label: "Processing",
      icon: Package,
      count: countBy("PROCESSING"),
    },
    {
      value: "SHIPPED",
      label: "Shipped",
      icon: Truck,
      count: countBy("SHIPPED"),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-stone-500 mt-1">
          Manage incoming orders and payment confirmations
        </p>
      </div>

      {/* Filter tabs with counts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => {
          const active = (status ?? "") === f.value;
          const params = new URLSearchParams();
          if (f.value) params.set("status", f.value);
          if (q) params.set("q", q);
          const href = params.toString()
            ? `/admin/orders?${params.toString()}`
            : "/admin/orders";
          const Icon = f.icon;
          return (
            <Link
              key={f.value || "all"}
              href={href}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm transition-all ${
                active
                  ? "bg-ink text-white border-ink"
                  : "bg-white border-ash text-stone-600 hover:border-ink"
              }`}
            >
              <Icon
                size={14}
                className={
                  active ? "text-rose" : "text-stone-400 group-hover:text-rose"
                }
              />
              <span>{f.label}</span>
              <span
                className={`ml-0.5 text-xs px-1.5 py-0.5 rounded-full ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-ash-light text-stone-500"
                }`}
              >
                {f.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Search bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <OrderSearch />
        <p className="text-sm text-stone-500 hidden sm:block">
          {orders.length} {orders.length === 1 ? "result" : "results"}
          {q && ` for "${q}"`}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-ash overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ash-light border-b border-ash">
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider text-stone-500">
                  Order
                </th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider text-stone-500">
                  Customer
                </th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider text-stone-500">
                  Date
                </th>
                <th className="text-right p-4 font-medium text-xs uppercase tracking-wider text-stone-500">
                  Total
                </th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider text-stone-500">
                  Status
                </th>
                <th className="p-4 w-24" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
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
                      year: "numeric",
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
                  <td className="p-4">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/orders/${o.orderId}`}
                        className="p-2 rounded-full text-stone-500 hover:bg-rose hover:text-white transition-colors"
                        title="View order"
                      >
                        <Eye size={16} />
                      </Link>
                      <DeleteOrderButton orderId={o.orderId} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ash-light mb-3">
              <Inbox size={20} className="text-stone-400" />
            </div>
            <p className="text-sm text-stone-500">
              {q ? `No orders match "${q}"` : "No orders yet"}
            </p>
            {(q || status) && (
              <Link
                href="/admin/orders"
                className="inline-block mt-2 text-rose text-sm hover:underline"
              >
                Clear filters
              </Link>
            )}
          </div>
        )}
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
