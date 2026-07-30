import test from "node:test";
import assert from "node:assert/strict";
import {
  isValidAdminSessionId,
  isValidOrderStatus,
  orderStatuses,
  validateStatusUpdate
} from "../lib/admin-status";

test("accepts every supported order status", () => {
  for (const status of orderStatuses) {
    assert.equal(isValidOrderStatus(status), true);
  }
});

test("rejects unsupported order statuses", () => {
  assert.equal(isValidOrderStatus("refunded"), false);
  assert.equal(isValidOrderStatus(""), false);
  assert.equal(isValidOrderStatus(undefined), false);
});

test("accepts Stripe and demo order session ids", () => {
  assert.equal(isValidAdminSessionId("cs_live_123"), true);
  assert.equal(isValidAdminSessionId("cs_test_123"), true);
  assert.equal(isValidAdminSessionId("demo_pickup_1001"), true);
});

test("rejects unsafe or missing session ids", () => {
  assert.equal(isValidAdminSessionId("pi_123"), false);
  assert.equal(isValidAdminSessionId("../cs_live_123"), false);
  assert.equal(isValidAdminSessionId(""), false);
  assert.equal(isValidAdminSessionId(undefined), false);
});

test("validates a full admin status update", () => {
  const result = validateStatusUpdate("cs_live_123", "ready");

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.sessionId, "cs_live_123");
  assert.equal(result.value.status, "ready");
});

test("returns route-safe errors for invalid admin status updates", () => {
  const badSession = validateStatusUpdate("pi_123", "ready");
  assert.equal(badSession.ok, false);
  if (!badSession.ok) {
    assert.equal(badSession.statusCode, 400);
    assert.equal(badSession.error, "A valid Stripe session id is required.");
  }

  const badStatus = validateStatusUpdate("cs_live_123", "refunded");
  assert.equal(badStatus.ok, false);
  if (!badStatus.ok) {
    assert.equal(badStatus.statusCode, 400);
    assert.equal(badStatus.error, "Choose a valid order status.");
  }
});
