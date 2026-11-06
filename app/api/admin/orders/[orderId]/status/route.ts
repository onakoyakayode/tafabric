import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  status: z.enum([
    "PENDING_PAYMENT",
    "PAYMENT_SUBMITTED",
    "PAID",
    "PROCESSING",
    "SHIPPED",
  ]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await db.order.update({
    where: { orderId },
    data: { status: parsed.data.status },
  });
  return NextResponse.json(order);
}
