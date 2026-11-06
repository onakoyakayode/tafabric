"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmPaymentButton({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${orderId}/confirm`, {
      method: "POST",
    });
    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to confirm payment");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-rose text-white px-6 py-2.5 rounded-full text-sm font-medium
                   hover:bg-rose-dark transition-colors"
      >
        Confirm payment received
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => !loading && setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl mb-2">Confirm payment?</h3>
            <p className="text-sm text-stone-600 mb-4">
              You're marking order{" "}
              <strong className="font-mono text-xs">{orderId}</strong> as paid.
              The customer will receive a confirmation email and the order will
              move to processing.
            </p>
            <div className="bg-ash-light rounded-lg p-3 mb-4 flex justify-between text-sm">
              <span className="text-stone-600">Amount to verify</span>
              <span className="font-medium">₦{amount.toLocaleString()}</span>
            </div>
            {error && (
              <p className="text-rose text-sm mb-3 bg-rose-soft p-2 rounded">
                {error}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-4 py-2 rounded-full text-sm border border-ash
                           hover:border-ink transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-full text-sm bg-rose text-white
                           hover:bg-rose-dark transition-colors disabled:opacity-50"
              >
                {loading ? "Confirming…" : "Yes, payment received"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
