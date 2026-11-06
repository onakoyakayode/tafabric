import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { revalidateTag } from "next/cache";

const schema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  images: z.array(z.string().url()).min(1).optional(),
  bulkOnly: z.boolean().optional(),
  minQuantity: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );

  const product = await db.product.update({
    where: { id: params.id },
    data: parsed.data,
  });
  revalidateTag("products", "max");
  return NextResponse.json(product);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  await db.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
