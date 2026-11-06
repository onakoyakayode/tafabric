import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import PaymentConfirmedEmail from "@/lib/emails/PaymentConfirmedEmail";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const order = await db.order.findUnique({
    where: { orderId: orderId },
  });
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (["PAID", "PROCESSING", "SHIPPED"].includes(order.status)) {
    return NextResponse.json({ error: "Already confirmed" }, { status: 400 });
  }

  const updated = await db.order.update({
    where: { orderId },
    data: { status: "PAID", paidAt: new Date() },
  });

  await sendEmail({
    to: updated.customerEmail,
    subject: `TA Fabrics — payment confirmed (${updated.orderId})`,
    react: PaymentConfirmedEmail({ order: updated }),
  });

  return NextResponse.json({ success: true });
}
