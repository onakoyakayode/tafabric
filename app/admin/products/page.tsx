export const instant = false;

import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Package, CheckCircle2, PauseCircle, Plus } from "lucide-react";
import DeleteProductButton from "@/app/components/admin/DeleteProductButton";
import ProductSearch from "@/app/components/admin/ProductSearch";

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } },
          { category: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [products, total, active, inactive] = await Promise.all([
    db.product.findMany({ where, orderBy: { createdAt: "desc" } }),
    db.product.count(),
    db.product.count({ where: { active: true } }),
    db.product.count({ where: { active: false } }),
  ]);

  const stats = [
    {
      label: "Total products",
      value: total,
      icon: Package,
      color: "text-ink",
      bg: "bg-ash-light",
    },
    {
      label: "Active",
      value: active,
      icon: CheckCircle2,
      color: "text-green-700",
      bg: "bg-green-100",
    },
    {
      label: "Inactive",
      value: inactive,
      icon: PauseCircle,
      color: "text-stone-600",
      bg: "bg-stone-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage your catalogue, pricing and availability
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-rose text-white px-4 py-2.5 rounded-full text-sm
                     font-medium hover:bg-rose-dark transition-colors self-start sm:self-auto"
        >
          <Plus size={16} /> New product
        </Link>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white border border-ash rounded-2xl p-5 flex items-start justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-stone-500 mb-2">
                  {s.label}
                </p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg}`}
              >
                <Icon size={16} className={s.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <ProductSearch />
        <p className="text-sm text-stone-500 hidden sm:block">
          {products.length} {products.length === 1 ? "result" : "results"}
          {q && ` for "${q}"`}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-ash overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ash-light border-b border-ash">
                <th className="p-4 w-16" />
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider text-stone-500">
                  Product
                </th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider text-stone-500">
                  Category
                </th>
                <th className="text-right p-4 font-medium text-xs uppercase tracking-wider text-stone-500">
                  Price
                </th>
                <th className="text-center p-4 font-medium text-xs uppercase tracking-wider text-stone-500">
                  Stock
                </th>
                <th className="text-left p-4 font-medium text-xs uppercase tracking-wider text-stone-500">
                  Status
                </th>
                <th className="text-right p-4 font-medium text-xs uppercase tracking-wider text-stone-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = (p.images as string[])[0];
                return (
                  <tr
                    key={p.id}
                    className="border-t border-ash hover:bg-ash-light/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-ash-light shrink-0">
                        {img ? (
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-stone-500 font-mono">
                        {p.slug}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 bg-ash-light text-stone-600 rounded-full capitalize">
                        {p.category.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium">
                      CAD {Number(p.price).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      {p.bulkOnly ? (
                        <span className="text-xs px-2 py-1 bg-amber-50 text-amber-800 rounded-full">
                          Bulk · min {p.minQuantity}
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          p.active
                            ? "bg-green-100 text-green-800"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.active ? "bg-green-600" : "bg-stone-400"
                          }`}
                        />
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-2 rounded-full text-stone-500 hover:bg-rose hover:text-white transition-colors"
                          title="Edit product"
                        >
                          <Pencil size={15} />
                        </Link>
                        <DeleteProductButton id={p.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ash-light mb-3">
              <Package size={20} className="text-stone-400" />
            </div>
            <p className="text-sm text-stone-500">
              {q ? `No products match "${q}"` : "No products yet"}
            </p>
            {q ? (
              <Link
                href="/admin/products"
                className="inline-block mt-2 text-rose text-sm hover:underline"
              >
                Clear search
              </Link>
            ) : (
              <Link
                href="/admin/products/new"
                className="inline-block mt-2 text-rose text-sm hover:underline"
              >
                Add your first product →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
