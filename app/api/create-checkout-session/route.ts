import { NextResponse } from "next/server";
import { formatCurrency, getCheckoutConfigFromEnv, toCents, validateCheckoutRequest } from "@/lib/order-validation";
import { site } from "@/lib/site";
import { getStoreStatus } from "@/lib/store-status";

const appendLineItem = (
  params: URLSearchParams,
  index: number,
  name: string,
  unitAmount: number,
  quantity: number,
  description?: string
) => {
  params.append(`line_items[${index}][price_data][currency]`, "usd");
  params.append(`line_items[${index}][price_data][product_data][name]`, name);
  if (description) {
    params.append(`line_items[${index}][price_data][product_data][description]`, description.slice(0, 500));
  }
  params.append(`line_items[${index}][price_data][unit_amount]`, String(unitAmount));
  params.append(`line_items[${index}][quantity]`, String(quantity));
};

export async function POST(request: Request) {
  const storeStatus = getStoreStatus();
  if (!storeStatus.isAcceptingOrders) {
    return NextResponse.json({ error: storeStatus.message, storeStatus }, { status: 423 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY in Vercel." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const checkout = validateCheckoutRequest(body, getCheckoutConfigFromEnv());
  if (!checkout.ok) {
    return NextResponse.json({ error: checkout.error }, { status: checkout.status });
  }
  const order = checkout.value;

  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", `${site.siteUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`);
  params.append("cancel_url", `${site.siteUrl}/order/cancel`);
  params.append("phone_number_collection[enabled]", "true");
  params.append("customer_creation", "always");
  params.append("customer_email", order.email);

  order.lines.forEach((line, index) => {
    const itemDescription = [line.item.description, line.note ? `Special instructions: ${line.note}` : ""]
      .filter(Boolean)
      .join(" ");
    appendLineItem(
      params,
      index,
      line.item.name,
      toCents(line.item.price ?? 0),
      line.quantity,
      itemDescription
    );
  });

  let lineIndex = order.lines.length;
  if (order.taxCents > 0) {
    appendLineItem(params, lineIndex, "PA sales tax estimate", order.taxCents, 1);
    lineIndex += 1;
  }
  if (order.deliveryCents > 0) {
    appendLineItem(params, lineIndex, "In-house delivery", order.deliveryCents, 1, "Delivered by Bikini Burger drivers.");
    lineIndex += 1;
  }
  if (order.tipCents > 0) {
    appendLineItem(params, lineIndex, "Tip", order.tipCents, 1, "Optional customer tip for the Bikini Burger team.");
  }

  params.append("metadata[fulfillment]", order.fulfillment);
  params.append("metadata[order_status]", "new");
  params.append("metadata[customer_name]", order.customerName);
  params.append("metadata[phone]", order.phone);
  params.append("metadata[email]", order.email);
  params.append("metadata[address]", order.address);
  params.append("metadata[zip_code]", order.zipCode);
  params.append("metadata[requested_time]", order.requestedTime);
  params.append("metadata[notes]", order.notesWithMerch.slice(0, 500));
  params.append("metadata[line_notes]", order.lineNotes);
  params.append("metadata[merch_size]", order.merchSize);
  params.append("metadata[tip]", formatCurrency(order.tipCents));
  params.append("metadata[order_summary]", order.orderSummary);
  params.append("payment_intent_data[metadata][fulfillment]", order.fulfillment);
  params.append("payment_intent_data[metadata][order_status]", "new");
  params.append("payment_intent_data[metadata][customer_name]", order.customerName);
  params.append("payment_intent_data[metadata][phone]", order.phone);
  params.append("payment_intent_data[metadata][order_summary]", order.orderSummary);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const session = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: session.error?.message || "Unable to create checkout session." }, { status: 400 });
  }

  return NextResponse.json({ url: session.url });
}
