"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(
        data.error ??
          "Could not delete — this product may be referenced by existing orders.",
      );
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full text-stone-500 hover:bg-rose hover:text-white transition-colors"
        title="Delete product"
      >
        <Trash2 size={15} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !loading && setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center shrink-0">
                <Trash2 size={18} className="text-rose" />
              </div>
              <div>
                <h3 className="font-display text-xl mb-1">
                  Delete this product?
                </h3>
                <p className="text-sm text-stone-600">
                  This product will be permanently removed from the catalogue.
                  If it has existing orders, deletion will be blocked to keep
                  order history intact.
                </p>
              </div>
            </div>
            {error && (
              <p className="text-rose text-sm mb-3 bg-rose-soft p-2.5 rounded-lg">
                {error}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-5 py-2 rounded-full text-sm border border-ash
                           hover:border-ink transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2 rounded-full text-sm bg-rose text-white
                           hover:bg-rose-dark transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
