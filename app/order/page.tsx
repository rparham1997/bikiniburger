import type { Metadata } from "next";
import { OrderFlow } from "@/components/order-flow";
import { OrderProductPicker } from "@/components/order-product-picker";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order Online",
  description: "Order Bikini Burger delivery through partner apps and reserve merch for store pickup."
};

export default function OrderPage() {
  return (
    <div className="bg-burger-cream pt-28">
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Order online"
            title="Food delivery and merch pickup"
            copy="Send food orders through DoorDash, Uber Eats, Seamless or Grubhub. Use the cart below to reserve merch for pickup at the shop."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
          <div className="mt-4 rounded-lg border border-black/10 bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-burger-red">Shop cart</p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-none text-black">Merch pickup</h2>
              <p className="mt-4 text-sm leading-6 text-black/64">
                Add custom merch below for store pickup. Payment and final availability can be handled at the counter until live checkout is connected.
              </p>
          </div>
          <div className="mt-10">
            <OrderProductPicker />
          </div>
          <div className="mt-10">
            <OrderFlow />
          </div>
        </div>
      </section>
    </div>
  );
}
