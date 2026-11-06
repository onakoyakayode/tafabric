"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkPaidButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!confirm("Confirm you have sent the payment?")) return;
    setLoading(true);

    try {
      const res = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      // Safe parse — if the body is empty or not JSON, don't crash
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        alert(data.error ?? `Request failed (${res.status})`);
        setLoading(false);
        return;
      }

      router.refresh();
    } catch (err: any) {
      console.error("[MarkPaidButton]", err);
      alert("Network error — please try again");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn-rose w-full py-4 disabled:opacity-50"
    >
      {loading ? "Notifying…" : "I have made payment"}
    </button>
  );
}
