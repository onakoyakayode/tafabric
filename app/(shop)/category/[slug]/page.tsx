export const instant = false;

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { ProductCard } from "../../ProductList";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = await db.product.findMany({
    where: { active: true, category: slug },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-rose mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to shop
        </Link>

        <p className="label-xs text-rose mb-2">Collection</p>
        <h1 className="text-3xl md:text-4xl mb-2">{category.label}</h1>
        <p className="text-stone-600 max-w-2xl">{category.description}</p>
        <p className="text-sm text-stone-400 mt-3">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Category pills (switch between categories) */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const active = c.slug === slug;
          return (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                active
                  ? "bg-ink text-white border-ink"
                  : "border-ash hover:bg-ink hover:text-white hover:border-ink"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-ash rounded-2xl">
          <p className="text-stone-500 mb-2">
            No products in this category yet.
          </p>
          <Link href="/" className="text-rose text-sm hover:underline">
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: Number(p.price),
                images: p.images,
                bulkOnly: p.bulkOnly,
                minQuantity: p.minQuantity,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
