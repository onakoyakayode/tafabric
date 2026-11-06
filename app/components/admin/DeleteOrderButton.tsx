"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to delete order");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-stone-400 hover:text-rose transition-colors"
        title="Delete order"
      >
        <Trash2 size={14} />
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
            <h3 className="font-display text-xl mb-2">Delete this order?</h3>
            <p className="text-sm text-stone-600 mb-4">
              Order <strong className="font-mono text-xs">{orderId}</strong> and
              all its items will be permanently deleted. This cannot be undone.
            </p>
            {error && (
              <p className="text-rose text-sm mb-3 bg-rose-soft p-2 rounded">
                {error}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-4 py-2 rounded-full text-sm border border-ash hover:border-ink transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded-full text-sm bg-rose text-white hover:bg-rose-dark transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
