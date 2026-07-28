import Link from "next/link";
import { CheckCircle2, Clock, MapPin, ReceiptText } from "lucide-react";
import { ClearCartOnSuccess } from "@/components/clear-cart-on-success";
import { site } from "@/lib/site";

type SuccessPageProps = {
  searchParams?: {
    session_id?: string;
  };
};

type StripeSession = {
  amount_total?: number | null;
  metadata?: Record<string, string>;
  payment_status?: string;
};

const formatCents = (cents?: number | null) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format((cents ?? 0) / 100);

const getCheckoutSession = async (sessionId?: string) => {
  if (!sessionId?.startsWith("cs_") || !process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as StripeSession;
};

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const session = await getCheckoutSession(searchParams?.session_id);
  const metadata = session?.metadata || {};
  const fulfillment = metadata.fulfillment === "delivery" ? "Delivery" : "Pickup";
  const requestedTime = metadata.requested_time || "ASAP";
  const orderSummary = metadata.order_summary || "";

  return (
    <div className="bg-burger-cream pt-28">
      <ClearCartOnSuccess />
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-black/10 bg-white p-8 text-center shadow-loud">
          <CheckCircle2 className="mx-auto h-14 w-14 text-burger-red" />
          <p className="mt-6 text-sm font-black uppercase tracking-[0.22em] text-burger-red">Order received</p>
          <h1 className="mt-3 font-display text-6xl uppercase leading-none text-black">Thank you</h1>
          <p className="mt-5 text-lg leading-8 text-black/68">
            Your payment went through. Bikini Burger will prepare your order for pickup or in-house delivery using the details from checkout.
          </p>
          {session && (
            <div className="mt-7 grid gap-3 rounded-lg bg-burger-cream p-5 text-left">
              <div className="flex items-start gap-3">
                <ReceiptText className="mt-1 h-5 w-5 shrink-0 text-burger-red" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-burger-red">Paid total</p>
                  <p className="font-display text-4xl uppercase leading-none text-black">
                    {formatCents(session.amount_total)}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 border-t border-black/10 pt-4 sm:grid-cols-2">
                <p className="flex gap-2 text-sm font-bold leading-6 text-black/70">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-burger-red" />
                  {fulfillment === "Delivery" ? metadata.address || "Delivery address received" : site.address}
                </p>
                <p className="flex gap-2 text-sm font-bold leading-6 text-black/70">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-burger-red" />
                  {fulfillment} time: {requestedTime}
                </p>
              </div>
              {orderSummary && (
                <p className="border-t border-black/10 pt-4 text-sm font-bold leading-6 text-black/65">
                  Order: {orderSummary}
                </p>
              )}
            </div>
          )}
          <p className="mt-4 text-sm font-bold text-black/55">
            Questions or changes? Call the shop at {site.phone}.
          </p>
          <Link
            href="/order"
            className="focus-ring mt-8 inline-flex rounded-full bg-black px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-burger-red"
          >
            Order again
          </Link>
        </div>
      </section>
    </div>
  );
}
