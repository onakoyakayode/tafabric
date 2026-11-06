"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

const CATEGORIES = [
  "joggers",
  "ankara-short",
  "ankara-gown",
  "aso-oke-trouser",
  "aso-oke-skirt",
  "aso-ebi-ladies",
  "aso-oke-couples",
];

type InitialProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: string;
  images: unknown;
  bulkOnly: boolean;
  minQuantity: number;
  active: boolean;
};

export default function ProductForm({ initial }: { initial?: InitialProduct }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(
    Array.isArray(initial?.images) ? (initial.images as string[]) : [],
  );
  const [bulkOnly, setBulkOnly] = useState(initial?.bulkOnly ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      slug: fd.get("slug"),
      description: fd.get("description") || undefined,
      price: Number(fd.get("price")),
      category: fd.get("category"),
      images,
      bulkOnly,
      minQuantity: bulkOnly ? Number(fd.get("minQuantity")) || 1 : 1,
      active: fd.get("active") === "on",
    };

    const res = await fetch(
      initial ? `/api/admin/products/${initial.id}` : "/api/admin/products",
      {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "Failed");
      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6 pb-28">
      {error && (
        <div className="text-rose text-sm bg-rose-soft border border-rose/20 rounded-xl p-3">
          {error}
        </div>
      )}

      {/* Section: Basics */}
      <section className="bg-white border border-ash rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="font-display text-lg">Basic details</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Name, URL and description customers will see
          </p>
        </div>

        <div>
          <label className="label-xs block mb-1.5">Product name</label>
          <input
            name="name"
            placeholder="e.g. Ankara Midi Gown — Indigo"
            defaultValue={initial?.name}
            required
            className="input"
          />
        </div>

        <div>
          <label className="label-xs block mb-1.5">URL slug</label>
          <input
            name="slug"
            placeholder="e.g. ankara-midi-gown-indigo"
            defaultValue={initial?.slug}
            required
            className="input font-mono text-sm"
          />
          <p className="text-xs text-stone-500 mt-1.5">
            Lowercase, hyphenated, unique. Used in the product URL.
          </p>
        </div>

        <div>
          <label className="label-xs block mb-1.5">Description</label>
          <textarea
            name="description"
            placeholder="Fabric, fit, care instructions…"
            defaultValue={initial?.description ?? ""}
            rows={5}
            className="input resize-y"
          />
        </div>
      </section>

      {/* Section: Pricing & category */}
      <section className="bg-white border border-ash rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="font-display text-lg">Pricing & category</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            How the product is priced and grouped in the shop
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-xs block mb-1.5">Price (CAD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-sm pointer-events-none">
                CAD
              </span>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={initial?.price ?? ""}
                required
                className="input pl-12"
              />
            </div>
          </div>

          <div>
            <label className="label-xs block mb-1.5">Category</label>
            <select
              name="category"
              defaultValue={initial?.category}
              required
              className="input capitalize"
            >
              <option value="">Choose category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/-/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk order sub-section */}
        <div className="pt-5 border-t border-ash space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={bulkOnly}
              onChange={(e) => setBulkOnly(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-rose"
            />
            <div>
              <span className="text-sm font-medium">Bulk order only</span>
              <p className="text-xs text-stone-500">
                Customers must order a minimum quantity of this product
              </p>
            </div>
          </label>

          {bulkOnly && (
            <div className="pl-7">
              <label className="label-xs block mb-1.5">Minimum quantity</label>
              <input
                name="minQuantity"
                type="number"
                min={1}
                defaultValue={initial?.minQuantity ?? 1}
                className="input max-w-[140px]"
              />
            </div>
          )}
        </div>
      </section>

      {/* Section: Images */}
      <section className="bg-white border border-ash rounded-2xl p-6">
        <div className="mb-5">
          <h2 className="font-display text-lg">Images</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            First image becomes the product thumbnail · up to 5
          </p>
        </div>
        <ImageUploader onChange={setImages} />
      </section>

      {/* Section: Visibility */}
      <section className="bg-white border border-ash rounded-2xl p-6">
        <h2 className="font-display text-lg mb-4">Visibility</h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="active"
            defaultChecked={initial?.active ?? true}
            className="mt-0.5 w-4 h-4 accent-rose"
          />
          <div>
            <span className="text-sm font-medium">
              Active — visible in shop
            </span>
            <p className="text-xs text-stone-500">
              Inactive products stay in your catalogue but customers can't see
              or buy them
            </p>
          </div>
        </label>
      </section>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:pl-64 z-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-3">
          <div className="bg-white/95 backdrop-blur border border-ash rounded-full p-2 flex items-center justify-between gap-4 shadow-lg">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="text-sm text-stone-500 hover:text-ink px-4 py-2 rounded-full hover:bg-ash-light transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              {images.length === 0 && (
                <span className="text-xs text-stone-500 hidden sm:inline">
                  Add at least one image
                </span>
              )}
              <button
                type="submit"
                disabled={loading || images.length === 0}
                className="bg-rose text-white px-6 py-2.5 rounded-full text-sm font-medium
                           hover:bg-rose-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Saving…"
                  : initial
                    ? "Update product"
                    : "Create product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
