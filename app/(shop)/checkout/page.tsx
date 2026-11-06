"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: fd.get("name"),
        customerEmail: fd.get("email"),
        customerPhone: fd.get("phone"),
        address: fd.get("address"),
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create order");
      setLoading(false);
      return;
    }

    const order = await res.json();
    clear();
    router.push(`/order/${order.orderId}`);
  }

  if (items.length === 0) {
    return (
      <p className="text-center py-20 text-stone-500">Your cart is empty.</p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl mb-10">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="label-xs mb-3">Contact information</p>
            <div className="space-y-3">
              <input
                name="name"
                placeholder="Full name"
                required
                className="input"
              />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="input"
              />
              <input
                name="phone"
                placeholder="Phone number"
                className="input"
              />
            </div>
          </div>

          <div>
            <p className="label-xs mb-3">Delivery address</p>
            <textarea
              name="address"
              placeholder="Street, city, state, country"
              rows={3}
              className="input"
            />
          </div>

          {error && <p className="text-rose text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-rose w-full disabled:opacity-50"
          >
            {loading ? "Creating order…" : "Place order"}
          </button>
        </form>

        <div className="bg-ash-light rounded-2xl p-6 h-fit">
          <p className="label-xs mb-4">Order summary</p>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between text-sm">
                <span className="text-stone-600">
                  {i.name} × {i.quantity}
                </span>
                <span className="font-medium">
                  CAD{(i.price * i.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-ash mt-4 pt-4 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="text-xl font-medium">
              CAD{total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
