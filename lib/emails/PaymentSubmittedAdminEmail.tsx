import { Order, OrderItem } from "@/app/generated/prisma/client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function PaymentSubmittedAdminEmail({
  order,
}: {
  order: Order & { items: OrderItem[] };
}) {
  const itemsTotal = order.items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0,
  );

  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "32px 16px",
        color: "#0a0a0a",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #dadada",
        }}
      >
        {/* Header with logo */}
        <div
          style={{
            backgroundColor: "#0a0a0a",
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <img
            src={`${SITE_URL}/logo.png`}
            alt="TA Fabrics"
            width={40}
            height={32}
            style={{ display: "block" }}
          />
          <span
            style={{
              color: "#ffffff",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: -0.3,
            }}
          >
            TA <span style={{ color: "#c53967" }}>Fabrics</span>
          </span>
        </div>

        {/* Alert banner */}
        <div
          style={{
            backgroundColor: "#fdf2f6",
            borderBottom: "1px solid #f5d0dc",
            padding: "16px 32px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#c53967",
              fontWeight: 600,
            }}
          >
            Payment awaiting confirmation
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px" }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              margin: "0 0 8px",
              color: "#0a0a0a",
              letterSpacing: -0.3,
            }}
          >
            New payment submitted
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#57534e",
              margin: "0 0 24px",
              lineHeight: 1.6,
            }}
          >
            A customer has clicked <strong>“I have made payment”</strong> for
            the order below. Verify the payment in your PayPal/e-transfer
            account before confirming.
          </p>

          {/* Order summary */}
          <div
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #dadada",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 24,
            }}
          >
            <table style={{ width: "100%", fontSize: 14 }}>
              <tbody>
                <tr>
                  <td style={{ color: "#78716c", padding: "4px 0" }}>Order</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontFamily: "monospace",
                      fontWeight: 600,
                      padding: "4px 0",
                    }}
                  >
                    {order.orderId}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#78716c", padding: "4px 0" }}>
                    Customer
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 500,
                      padding: "4px 0",
                    }}
                  >
                    {order.customerName}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#78716c", padding: "4px 0" }}>Email</td>
                  <td style={{ textAlign: "right", padding: "4px 0" }}>
                    {order.customerEmail}
                  </td>
                </tr>
                <tr>
                  <td style={{ color: "#78716c", padding: "4px 0" }}>Total</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 700,
                      fontSize: 16,
                      padding: "4px 0",
                    }}
                  >
                    CAD {Number(order.totalAmount).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Items table */}
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#78716c",
              fontWeight: 600,
              margin: "0 0 8px",
            }}
          >
            Items
          </p>
          <table
            style={{
              width: "100%",
              fontSize: 14,
              borderCollapse: "collapse",
              marginBottom: 8,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #dadada" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 0",
                    color: "#78716c",
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "8px 0",
                    color: "#78716c",
                    fontWeight: 500,
                    fontSize: 12,
                    width: 60,
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "8px 0",
                    color: "#78716c",
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                >
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((i) => (
                <tr key={i.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                  <td style={{ padding: "10px 0" }}>{i.name}</td>
                  <td style={{ textAlign: "center", padding: "10px 0" }}>
                    {i.quantity}
                  </td>
                  <td style={{ textAlign: "right", padding: "10px 0" }}>
                    CAD {Number(i.price).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={2}
                  style={{ padding: "12px 0 0", fontWeight: 600 }}
                >
                  Subtotal
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "12px 0 0",
                    fontWeight: 600,
                  }}
                >
                  CAD {itemsTotal.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* CTA */}
        <div style={{ padding: "0 32px 28px" }}>
          <a
            href={`${SITE_URL}/admin/orders/${order.orderId}`}
            style={{
              display: "inline-block",
              backgroundColor: "#c53967",
              color: "#ffffff",
              textDecoration: "none",
              padding: "14px 28px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Review in admin dashboard →
          </a>
          <p
            style={{
              fontSize: 12,
              color: "#a8a29e",
              margin: "16px 0 0",
              lineHeight: 1.5,
            }}
          >
            If you're already logged in, the link opens the order directly.
            Otherwise you'll be asked to sign in first.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #dadada",
            padding: "16px 32px",
            fontSize: 11,
            color: "#a8a29e",
            textAlign: "center",
          }}
        >
          © TA Fabrics · Automated notification — please do not reply
        </div>
      </div>
    </div>
  );
}
