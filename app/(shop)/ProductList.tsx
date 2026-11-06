import { db } from "@/lib/db";
import Link from "next/link";
import type { Product } from "@/app/generated/prisma/client";

type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: unknown;
  bulkOnly: boolean;
  minQuantity: number;
};

export async function ProductCard({ product }: { product: ProductCardData }) {
  const image = (product.images as string[])[0];
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ash-light">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {product.bulkOnly && (
          <span className="absolute top-3 left-3 bg-white/95 text-ink text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
            Bulk · min {product.minQuantity}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="block text-center bg-rose text-white text-xs uppercase tracking-widest py-2.5 rounded-lg">
            View details
          </span>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium group-hover:text-rose transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-stone-500 mt-0.5">
          CAD {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export default async function ProductList({ category }: { category?: string }) {
  const products = await db.product.findMany({
    where: { active: true, ...(category && { category }) },
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-ash rounded-2xl">
        <p className="text-stone-500">No products in this category yet.</p>
        <Link
          href="/"
          className="text-rose text-sm hover:underline mt-2 inline-block"
        >
          Browse all products
        </Link>
      </div>
    );
  }

  return (
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
  );
}
