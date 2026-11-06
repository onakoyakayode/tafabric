import type { Order } from "@/app/generated/prisma/client";

export default function PaymentConfirmedEmail({ order }: { order: Order }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 24 }}>
      <h2>✅ Payment Confirmed — Order Being Processed</h2>
      <p>Hi {order.customerName},</p>
      <p>
        Your payment for order <strong>{order.orderId}</strong> has been
        confirmed. Your order will be processed shortly.
      </p>
      <p>
        <strong>Total paid:</strong> CAD
        {Number(order.totalAmount).toLocaleString()}
      </p>
      <p>— TA Fabrics</p>
    </div>
  );
}
