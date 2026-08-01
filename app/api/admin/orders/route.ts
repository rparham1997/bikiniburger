import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/admin-auth";
import { mapPaidStripeSessionsToAdminOrders, type StripeCheckoutSession } from "@/lib/admin-orders";

type AdminOrdersRequest = {
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as AdminOrdersRequest;
  const auth = verifyAdminPassword(body.password);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({
      orders: [],
      stripeConfigured: false,
      message: "Stripe is not connected yet. Real paid orders will appear here after STRIPE_SECRET_KEY is added."
    });
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

  const orders = mapPaidStripeSessionsToAdminOrders(payload.data as StripeCheckoutSession[]);

  return NextResponse.json({ orders, stripeConfigured: true });
}
