"use client";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, remove, updateQty, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <h1 className="text-3xl mb-3">Your cart is empty</h1>
        <p className="text-stone-500 mb-8">
          Discover fabrics made for celebrations.
        </p>
        <Link href="/" className="btn-rose">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl mb-8">Your cart</h1>
      <div className="divide-y divide-ash">
        {items.map((i) => (
          <div key={i.productId} className="flex gap-4 py-6">
            {i.image && (
              <img
                src={i.image}
                alt={i.name}
                className="h-24 w-20 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium">{i.name}</h3>
              <p className="text-sm text-stone-500 mt-0.5">
                CAD{i.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <input
                  type="number"
                  min={1}
                  value={i.quantity}
                  onChange={(e) =>
                    updateQty(i.productId, Math.max(1, Number(e.target.value)))
                  }
                  className="w-16 border border-ash rounded px-2 py-1 text-sm text-center
                             focus:outline-none focus:border-rose"
                />
                <button
                  onClick={() => remove(i.productId)}
                  className="text-stone-400 hover:text-rose transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="font-medium">
              CAD{(i.price * i.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div
        className="border-t border-ash pt-6 mt-6 flex flex-col sm:flex-row
                      justify-between items-start sm:items-center gap-4"
      >
        <div>
          <p className="label-xs">Subtotal</p>
          <p className="text-2xl font-medium mt-1">
            CAD{total.toLocaleString()}
          </p>
        </div>
        <Link href="/checkout" className="btn-rose w-full sm:w-auto">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
