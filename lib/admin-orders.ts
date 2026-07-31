import { formatPrice } from "./menu";

export type StripeCheckoutSession = {
  id: string;
  amount_total: number | null;
  created: number;
  customer_details?: {
    email?: string | null;
    name?: string | null;
    phone?: string | null;
  } | null;
  line_items?: {
    data?: Array<{
      quantity?: number | null;
      description?: string | null;
      amount_total?: number | null;
      price?: {
        product?: {
          name?: string | null;
        } | null;
      } | null;
    }>;
  };
  metadata?: Record<string, string>;
  payment_status: string;
};

export type AdminOrder = {
  id: string;
  createdAt: string;
  total: string;
  paymentStatus: string;
  status: string;
  fulfillment: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  requestedTime: string;
  notes: string;
  summary: string;
  items: Array<{
    name: string;
    quantity: number;
    total: string;
  }>;
};

export const toDollars = (cents: number | null | undefined) => formatPrice((cents ?? 0) / 100);

export const mapStripeSessionToAdminOrder = (session: StripeCheckoutSession): AdminOrder => {
  const metadata = session.metadata || {};

  return {
    id: session.id,
    createdAt: new Date(session.created * 1000).toISOString(),
    total: toDollars(session.amount_total),
    paymentStatus: session.payment_status,
    status: metadata.order_status || "new",
    fulfillment: metadata.fulfillment || "pickup",
    customerName: metadata.customer_name || session.customer_details?.name || "",
    phone: metadata.phone || session.customer_details?.phone || "",
    email: metadata.email || session.customer_details?.email || "",
    address: metadata.address || "",
    requestedTime: metadata.requested_time || "",
    notes: [
      metadata.notes || "",
      metadata.line_notes ? `Item notes: ${metadata.line_notes}` : "",
      metadata.tip ? `Tip: ${metadata.tip}` : ""
    ]
      .filter(Boolean)
      .join(" | "),
    summary: metadata.order_summary || "",
    items:
      session.line_items?.data?.map((line) => ({
        name: line.price?.product?.name || line.description || "Menu item",
        quantity: line.quantity || 1,
        total: toDollars(line.amount_total)
      })) || []
  };
};

export const mapPaidStripeSessionsToAdminOrders = (sessions: StripeCheckoutSession[]) =>
  sessions.filter((session) => session.payment_status === "paid").map(mapStripeSessionToAdminOrder);
