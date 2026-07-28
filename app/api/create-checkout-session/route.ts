import { NextResponse } from "next/server";
import { menuItems, merchItems } from "@/lib/menu";
import { site } from "@/lib/site";
import { getStoreStatus } from "@/lib/store-status";

type CheckoutLine = {
  id: string;
  quantity: number;
  note?: string;
};

type CheckoutRequest = {
  lines?: CheckoutLine[];
  fulfillment: "pickup" | "delivery";
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  zipCode?: string;
  notes?: string;
  merchSize?: string;
  requestedTime?: string;
  tipCents?: number;
};

const TAX_RATE = 0.06;
const MAX_TIP_CENTS = 10000;
const DELIVERY_FEE_CENTS = Number(process.env.DELIVERY_FEE_CENTS || "500");
const DELIVERY_MINIMUM_CENTS = Number(process.env.DELIVERY_MINIMUM_CENTS || "1500");
const PICKUP_ENABLED = process.env.PICKUP_ENABLED !== "false";
const DELIVERY_ENABLED = process.env.DELIVERY_ENABLED !== "false";
const DELIVERY_ZIPS = (process.env.DELIVERY_ZIPS || "19003")
  .split(",")
  .map((zip) => zip.trim())
  .filter(Boolean);

const orderableItems = [...menuItems, ...merchItems].filter((item) => item.price !== undefined);
const apparelItemIds = new Set(["bikini-burger-sweatshirt", "bikini-burger-tee"]);

const toCents = (price: number) => Math.round(price * 100);
const sanitize = (value: unknown, maxLength = 500) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

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

  const body = (await request.json()) as CheckoutRequest;
  const customerName = sanitize(body.customerName, 120);
  const phone = sanitize(body.phone, 80);
  const email = sanitize(body.email, 200);
  const address = sanitize(body.address, 500);
  const requestedTime = sanitize(body.requestedTime || "ASAP", 120);
  const notes = sanitize(body.notes, 500);
  const merchSize = sanitize(body.merchSize, 80);
  const tipCents = Math.max(0, Math.min(MAX_TIP_CENTS, Math.round(Number(body.tipCents) || 0)));

  if (body.fulfillment !== "pickup" && body.fulfillment !== "delivery") {
    return NextResponse.json({ error: "Choose pickup or delivery." }, { status: 400 });
  }

  if (body.fulfillment === "pickup" && !PICKUP_ENABLED) {
    return NextResponse.json({ error: "Pickup ordering is paused right now." }, { status: 423 });
  }

  if (body.fulfillment === "delivery" && !DELIVERY_ENABLED) {
    return NextResponse.json({ error: "Delivery ordering is paused right now." }, { status: 423 });
  }

  const requestLines = Array.isArray(body.lines) ? body.lines : [];
  const lines = requestLines
    .map((line) => ({
      ...line,
      quantity: Math.max(1, Math.min(20, Math.floor(Number(line.quantity) || 1))),
      note: sanitize(line.note, 180),
      item: orderableItems.find((item) => item.id === line.id)
    }))
    .filter((line) => line.item);

  if (lines.length === 0) {
    return NextResponse.json({ error: "Add at least one item to the cart." }, { status: 400 });
  }

  if (!customerName) {
    return NextResponse.json({ error: "Customer name is required." }, { status: 400 });
  }

  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ error: "A valid phone number is required." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid receipt email." }, { status: 400 });
  }

  const hasApparel = lines.some((line) => apparelItemIds.has(line.item?.id || ""));
  if (hasApparel && !merchSize) {
    return NextResponse.json({ error: "Choose a merch size preference." }, { status: 400 });
  }

  if (body.fulfillment === "delivery" && !address) {
    return NextResponse.json({ error: "Delivery address is required." }, { status: 400 });
  }

  if (body.fulfillment === "delivery") {
    const zipCode = (body.zipCode || "").replace(/\D/g, "").slice(0, 5);
    if (!zipCode) {
      return NextResponse.json({ error: "Delivery ZIP code is required." }, { status: 400 });
    }
    if (DELIVERY_ZIPS.length > 0 && !DELIVERY_ZIPS.includes(zipCode)) {
      return NextResponse.json(
        { error: "That ZIP code is outside the current Bikini Burger delivery area." },
        { status: 400 }
      );
    }
  }

  const subtotalCents = lines.reduce((sum, line) => sum + toCents(line.item?.price ?? 0) * line.quantity, 0);

  if (body.fulfillment === "delivery" && subtotalCents < DELIVERY_MINIMUM_CENTS) {
    return NextResponse.json(
      { error: `Delivery orders must be at least ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(DELIVERY_MINIMUM_CENTS / 100)} before tax and delivery.` },
      { status: 400 }
    );
  }

  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const deliveryCents = body.fulfillment === "delivery" ? DELIVERY_FEE_CENTS : 0;

  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", `${site.siteUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`);
  params.append("cancel_url", `${site.siteUrl}/order/cancel`);
  params.append("phone_number_collection[enabled]", "true");
  params.append("customer_creation", "always");
  if (email) {
    params.append("customer_email", email);
  }

  lines.forEach((line, index) => {
    const itemDescription = [line.item?.description, line.note ? `Special instructions: ${line.note}` : ""]
      .filter(Boolean)
      .join(" ");
    appendLineItem(
      params,
      index,
      line.item?.name ?? "Menu item",
      toCents(line.item?.price ?? 0),
      line.quantity,
      itemDescription
    );
  });

  let lineIndex = lines.length;
  if (taxCents > 0) {
    appendLineItem(params, lineIndex, "PA sales tax estimate", taxCents, 1);
    lineIndex += 1;
  }
  if (deliveryCents > 0) {
    appendLineItem(params, lineIndex, "In-house delivery", deliveryCents, 1, "Delivered by Bikini Burger drivers.");
    lineIndex += 1;
  }
  if (tipCents > 0) {
    appendLineItem(params, lineIndex, "Tip", tipCents, 1, "Optional customer tip for the Bikini Burger team.");
  }

  const orderSummary = lines
    .map((line) => `${line.quantity}x ${line.item?.name}${line.note ? ` (${line.note})` : ""}`)
    .join(", ")
    .slice(0, 500);
  const lineNotes = lines
    .filter((line) => line.note)
    .map((line) => `${line.item?.name}: ${line.note}`)
    .join(" | ")
    .slice(0, 500);
  const notesWithMerch = [notes, merchSize ? `Merch size preference: ${merchSize}` : ""]
    .filter(Boolean)
    .join(" | ");

  params.append("metadata[fulfillment]", body.fulfillment);
  params.append("metadata[order_status]", "new");
  params.append("metadata[customer_name]", customerName);
  params.append("metadata[phone]", phone);
  params.append("metadata[email]", email);
  params.append("metadata[address]", address);
  params.append("metadata[zip_code]", (body.zipCode || "").replace(/\D/g, "").slice(0, 5));
  params.append("metadata[requested_time]", requestedTime);
  params.append("metadata[notes]", notesWithMerch.slice(0, 500));
  params.append("metadata[line_notes]", lineNotes);
  params.append("metadata[merch_size]", merchSize);
  params.append("metadata[tip]", new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(tipCents / 100));
  params.append("metadata[order_summary]", orderSummary);
  params.append("payment_intent_data[metadata][fulfillment]", body.fulfillment);
  params.append("payment_intent_data[metadata][order_status]", "new");
  params.append("payment_intent_data[metadata][customer_name]", customerName);
  params.append("payment_intent_data[metadata][phone]", phone);
  params.append("payment_intent_data[metadata][order_summary]", orderSummary);

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
