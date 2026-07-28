import type { Metadata } from "next";
import { OrderFlow } from "@/components/order-flow";
import { OrderProductPicker } from "@/components/order-product-picker";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order Online",
  description: "Order Bikini Burger online for pickup or in-house delivery from Ardmore, PA."
};

export default function OrderPage() {
  return (
    <div className="bg-burger-cream pt-28">
      <section className="px-4 pb-28 pt-14 sm:px-6 lg:px-8 lg:pb-14">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Order online"
            title="Pickup and local delivery"
            copy="Build a full Bikini Burger order, choose pickup or in-house delivery, then check out securely with Stripe."
          />
          <div className="mt-8 rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-burger-red">Live checkout</p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-none text-black">Full menu ordering</h2>
            <p className="mt-4 text-sm leading-6 text-black/64">
              Add burgers, platters, sides, toppings, drinks, shakes, kids meals and merch below. Paid orders go through Stripe with customer details, receipt email and order notes attached.
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-burger-red">Pickup</p>
              <p className="mt-3 text-sm font-bold leading-6 text-black/64">
                Pickup orders are prepared at 44 Rittenhouse Pl. Customers should bring their name and confirmation email.
              </p>
            </div>
            <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-burger-red">Local delivery</p>
              <p className="mt-3 text-sm font-bold leading-6 text-black/64">
                Delivery is handled by Bikini Burger drivers inside the active delivery area, with phone number and address required.
              </p>
            </div>
            <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-burger-red">Changes</p>
              <p className="mt-3 text-sm font-bold leading-6 text-black/64">
                After payment, call the shop right away for changes, cancellations or refund questions before the order is prepared.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <OrderProductPicker />
          </div>
          <div className="mt-10">
            <OrderFlow />
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <a
              href={site.doorDashUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-lg bg-burger-red p-6 text-white shadow-loud transition hover:bg-black"
            >
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white/70">Food delivery</p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-none">Order on DoorDash</h2>
              <p className="mt-4 text-sm leading-6 text-white/78">
                Best for live food orders, delivery tracking, driver dispatch, and DoorDash checkout.
              </p>
            </a>
            <a
              href={site.uberEatsUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-lg bg-black p-6 text-white shadow-loud transition hover:bg-burger-red"
            >
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white/70">Food delivery</p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-none">Order on Uber Eats</h2>
              <p className="mt-4 text-sm leading-6 text-white/78">
                Another live delivery option for customers who prefer Uber Eats checkout and tracking.
              </p>
            </a>
            <a
              href={site.seamlessUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-lg border border-black/10 bg-white p-6 text-black shadow-sm transition hover:border-burger-red hover:text-burger-red"
            >
              <p className="text-sm font-black uppercase tracking-[0.2em] text-burger-red">Food delivery</p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-none">Order on Seamless</h2>
              <p className="mt-4 text-sm leading-6 text-black/64">
                A familiar option for customers who already use Seamless for local food delivery.
              </p>
            </a>
            <a
              href={site.grubhubUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-lg border border-black/10 bg-white p-6 text-black shadow-sm transition hover:border-burger-red hover:text-burger-red"
            >
              <p className="text-sm font-black uppercase tracking-[0.2em] text-burger-red">Food delivery</p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-none">Order on Grubhub</h2>
              <p className="mt-4 text-sm leading-6 text-black/64">
                Another delivery checkout path for customers searching on Grubhub.
              </p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
