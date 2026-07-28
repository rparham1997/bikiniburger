import { NextResponse } from "next/server";
import { demoOrders } from "@/lib/demo-orders";
import { formatPrice } from "@/lib/menu";

type AdminOrdersRequest = {
  password?: string;
};

type StripeCheckoutSession = {
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

const toDollars = (cents: number | null) => formatPrice((cents ?? 0) / 100);

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin password is not configured yet." }, { status: 503 });
  }

  const body = (await request.json()) as AdminOrdersRequest;
  if (body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ orders: demoOrders, demoMode: true });
  }

  const params = new URLSearchParams({
    limit: "50"
  });
  params.append("expand[]", "data.line_items.data.price.product");

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`
    },
    cache: "no-store"
  });

  const payload = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: payload.error?.message || "Unable to load Stripe orders." },
      { status: 400 }
    );
  }

  const orders = (payload.data as StripeCheckoutSession[])
    .filter((session) => session.payment_status === "paid")
    .map((session) => ({
      id: session.id,
      createdAt: new Date(session.created * 1000).toISOString(),
      total: toDollars(session.amount_total),
      paymentStatus: session.payment_status,
      status: session.metadata?.order_status || "new",
      fulfillment: session.metadata?.fulfillment || "pickup",
      customerName: session.metadata?.customer_name || session.customer_details?.name || "",
      phone: session.metadata?.phone || session.customer_details?.phone || "",
      email: session.metadata?.email || session.customer_details?.email || "",
      address: session.metadata?.address || "",
      requestedTime: session.metadata?.requested_time || "",
      notes: [
        session.metadata?.notes || "",
        session.metadata?.line_notes ? `Item notes: ${session.metadata.line_notes}` : "",
        session.metadata?.tip ? `Tip: ${session.metadata.tip}` : ""
      ]
        .filter(Boolean)
        .join(" | "),
      summary: session.metadata?.order_summary || "",
      items:
        session.line_items?.data?.map((line) => ({
          name: line.price?.product?.name || line.description || "Menu item",
          quantity: line.quantity || 1,
          total: toDollars(line.amount_total ?? 0)
        })) || []
    }));

  return NextResponse.json({ orders });
}
