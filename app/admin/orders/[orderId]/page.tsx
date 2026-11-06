export const instant = false;

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Package,
  Truck,
} from "lucide-react";
import ConfirmPaymentButton from "@/app/components/admin/ConfirmPaymentButton";
import StatusSelect from "@/app/components/admin/StatusSelect";

const STATUS_STEPS = [
  { key: "PENDING_PAYMENT", label: "Order placed", icon: Package },
  { key: "PAYMENT_SUBMITTED", label: "Payment notified", icon: Clock },
  { key: "PAID", label: "Payment confirmed", icon: CheckCircle2 },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
] as const;

const STATUS_ORDER = STATUS_STEPS.map((s) => s.key);

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await db.order.findUnique({
    where: { orderId },
    include: { items: true },
  });
  if (!order) notFound();

  const currentIndex = STATUS_ORDER.indexOf(order.status as any);
  const itemsTotal = order.items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-rose mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Back to orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3 flex-wrap">
              Order
              <span className="font-mono text-base bg-ash-light px-3 py-1 rounded-lg font-normal">
                {order.orderId}
              </span>
            </h1>
            <p className="text-sm text-stone-500 mt-1 flex items-center gap-1.5">
              <Calendar size={13} />
              Placed{" "}
              {order.createdAt.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Progress timeline */}
      <div className="bg-white border border-ash rounded-2xl p-6">
        <h2 className="text-xs uppercase tracking-wider text-stone-500 font-medium mb-5">
          Order progress
        </h2>
        <div className="relative">
          {/* Track line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-ash" />
          <div
            className="absolute top-5 left-5 h-0.5 bg-rose transition-all"
            style={{
              width: `calc((100% - 2.5rem) * ${Math.max(0, currentIndex) / (STATUS_STEPS.length - 1)})`,
            }}
          />

          <div className="relative grid grid-cols-5 gap-2">
            {STATUS_STEPS.map((step, idx) => {
              const reached = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      reached
                        ? "bg-rose border-rose text-white"
                        : "bg-white border-ash text-stone-400"
                    } ${isCurrent ? "ring-4 ring-rose/15" : ""}`}
                  >
                    <Icon size={16} />
                  </div>
                  <p
                    className={`text-xs mt-2 leading-tight ${
                      reached ? "text-ink font-medium" : "text-stone-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {(order.submittedAt || order.paidAt) && (
          <div className="mt-6 pt-4 border-t border-ash grid sm:grid-cols-2 gap-3 text-xs text-stone-500">
            {order.submittedAt && (
              <p>
                <span className="font-medium text-stone-700">
                  Payment notified:
                </span>{" "}
                {order.submittedAt.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
            {order.paidAt && (
              <p>
                <span className="font-medium text-stone-700">
                  Payment confirmed:
                </span>{" "}
                {order.paidAt.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Two-column content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer card */}
          <div className="bg-white border border-ash rounded-2xl p-6">
            <h2 className="font-display text-lg mb-4">Customer</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-ash-light flex items-center justify-center shrink-0">
                  <User size={14} className="text-stone-500" />
                </div>
                <div>
                  <p className="text-xs text-stone-500">Name</p>
                  <p className="font-medium text-sm">{order.customerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-ash-light flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-stone-500" />
                </div>
                <div>
                  <p className="text-xs text-stone-500">Email</p>
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="text-sm hover:text-rose"
                  >
                    {order.customerEmail}
                  </a>
                </div>
              </div>

              {order.customerPhone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ash-light flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-stone-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500">Phone</p>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="text-sm hover:text-rose"
                    >
                      {order.customerPhone}
                    </a>
                  </div>
                </div>
              )}

              {order.address && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-ash-light flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-stone-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500">Delivery address</p>
                    <p className="text-sm whitespace-pre-line">
                      {order.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Items card */}
          <div className="bg-white border border-ash rounded-2xl p-6">
            <h2 className="font-display text-lg mb-4">
              Items{" "}
              <span className="text-sm text-stone-500 font-normal">
                ({order.items.length})
              </span>
            </h2>

            <div className="divide-y divide-ash">
              {order.items.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center gap-3 py-3 first:pt-0"
                >
                  <div className="w-12 h-12 rounded-lg bg-ash-light shrink-0 overflow-hidden">
                    {i.image ? (
                      <img
                        src={i.image}
                        alt={i.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <Package size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{i.name}</p>
                    <p className="text-xs text-stone-500">
                      CAD {Number(i.price).toLocaleString()} × {i.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-sm shrink-0">
                    CAD {(Number(i.price) * i.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-ash mt-3 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>CAD {itemsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span className="text-stone-400">—</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-ash">
                <span>Total</span>
                <span>CAD {Number(order.totalAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-6 self-start">
          {/* Action card */}
          <div className="bg-white border border-ash rounded-2xl p-5">
            <h2 className="font-display text-lg mb-1">Actions</h2>
            <p className="text-xs text-stone-500 mb-4">
              Current status:{" "}
              <span className="font-medium text-ink capitalize">
                {order.status.toLowerCase().replace(/_/g, " ")}
              </span>
            </p>

            {order.status === "PAYMENT_SUBMITTED" && (
              <div className="mb-4 p-3 bg-rose-soft border border-rose/30 rounded-lg">
                <p className="text-xs font-medium text-rose-dark mb-2">
                  Payment awaiting confirmation
                </p>
                <ConfirmPaymentButton
                  orderId={order.orderId}
                  amount={Number(order.totalAmount)}
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 font-medium mb-2">
                Update status
              </label>
              <StatusSelect orderId={order.orderId} current={order.status} />
            </div>
          </div>

          {/* Quick info */}
          <div className="bg-white border border-ash rounded-2xl p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Amount</span>
              <span className="font-medium">
                CAD {Number(order.totalAmount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Items</span>
              <span className="font-medium">{order.items.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Payment ref</span>
              <span className="font-mono text-xs bg-ash-light px-2 py-0.5 rounded">
                {order.orderId}
              </span>
            </div>
          </div>
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
    PENDING_PAYMENT: "Pending payment",
    PAYMENT_SUBMITTED: "Awaiting confirmation",
    PAID: "Paid",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
  };
  return (
    <span
      className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-ash-light text-stone-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}
