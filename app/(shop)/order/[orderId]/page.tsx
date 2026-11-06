export const instant = false;

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import MarkPaidButton from "@/app/components/MarkPaidButton";
import CopyButton from "@/app/components/CopyButton";

export default async function OrderPage({
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

  const alreadySubmitted = order.status !== "PENDING_PAYMENT";
  const statusLabels: Record<string, string> = {
    PENDING_PAYMENT: "Awaiting payment",
    PAYMENT_SUBMITTED: "Payment being confirmed",
    PAID: "Payment confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
  };

  const PAYMENT_EMAIL = "payments@tafabrics.com";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-rose mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to shop
      </Link>

      <div className="text-center mb-10">
        <p className="label-xs text-rose mb-2">Order received</p>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-3xl">{order.orderId}</h1>
          <CopyButton value={order.orderId} label="Copy" />
        </div>
        <p className="text-stone-500 text-sm">
          Status:{" "}
          <span className="font-medium text-ink">
            {statusLabels[order.status]}
          </span>
        </p>
      </div>

      <div className="border border-ash rounded-2xl p-6 mb-6">
        <h2 className="font-display text-xl mb-4">Payment instructions</h2>
        <p className="text-sm text-stone-600 mb-4">
          Please send{" "}
          <strong className="text-ink">
            CAD{Number(order.totalAmount).toLocaleString()}
          </strong>{" "}
          to:
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-ash">
            <span className="text-stone-500">PayPal</span>
            <div className="flex items-center gap-2">
              <strong>{PAYMENT_EMAIL}</strong>
              <CopyButton value={PAYMENT_EMAIL} label="Copy" />
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-ash">
            <span className="text-stone-500">e-Transfer</span>
            <div className="flex items-center gap-2">
              <strong>{PAYMENT_EMAIL}</strong>
              <CopyButton value={PAYMENT_EMAIL} label="Copy" />
            </div>
          </div>
        </div>
        <div className="mt-4 bg-rose-soft border border-rose/20 rounded-lg p-4 text-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-rose-dark mb-1">Important</p>
              <p className="text-rose-dark/80">
                Include <strong>{order.orderId}</strong> in the payment
                reference/notes so we can match your payment.
              </p>
            </div>
            <CopyButton value={order.orderId} label="Copy ID" />
          </div>
        </div>
      </div>

      <div className="border border-ash rounded-2xl p-6 mb-6">
        <h2 className="font-display text-xl mb-4">Items</h2>
        <div className="divide-y divide-ash">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between py-3 text-sm">
              <span className="text-stone-600">
                {i.name} × {i.quantity}
              </span>
              <span className="font-medium">
                CAD{(Number(i.price) * i.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-ash mt-2 pt-4 flex justify-between">
          <span className="font-medium">Total</span>
          <span className="text-xl font-medium">
            CAD{Number(order.totalAmount).toLocaleString()}
          </span>
        </div>
      </div>

      {alreadySubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
          <CheckCircle2 className="mx-auto text-green-700 mb-2" size={24} />
          <p className="text-sm text-green-800 mb-4">
            We've received your payment notification and will confirm shortly.
          </p>
          <Link href="/" className="btn-rose inline-flex">
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <MarkPaidButton orderId={order.orderId} />
          <div className="text-center mt-4">
            <Link
              href="/"
              className="text-sm text-stone-500 hover:text-rose transition-colors"
            >
              Continue shopping without paying now
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
