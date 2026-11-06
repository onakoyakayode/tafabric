import type { Order } from "@/app/generated/prisma/client";

export default function PaymentSubmittedClientEmail({
  order,
}: {
  order: Order;
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 24 }}>
      <h2>Thank you for your payment notification, {order.customerName}!</h2>
      <p>
        We've received your notification for order{" "}
        <strong>{order.orderId}</strong>. Our team will verify your payment and
        confirm shortly.
      </p>
      <p>
        <strong>Amount:</strong> CAD{Number(order.totalAmount).toLocaleString()}
      </p>
      <p>
        You can reference your order using <strong>{order.orderId}</strong> if
        you need to contact us.
      </p>
      <p>— TA Fabrics</p>
    </div>
  );
}
