import { menuItems, merchItems, type MenuItem } from "./menu";

export type CheckoutLineInput = {
  id: string;
  quantity: number;
  note?: string;
};

export type CheckoutRequestInput = {
  lines?: CheckoutLineInput[];
  fulfillment?: "pickup" | "delivery";
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  zipCode?: string;
  notes?: string;
  merchSize?: string;
  requestedTime?: string;
  tipCents?: number;
};

export type CheckoutConfig = {
  deliveryFeeCents: number;
  deliveryMinimumCents: number;
  deliveryZips: string[];
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  taxRate: number;
  maxTipCents: number;
};

export type ValidatedCheckoutLine = {
  id: string;
  quantity: number;
  note: string;
  item: MenuItem;
};

export type ValidatedCheckout = {
  lines: ValidatedCheckoutLine[];
  fulfillment: "pickup" | "delivery";
  customerName: string;
  phone: string;
  email: string;
  address: string;
  zipCode: string;
  notes: string;
  merchSize: string;
  requestedTime: string;
  tipCents: number;
  subtotalCents: number;
  taxCents: number;
  deliveryCents: number;
  orderSummary: string;
  lineNotes: string;
  notesWithMerch: string;
};

export const DEFAULT_TAX_RATE = 0.06;
export const DEFAULT_MAX_TIP_CENTS = 10000;
export const apparelItemIds = new Set(["bikini-burger-sweatshirt", "bikini-burger-tee"]);
export const orderableItems = [...menuItems, ...merchItems].filter((item) => item.price !== undefined);

export const toCents = (price: number) => Math.round(price * 100);

export const sanitize = (value: unknown, maxLength = 500) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

export const formatCurrency = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export const getCheckoutConfigFromEnv = (): CheckoutConfig => ({
  deliveryFeeCents: Number(process.env.DELIVERY_FEE_CENTS || "500"),
  deliveryMinimumCents: Number(process.env.DELIVERY_MINIMUM_CENTS || "1500"),
  deliveryZips: (process.env.DELIVERY_ZIPS || "19003")
    .split(",")
    .map((zip) => zip.trim())
    .filter(Boolean),
  pickupEnabled: process.env.PICKUP_ENABLED !== "false",
  deliveryEnabled: process.env.DELIVERY_ENABLED !== "false",
  taxRate: DEFAULT_TAX_RATE,
  maxTipCents: DEFAULT_MAX_TIP_CENTS
});

export const validateCheckoutRequest = (
  body: CheckoutRequestInput,
  config: CheckoutConfig = getCheckoutConfigFromEnv()
) => {
  const fulfillment = body.fulfillment;
  const customerName = sanitize(body.customerName, 120);
  const phone = sanitize(body.phone, 80);
  const email = sanitize(body.email, 200);
  const address = sanitize(body.address, 500);
  const requestedTime = sanitize(body.requestedTime || "ASAP", 120);
  const notes = sanitize(body.notes, 500);
  const merchSize = sanitize(body.merchSize, 80);
  const tipCents = Math.max(0, Math.min(config.maxTipCents, Math.round(Number(body.tipCents) || 0)));

  if (fulfillment !== "pickup" && fulfillment !== "delivery") {
    return { ok: false as const, status: 400, error: "Choose pickup or delivery." };
  }

  if (fulfillment === "pickup" && !config.pickupEnabled) {
    return { ok: false as const, status: 423, error: "Pickup ordering is paused right now." };
  }

  if (fulfillment === "delivery" && !config.deliveryEnabled) {
    return { ok: false as const, status: 423, error: "Delivery ordering is paused right now." };
  }

  const requestLines = Array.isArray(body.lines) ? body.lines : [];
  const lines = requestLines
    .map((line) => ({
      id: line.id,
      quantity: Math.max(1, Math.min(20, Math.floor(Number(line.quantity) || 1))),
      note: sanitize(line.note, 180),
      item: orderableItems.find((item) => item.id === line.id)
    }))
    .filter((line): line is ValidatedCheckoutLine => Boolean(line.item));

  if (lines.length === 0) {
    return { ok: false as const, status: 400, error: "Add at least one item to the cart." };
  }

  if (!customerName) {
    return { ok: false as const, status: 400, error: "Customer name is required." };
  }

  if (phone.replace(/\D/g, "").length < 10) {
    return { ok: false as const, status: 400, error: "A valid phone number is required." };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, status: 400, error: "Enter a valid receipt email." };
  }

  const hasApparel = lines.some((line) => apparelItemIds.has(line.item.id));
  if (hasApparel && !merchSize) {
    return { ok: false as const, status: 400, error: "Choose a merch size preference." };
  }

  if (fulfillment === "delivery" && !address) {
    return { ok: false as const, status: 400, error: "Delivery address is required." };
  }

  const zipCode = (body.zipCode || "").replace(/\D/g, "").slice(0, 5);
  if (fulfillment === "delivery") {
    if (!zipCode) {
      return { ok: false as const, status: 400, error: "Delivery ZIP code is required." };
    }
    if (config.deliveryZips.length > 0 && !config.deliveryZips.includes(zipCode)) {
      return { ok: false as const, status: 400, error: "That ZIP code is outside the current Bikini Burger delivery area." };
    }
  }

  const subtotalCents = lines.reduce((sum, line) => sum + toCents(line.item.price ?? 0) * line.quantity, 0);

  if (fulfillment === "delivery" && subtotalCents < config.deliveryMinimumCents) {
    return {
      ok: false as const,
      status: 400,
      error: `Delivery orders must be at least ${formatCurrency(config.deliveryMinimumCents)} before tax and delivery.`
    };
  }

  const taxCents = Math.round(subtotalCents * config.taxRate);
  const deliveryCents = fulfillment === "delivery" ? config.deliveryFeeCents : 0;
  const orderSummary = lines
    .map((line) => `${line.quantity}x ${line.item.name}${line.note ? ` (${line.note})` : ""}`)
    .join(", ")
    .slice(0, 500);
  const lineNotes = lines
    .filter((line) => line.note)
    .map((line) => `${line.item.name}: ${line.note}`)
    .join(" | ")
    .slice(0, 500);
  const notesWithMerch = [notes, merchSize ? `Merch size preference: ${merchSize}` : ""]
    .filter(Boolean)
    .join(" | ");

  return {
    ok: true as const,
    value: {
      lines,
      fulfillment,
      customerName,
      phone,
      email,
      address,
      zipCode,
      notes,
      merchSize,
      requestedTime,
      tipCents,
      subtotalCents,
      taxCents,
      deliveryCents,
      orderSummary,
      lineNotes,
      notesWithMerch
    }
  };
};
