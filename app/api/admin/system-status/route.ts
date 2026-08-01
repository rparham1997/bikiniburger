import { NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/admin-auth";
import { getStoreStatus } from "@/lib/store-status";
import { site } from "@/lib/site";

type AdminStatusRequest = {
  password?: string;
};

const hasValue = (value: string | undefined) => Boolean(value && value.trim().length > 0);

export async function POST(request: Request) {
  const body = (await request.json()) as AdminStatusRequest;
  const auth = verifyAdminPassword(body.password);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
  }

  const storeStatus = getStoreStatus();
  const deliveryZips = (process.env.DELIVERY_ZIPS || "19003")
    .split(",")
    .map((zip) => zip.trim())
    .filter(Boolean);

  const checks = [
    {
      key: "stripeSecret",
      label: "Stripe secret key",
      ready: hasValue(process.env.STRIPE_SECRET_KEY),
      detail: "Required to send customers to secure Stripe checkout."
    },
    {
      key: "stripeWebhook",
      label: "Stripe webhook",
      ready: hasValue(process.env.STRIPE_WEBHOOK_SECRET),
      detail: "Required for paid order alerts and customer confirmation emails."
    },
    {
      key: "adminPassword",
      label: "Admin password",
      ready: hasValue(process.env.ADMIN_PASSWORD),
      detail: "Required to protect the owner order dashboard."
    },
    {
      key: "ownerEmail",
      label: "Owner order email",
      ready: hasValue(process.env.ORDER_ALERT_EMAIL),
      detail: process.env.ORDER_ALERT_EMAIL || "Add ORDER_ALERT_EMAIL in Vercel."
    },
    {
      key: "emailProvider",
      label: "Email sending",
      ready: hasValue(process.env.RESEND_API_KEY),
      detail: "Required for automatic owner and customer emails."
    },
    {
      key: "smsProvider",
      label: "SMS alerts",
      ready:
        hasValue(process.env.ORDER_ALERT_PHONE) &&
        hasValue(process.env.TWILIO_ACCOUNT_SID) &&
        hasValue(process.env.TWILIO_AUTH_TOKEN) &&
        hasValue(process.env.TWILIO_FROM_PHONE),
      optional: true,
      detail: "Optional. Add Twilio settings if the shop wants text alerts."
    },
    {
      key: "siteUrl",
      label: "Production site URL",
      ready: site.siteUrl.startsWith("https://"),
      detail: site.siteUrl
    },
    {
      key: "pickup",
      label: "Pickup ordering",
      ready: storeStatus.isPickupEnabled !== false,
      detail: storeStatus.isPickupEnabled === false ? "Pickup is paused." : "Pickup is enabled."
    },
    {
      key: "delivery",
      label: "Delivery ordering",
      ready: storeStatus.isDeliveryEnabled !== false,
      detail: storeStatus.isDeliveryEnabled === false ? "Delivery is paused." : `Delivery ZIPs: ${deliveryZips.join(", ") || "not restricted"}.`
    }
  ];

  const requiredChecks = checks.filter((check) => !check.optional);
  const readyCount = requiredChecks.filter((check) => check.ready).length;

  return NextResponse.json({
    checks,
    readyCount,
    requiredCount: requiredChecks.length,
    storeStatus,
    deliveryFeeCents: Number(process.env.DELIVERY_FEE_CENTS || "500"),
    deliveryMinimumCents: Number(process.env.DELIVERY_MINIMUM_CENTS || "1500")
  });
}
