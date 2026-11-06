import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import PaymentSubmittedAdminEmail from "@/lib/emails/PaymentSubmittedAdminEmail";
import PaymentSubmittedClientEmail from "@/lib/emails/PaymentSubmittedClientEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const orderId = body?.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        { error: "This order has already been marked as paid" },
        { status: 400 },
      );
    }

    await db.order.update({
      where: { orderId },
      data: { status: "PAYMENT_SUBMITTED", submittedAt: new Date() },
    });

    // Emails are best-effort — a failure here shouldn't roll back the order status
    const results = await Promise.allSettled([
      sendEmail({
        to: process.env.ADMIN_EMAIL!,
        subject: `[Payment pending] ${order.orderId}`,
        react: PaymentSubmittedAdminEmail({ order }),
      }),
      sendEmail({
        to: order.customerEmail,
        subject: `TA Fabrics — payment notification received (${order.orderId})`,
        react: PaymentSubmittedClientEmail({ order }),
      }),
    ]);

    results.forEach((r) => {
      if (r.status === "rejected") {
        console.error("[email failed]", r.reason);
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[payment/confirm] unexpected error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
