import { NextResponse } from "next/server";

type StatusRequest = {
  password?: string;
  sessionId?: string;
  status?: string;
};

const allowedStatuses = new Set(["new", "preparing", "ready", "out_for_delivery", "completed", "canceled"]);

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin password is not configured yet." }, { status: 503 });
  }

  const body = (await request.json()) as StatusRequest;
  if (body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  if (!body.sessionId || (!body.sessionId.startsWith("cs_") && !body.sessionId.startsWith("demo_"))) {
    return NextResponse.json({ error: "A valid Stripe session id is required." }, { status: 400 });
  }

  if (!body.status || !allowedStatuses.has(body.status)) {
    return NextResponse.json({ error: "Choose a valid order status." }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY || body.sessionId.startsWith("demo_")) {
    return NextResponse.json({ ok: true, status: body.status, demoMode: true });
  }

  const params = new URLSearchParams();
  params.append("metadata[order_status]", body.status);

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${body.sessionId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const payload = await response.json();
  if (!response.ok) {
    return NextResponse.json(
      { error: payload.error?.message || "Unable to update order status." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, status: body.status });
}
