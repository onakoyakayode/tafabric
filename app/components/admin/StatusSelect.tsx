"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "../../../app/generated/prisma/client";

const OPTIONS: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAYMENT_SUBMITTED",
  "PAID",
  "PROCESSING",
  "SHIPPED",
];

export default function StatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: OrderStatus;
}) {
  const [value, setValue] = useState<OrderStatus>(current);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function update(next: OrderStatus) {
    setValue(next);
    setLoading(true);
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={loading}
      onChange={(e) => update(e.target.value as OrderStatus)}
      className="input max-w-xs"
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o.toLowerCase().replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
