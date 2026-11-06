export const instant = false;

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import AddToCart from "@/app/components/AddToCart";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product || !product.active) notFound();

  const images = product.images as string[];

  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16 py-4">
      <div>
        <div className="aspect-4/5 rounded-2xl overflow-hidden bg-ash-light">
          <img
            src={images[0]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3 mt-3">
            {images.map((src) => (
              <div
                key={src}
                className="aspect-square rounded-lg overflow-hidden bg-ash-light"
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="md:py-6">
        <p className="label-xs text-rose mb-3">
          {product.category.replace(/-/g, " ")}
        </p>
        <h1 className="text-3xl md:text-4xl mb-3">{product.name}</h1>
        <p className="text-2xl mb-6">
          CAD{Number(product.price).toLocaleString()}
        </p>

        {product.bulkOnly && (
          <div
            className="bg-rose-soft border border-rose/20 rounded-lg px-4 py-3 mb-6
                          text-sm text-rose-dark"
          >
            Bulk order only · minimum {product.minQuantity} units
          </div>
        )}

        <p className="text-stone-600 leading-relaxed mb-8 whitespace-pre-line">
          {product.description}
        </p>

        <AddToCart
          product={{
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            image: images[0],
          }}
          minQuantity={product.bulkOnly ? product.minQuantity : 1}
        />
      </div>
    </div>
  );
}
