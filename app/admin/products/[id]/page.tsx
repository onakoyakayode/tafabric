export const instant = false;

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductForm from "@/app/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  const initial = {
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit product</h1>
      <ProductForm initial={initial} />
    </div>
  );
}
