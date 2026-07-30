import { createHmac, timingSafeEqual } from "node:crypto";

export const parseStripeSignatureHeader = (signatureHeader: string) =>
  signatureHeader.split(",").reduce<Record<string, string[]>>((parts, pair) => {
    const [key, value] = pair.split("=");
    if (!key || !value) {
      return parts;
    }
    return {
      ...parts,
      [key]: [...(parts[key] || []), value]
    };
  }, {});

export const createStripeWebhookSignature = (payload: string, secret: string, timestamp: string | number) =>
  createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");

export const verifyStripeSignature = (payload: string, signatureHeader: string, secret: string) => {
  const signatureParts = parseStripeSignatureHeader(signatureHeader);
  const timestamp = signatureParts.t?.[0];
  const signatures = signatureParts.v1 || [];
  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const expectedSignature = createStripeWebhookSignature(payload, secret, timestamp);
  const expectedBuffer = Buffer.from(expectedSignature);

  return signatures.some((signature) => {
    const receivedBuffer = Buffer.from(signature);
    return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
  });
};
