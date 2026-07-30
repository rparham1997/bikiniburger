import test from "node:test";
import assert from "node:assert/strict";
import {
  createStripeWebhookSignature,
  parseStripeSignatureHeader,
  verifyStripeSignature
} from "../lib/stripe-webhook";

const payload = JSON.stringify({ id: "evt_test", type: "checkout.session.completed" });
const secret = "whsec_test_secret";
const timestamp = "1785436800";

test("parses Stripe signature headers with repeated keys", () => {
  const parsed = parseStripeSignatureHeader("t=123,v1=abc,v1=def,v0=old");

  assert.deepEqual(parsed.t, ["123"]);
  assert.deepEqual(parsed.v1, ["abc", "def"]);
  assert.deepEqual(parsed.v0, ["old"]);
});

test("verifies a valid Stripe webhook signature", () => {
  const signature = createStripeWebhookSignature(payload, secret, timestamp);
  const header = `t=${timestamp},v1=${signature}`;

  assert.equal(verifyStripeSignature(payload, header, secret), true);
});

test("accepts one valid signature among multiple signatures", () => {
  const signature = createStripeWebhookSignature(payload, secret, timestamp);
  const header = `t=${timestamp},v1=badbadbad,v1=${signature}`;

  assert.equal(verifyStripeSignature(payload, header, secret), true);
});

test("rejects invalid Stripe webhook signatures", () => {
  const header = `t=${timestamp},v1=${"0".repeat(64)}`;

  assert.equal(verifyStripeSignature(payload, header, secret), false);
});

test("rejects malformed Stripe webhook signature headers", () => {
  assert.equal(verifyStripeSignature(payload, "", secret), false);
  assert.equal(verifyStripeSignature(payload, "t=123", secret), false);
  assert.equal(verifyStripeSignature(payload, "v1=abc", secret), false);
});
