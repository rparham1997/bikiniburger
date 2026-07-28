import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function OrderCancelPage() {
  return (
    <div className="bg-burger-cream pt-28">
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-black/10 bg-white p-8 text-center shadow-loud">
          <ShoppingBag className="mx-auto h-14 w-14 text-burger-red" />
          <p className="mt-6 text-sm font-black uppercase tracking-[0.22em] text-burger-red">Checkout canceled</p>
          <h1 className="mt-3 font-display text-6xl uppercase leading-none text-black">No charge made</h1>
          <p className="mt-5 text-lg leading-8 text-black/68">
            Your order was not submitted. You can return to the order page and try checkout again.
          </p>
          <p className="mt-3 text-sm font-bold text-black/55">
            Your cart is saved on this device until you clear it or complete payment.
          </p>
          <Link
            href="/order"
            className="focus-ring mt-8 inline-flex rounded-full bg-black px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-burger-red"
          >
            Return to order
          </Link>
        </div>
      </section>
    </div>
  );
}
