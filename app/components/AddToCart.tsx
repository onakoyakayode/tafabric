"use client";
import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";

export default function AddToCart({
  product,
  minQuantity = 1,
}: {
  product: Omit<CartItem, "quantity">;
  minQuantity?: number;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(minQuantity);
  const [added, setAdded] = useState(false);

  return (
    <div className="space-y-4 max-w-sm">
      <div>
        <label className="label-xs block mb-2">
          Quantity {minQuantity > 1 && `(min ${minQuantity})`}
        </label>
        <div className="inline-flex items-center border border-ash rounded-full">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(minQuantity, q - 1))}
            className="p-3 hover:text-rose"
          >
            <Minus size={14} />
          </button>
          <input
            type="number"
            min={minQuantity}
            value={qty}
            onChange={(e) =>
              setQty(Math.max(minQuantity, Number(e.target.value)))
            }
            className="w-14 text-center border-0 focus:outline-none bg-transparent text-sm"
          />
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="p-3 hover:text-rose"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          add({ ...product, quantity: qty });
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
        className="btn-rose w-full"
      >
        {added ? (
          <span className="flex items-center gap-2">
            <Check size={16} /> Added to cart
          </span>
        ) : (
          "Add to cart"
        )}
      </button>
    </div>
  );
}
