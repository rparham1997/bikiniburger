import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

type StripeEvent = {
  type: string;
  data: {
    object: {
      id: string;
      amount_total?: number | null;
      customer_details?: {
        email?: string | null;
        name?: string | null;
        phone?: string | null;
      } | null;
      metadata?: Record<string, string>;
      payment_status?: string;
    };
  };
};

type StripeLineItem = {
  quantity?: number | null;
  amount_total?: number | null;
  description?: string | null;
  price?: {
    product?: {
      name?: string | null;
    } | null;
  } | null;
};

const formatCents = (cents?: number | null) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format((cents ?? 0) / 100);

const verifyStripeSignature = (payload: string, signatureHeader: string, secret: string) => {
  const signatureParts = signatureHeader.split(",").reduce<Record<string, string[]>>((parts, pair) => {
    const [key, value] = pair.split("=");
    if (!key || !value) {
      return parts;
    }
    return {
      ...parts,
      [key]: [...(parts[key] || []), value]
    };
  }, {});

  const timestamp = signatureParts.t?.[0];
  const signatures = signatureParts.v1 || [];
  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = createHmac("sha256", secret).update(signedPayload).digest("hex");
  const expectedBuffer = Buffer.from(expectedSignature);

  return signatures.some((signature) => {
    const receivedBuffer = Buffer.from(signature);
    return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
  });
};

const fetchLineItems = async (sessionId: string) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return [];
  }

  const params = new URLSearchParams({
    limit: "100"
  });
  params.append("expand[]", "data.price.product");

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}/line_items?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();
  return (payload.data || []) as StripeLineItem[];
};

const sendSmsAlert = async (message: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_PHONE;
  const to = process.env.ORDER_ALERT_PHONE;

  if (!accountSid || !authToken || !from || !to) {
    return;
  }

  const params = new URLSearchParams({
    From: from,
    To: to,
    Body: message.slice(0, 1500)
  });

  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });
};

const sendOrderEmail = async (event: StripeEvent) => {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_ALERT_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const from = process.env.ORDER_ALERT_FROM || "Bikini Burger Orders <orders@bikiniburger.shop>";

  const session = event.data.object;
  const metadata = session.metadata || {};
  const fulfillment = metadata.fulfillment || "pickup";
  const orderStatus = metadata.order_status || "new";
  const lineItems = await fetchLineItems(session.id);
  const lineItemRows =
    lineItems.length > 0
      ? lineItems.map((item) => {
          const name = item.price?.product?.name || item.description || "Menu item";
          return `${item.quantity || 1}x ${name} - ${formatCents(item.amount_total)}`;
        })
      : [metadata.order_summary || "Open Stripe or the admin portal for full line items."];

  const rows = [
    `Stripe session: ${session.id}`,
    `Payment status: ${session.payment_status || "paid"}`,
    `Order status: ${orderStatus}`,
    `Fulfillment: ${fulfillment}`,
    `Total paid: ${formatCents(session.amount_total)}`,
    "",
    `Customer: ${metadata.customer_name || session.customer_details?.name || "Not provided"}`,
    `Phone: ${metadata.phone || session.customer_details?.phone || "Not provided"}`,
    `Email: ${metadata.email || session.customer_details?.email || "Not provided"}`,
    fulfillment === "delivery" ? `Delivery address: ${metadata.address || "Not provided"}` : "",
    `Requested time: ${metadata.requested_time || "ASAP"}`,
    metadata.notes ? `Notes: ${metadata.notes}` : "",
    "",
    "Order:",
    ...lineItemRows
  ].filter(Boolean);

  const alertText = rows.join("\n");

  if (apiKey && to) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        subject: `New Bikini Burger ${fulfillment} order - ${formatCents(session.amount_total)}`,
        text: alertText
      })
    });
  }

  await sendSmsAlert(
    `New Bikini Burger ${fulfillment} order ${formatCents(session.amount_total)} for ${
      metadata.customer_name || session.customer_details?.name || "customer"
    }. ${metadata.phone ? `Phone: ${metadata.phone}. ` : ""}${metadata.address ? `Address: ${metadata.address}. ` : ""}Items: ${
      metadata.order_summary || lineItemRows.join(", ")
    }`
  );
};

const sendCustomerConfirmationEmail = async (event: StripeEvent) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_ALERT_FROM || "Bikini Burger Orders <orders@bikiniburger.shop>";
  const session = event.data.object;
  const metadata = session.metadata || {};
  const customerEmail = metadata.email || session.customer_details?.email;

  if (!apiKey || !customerEmail) {
    return;
  }

  const fulfillment = metadata.fulfillment === "delivery" ? "delivery" : "pickup";
  const lineItems = await fetchLineItems(session.id);
  const lineItemRows =
    lineItems.length > 0
      ? lineItems.map((item) => {
          const name = item.price?.product?.name || item.description || "Menu item";
          return `${item.quantity || 1}x ${name} - ${formatCents(item.amount_total)}`;
        })
      : [metadata.order_summary || "Your order details were received."];
  const customerName = metadata.customer_name || session.customer_details?.name || "there";
  const destination =
    fulfillment === "delivery"
      ? metadata.address || "the delivery address from checkout"
      : "44 Rittenhouse Pl, Ardmore, PA 19003";

  const text = [
    `Hi ${customerName},`,
    "",
    "Thanks for ordering from Bikini Burger. Your payment went through and the shop received your order.",
    "",
    `Fulfillment: ${fulfillment}`,
    `Requested time: ${metadata.requested_time || "ASAP"}`,
    `Location: ${destination}`,
    `Total paid: ${formatCents(session.amount_total)}`,
    "",
    "Order:",
    ...lineItemRows,
    "",
    "Questions or changes? Call Bikini Burger at 610-649-3903."
  ].join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: customerEmail,
      subject: "Bikini Burger order confirmation",
      text
    })
  });
};

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook secret is not configured." }, { status: 503 });
  }

  if (!verifyStripeSignature(payload, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  const event = JSON.parse(payload) as StripeEvent;

  if (event.type === "checkout.session.completed") {
    await sendOrderEmail(event);
    await sendCustomerConfirmationEmail(event);
  }

  return NextResponse.json({ received: true });
}
