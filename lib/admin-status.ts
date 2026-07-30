export const orderStatuses = [
  "new",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "canceled"
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

const allowedStatuses = new Set<string>(orderStatuses);

export const isValidOrderStatus = (status: unknown): status is OrderStatus =>
  typeof status === "string" && allowedStatuses.has(status);

export const isValidAdminSessionId = (sessionId: unknown) =>
  typeof sessionId === "string" && sessionId.startsWith("cs_");

export const validateStatusUpdate = (sessionId: unknown, status: unknown) => {
  if (!isValidAdminSessionId(sessionId)) {
    return { ok: false as const, statusCode: 400, error: "A valid Stripe session id is required." };
  }

  if (!isValidOrderStatus(status)) {
    return { ok: false as const, statusCode: 400, error: "Choose a valid order status." };
  }

  return {
    ok: true as const,
    value: {
      sessionId: sessionId as string,
      status
    }
  };
};
