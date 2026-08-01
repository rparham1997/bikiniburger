import test from "node:test";
import assert from "node:assert/strict";
import { verifyAdminPassword } from "../lib/admin-auth";

test("accepts a matching admin password", () => {
  const result = verifyAdminPassword("owner-secret", "owner-secret");

  assert.equal(result.ok, true);
});

test("rejects an incorrect admin password", () => {
  const result = verifyAdminPassword("wrong-secret", "owner-secret");

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.statusCode, 401);
  assert.equal(result.error, "Invalid admin password.");
});

test("rejects missing non-string admin password input", () => {
  const result = verifyAdminPassword(undefined, "owner-secret");

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.statusCode, 401);
  assert.equal(result.error, "Invalid admin password.");
});

test("returns a setup error when no admin password is configured", () => {
  const result = verifyAdminPassword("owner-secret", "");

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.statusCode, 503);
  assert.equal(result.error, "Admin password is not configured yet.");
});
