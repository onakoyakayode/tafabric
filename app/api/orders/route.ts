import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOrderId } from "@/lib/orderId";
import { z } from "zod";

const schema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  address: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { customerName, customerEmail, customerPhone, address, items } =
    parsed.data;

  const products = await db.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });

  const orderItems = items.map((it) => {
    const p = products.find((p) => p.id === it.productId);
    if (!p) throw new Error(`Product ${it.productId} not found`);
    if (p.bulkOnly && it.quantity < p.minQuantity) {
      throw new Error(`${p.name} requires at least ${p.minQuantity} units`);
    }
    return {
      productId: p.id,
      name: p.name,
      image: (p.images as string[])[0] ?? null,
      quantity: it.quantity,
      price: p.price,
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0,
  );

  const order = await db.order.create({
    data: {
      orderId: generateOrderId(),
      customerName,
      customerEmail,
      customerPhone,
      address,
      totalAmount,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  return NextResponse.json(order);
}
