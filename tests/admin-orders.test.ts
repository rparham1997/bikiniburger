import test from "node:test";
import assert from "node:assert/strict";
import {
  mapPaidStripeSessionsToAdminOrders,
  mapStripeSessionToAdminOrder,
  type StripeCheckoutSession
} from "../lib/admin-orders";

const baseSession: StripeCheckoutSession = {
  id: "cs_live_123",
  amount_total: 3710,
  created: 1785513600,
  payment_status: "paid",
  customer_details: {
    email: "fallback@example.com",
    name: "Fallback Name",
    phone: "610-555-0100"
  },
  metadata: {
    fulfillment: "delivery",
    order_status: "preparing",
    customer_name: "Mia",
    phone: "610-649-3903",
    email: "mia@example.com",
    address: "44 Rittenhouse Pl, Ardmore, PA 19003",
    requested_time: "30 minutes",
    notes: "Ring bell",
    line_notes: "Beef Burger: no onions",
    tip: "$5.00",
    order_summary: "1x Beef Burger"
  },
  line_items: {
    data: [
      {
        quantity: 1,
        amount_total: 1100,
        price: {
          product: {
            name: "Beef Burger"
          }
        }
      },
      {
        quantity: 2,
        amount_total: 1250,
        description: "Fries"
      }
    ]
  }
};

test("maps Stripe checkout metadata into an admin order", () => {
  const order = mapStripeSessionToAdminOrder(baseSession);

  assert.equal(order.id, "cs_live_123");
  assert.equal(order.total, "$37.10");
  assert.equal(order.paymentStatus, "paid");
  assert.equal(order.status, "preparing");
  assert.equal(order.fulfillment, "delivery");
  assert.equal(order.customerName, "Mia");
  assert.equal(order.phone, "610-649-3903");
  assert.equal(order.email, "mia@example.com");
  assert.equal(order.address, "44 Rittenhouse Pl, Ardmore, PA 19003");
  assert.equal(order.requestedTime, "30 minutes");
  assert.match(order.notes, /Ring bell/);
  assert.match(order.notes, /Item notes: Beef Burger: no onions/);
  assert.match(order.notes, /Tip: \$5\.00/);
  assert.equal(order.items[0].name, "Beef Burger");
  assert.equal(order.items[1].name, "Fries");
});

test("falls back to Stripe customer details when metadata is missing", () => {
  const order = mapStripeSessionToAdminOrder({
    ...baseSession,
    metadata: {},
    line_items: undefined
  });

  assert.equal(order.status, "new");
  assert.equal(order.fulfillment, "pickup");
  assert.equal(order.customerName, "Fallback Name");
  assert.equal(order.phone, "610-555-0100");
  assert.equal(order.email, "fallback@example.com");
  assert.deepEqual(order.items, []);
});

test("filters out unpaid Stripe sessions", () => {
  const orders = mapPaidStripeSessionsToAdminOrders([
    baseSession,
    {
      ...baseSession,
      id: "cs_live_unpaid",
      payment_status: "unpaid"
    }
  ]);

  assert.equal(orders.length, 1);
  assert.equal(orders[0].id, "cs_live_123");
});
