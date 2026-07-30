import test from "node:test";
import assert from "node:assert/strict";
import { validateCheckoutRequest, type CheckoutConfig } from "../lib/order-validation";

const baseConfig: CheckoutConfig = {
  deliveryFeeCents: 500,
  deliveryMinimumCents: 1500,
  deliveryZips: ["19003"],
  pickupEnabled: true,
  deliveryEnabled: true,
  taxRate: 0.06,
  maxTipCents: 10000
};

const validPickupOrder = {
  lines: [{ id: "beef-burger", quantity: 2, note: "no onions" }],
  fulfillment: "pickup" as const,
  customerName: "Mia",
  phone: "610-649-3903",
  email: "owner@example.com",
  requestedTime: "ASAP",
  tipCents: 500
};

test("validates and totals a pickup order", () => {
  const result = validateCheckoutRequest(validPickupOrder, baseConfig);

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.fulfillment, "pickup");
  assert.equal(result.value.lines[0].quantity, 2);
  assert.equal(result.value.subtotalCents, 2200);
  assert.equal(result.value.taxCents, 132);
  assert.equal(result.value.deliveryCents, 0);
  assert.equal(result.value.tipCents, 500);
  assert.match(result.value.orderSummary, /2x Beef Burger/);
  assert.match(result.value.lineNotes, /no onions/);
});

test("rejects a missing receipt email", () => {
  const result = validateCheckoutRequest({ ...validPickupOrder, email: "" }, baseConfig);

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.status, 400);
  assert.equal(result.error, "Enter a valid receipt email.");
});

test("rejects delivery outside the active ZIP area", () => {
  const result = validateCheckoutRequest(
    {
      ...validPickupOrder,
      fulfillment: "delivery",
      address: "123 Lancaster Ave, Ardmore, PA",
      zipCode: "19104"
    },
    baseConfig
  );

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.status, 400);
  assert.equal(result.error, "That ZIP code is outside the current Bikini Burger delivery area.");
});

test("rejects delivery orders below the delivery minimum", () => {
  const result = validateCheckoutRequest(
    {
      ...validPickupOrder,
      lines: [{ id: "fries", quantity: 1 }],
      fulfillment: "delivery",
      address: "44 Rittenhouse Pl, Ardmore, PA",
      zipCode: "19003"
    },
    baseConfig
  );

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.status, 400);
  assert.match(result.error, /at least \$15\.00/);
});

test("requires a merch size when apparel is in the cart", () => {
  const result = validateCheckoutRequest(
    {
      ...validPickupOrder,
      lines: [{ id: "bikini-burger-tee", quantity: 1 }]
    },
    baseConfig
  );

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.status, 400);
  assert.equal(result.error, "Choose a merch size preference.");
});

test("caps custom tips and item quantities", () => {
  const result = validateCheckoutRequest(
    {
      ...validPickupOrder,
      lines: [{ id: "beef-burger", quantity: 99 }],
      tipCents: 500000
    },
    baseConfig
  );

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.lines[0].quantity, 20);
  assert.equal(result.value.tipCents, 10000);
});
