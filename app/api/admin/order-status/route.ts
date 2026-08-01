import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/admin-auth";
import { validateStatusUpdate } from "@/lib/admin-status";

type StatusRequest = {
  password?: string;
  sessionId?: string;
  status?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as StatusRequest;
  const auth = verifyAdminPassword(body.password);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
  }

  const statusUpdate = validateStatusUpdate(body.sessionId, body.status);
  if (!statusUpdate.ok) {
    return NextResponse.json({ error: statusUpdate.error }, { status: statusUpdate.statusCode });
  }
  const { sessionId, status } = statusUpdate.value;

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY in Vercel." }, { status: 503 });
  }

  const params = new URLSearchParams();
  params.append("metadata[order_status]", status);

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
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

  return NextResponse.json({ ok: true, status });
}
