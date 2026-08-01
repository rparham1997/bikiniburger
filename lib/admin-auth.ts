import { createHash, timingSafeEqual } from "node:crypto";

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; statusCode: 401 | 503; error: string };

const hashValue = (value: string) => createHash("sha256").update(value).digest();

export const verifyAdminPassword = (
  providedPassword: unknown,
  configuredPassword = process.env.ADMIN_PASSWORD
): AdminAuthResult => {
  if (!configuredPassword) {
    return { ok: false, statusCode: 503, error: "Admin password is not configured yet." };
  }

  if (typeof providedPassword !== "string") {
    return { ok: false, statusCode: 401, error: "Invalid admin password." };
  }

  const providedHash = hashValue(providedPassword);
  const configuredHash = hashValue(configuredPassword);
  if (!timingSafeEqual(providedHash, configuredHash)) {
    return { ok: false, statusCode: 401, error: "Invalid admin password." };
  }

  return { ok: true };
};
